import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import * as fs from 'fs';
import path from 'path';
import { CONFIG } from '../../../config/config';

const execAsync = promisify(exec);
const LOG_FILE = path.join(process.cwd(), 'batch-process-log.txt');

interface Task {
  name: string;
  command: string;
  description: string;
  category: 'metadata' | 'transfer' | 'check' | 'other' | 'setup';
  dependsOn?: string[];
  filePath: string;
  skipIf?: (stdout: string) => boolean;
  retries?: number;
}

const DEFAULT_TOKEN_ADDRESS = CONFIG.TOKEN_ADDRESS;
const WALLET_FILE = CONFIG.WALLET_FILE;

// Map to store task results
const taskResults = new Map<string, string>();

// Command to create ATA (using Solana CLI)
const createATACommand = `ts-node -e "
const { Connection, PublicKey, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } = require('@solana/spl-token');
const fs = require('fs');

async function createATA() {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const walletData = JSON.parse(fs.readFileSync('${WALLET_FILE}', 'utf-8'));
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
    const tokenMint = new PublicKey('${DEFAULT_TOKEN_ADDRESS}');
    
    console.log('Checking Associated Token Account...');
    const ata = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
    
    try {
      await getAccount(connection, ata);
      console.log('Associated Token Account already exists: ' + ata.toString());
      return;
    } catch (error) {
      console.log('Creating Associated Token Account...');
      const transaction = createAssociatedTokenAccountInstruction(
        wallet.publicKey, ata, wallet.publicKey, tokenMint
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      const tx = {
        feePayer: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: [transaction]
      };
      
      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Associated Token Account created: ' + ata.toString());
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createATA();
"`;

// Use only existing files
const tasks: Task[] = [
  {
    name: 'Check Wallet Balance',
    command: 'ts-node docs/examples/basic/check-balance.ts',
    description: 'Check wallet SOL and token balance',
    category: 'check',
    filePath: 'docs/examples/basic/check-balance.ts'
  },
  {
    name: 'Create Associated Token Account',
    command: createATACommand,
    description: 'Create Associated Token Account if it does not exist',
    category: 'setup',
    dependsOn: ['Check Wallet Balance'],
    filePath: 'docs/examples/advanced/batch-process.ts', // Inline script, so it references itself
    retries: 3
  },
  {
    name: 'Mint Test Tokens',
    command: 'ts-node docs/examples/basic/mint-test-tokens.ts',
    description: 'Create and mint test tokens',
    category: 'other',
    filePath: 'docs/examples/basic/mint-test-tokens.ts',
    dependsOn: ['Create Associated Token Account'],
    // Skip if token balance exists
    skipIf: (stdout: string): boolean => {
      return stdout.includes('Token:') && !stdout.includes('Token: 0');
    },
    retries: 2
  },
  {
    name: 'Verify Wallet Balance',
    command: 'ts-node docs/examples/basic/check-balance.ts',
    description: 'Verify wallet balance after minting',
    category: 'check',
    dependsOn: ['Mint Test Tokens'],
    filePath: 'docs/examples/basic/check-balance.ts'
  },
  {
    name: 'Check Token Info',
    command: 'ts-node docs/examples/basic/token-info.ts',
    description: 'Display token info',
    category: 'check',
    dependsOn: ['Mint Test Tokens'],
    filePath: 'docs/examples/basic/token-info.ts'
  },
  {
    name: 'Simple Token Transfer',
    command: `ts-node docs/examples/basic/transfer-tokens.ts ${DEFAULT_TOKEN_ADDRESS} 1 GZeQMMzrZdhg2h4CctUFBDGU2mv1R6uJY1LdAGSvpBHp`,
    description: 'Transfer tokens',
    category: 'transfer',
    dependsOn: ['Verify Wallet Balance'],
    filePath: 'docs/examples/basic/transfer-tokens.ts',
    // Skip if token balance is 0
    skipIf: (stdout: string): boolean => {
      const tokenBalanceMatch = stdout.match(/Token: (\d+)/);
      if (!tokenBalanceMatch) return true;
      const tokenBalance = parseInt(tokenBalanceMatch[1]);
      return tokenBalance <= 0;
    }
  }
];

function logToFile(message: string, disableLog: boolean): void {
  if (!disableLog) {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} - ${message}\n`);
  }
}

function filterExistingTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    if (task.category === 'setup') return true; // Setup tasks are always included
    
    if (!fs.existsSync(task.filePath)) {
      console.log(chalk.yellow(`Script file not found: ${task.filePath}`));
      logToFile(`Script file not found: ${task.filePath}`, false);
      return false;
    }
    return true;
  });
}

function filterTasksByCategory(tasks: Task[], category: string): Task[] {
  return tasks.filter(task => task.category === category);
}

function checkDependencies(tasks: Task[], parallel: boolean, respectDependencies: boolean): void {
  if (!respectDependencies) return;
  
  const taskNames = new Set(tasks.map(t => t.name));
  
  for (const task of tasks) {
    if (task.dependsOn) {
      for (const dep of task.dependsOn) {
        if (!taskNames.has(dep)) {
          console.log(chalk.yellow(`Warning: Task "${task.name}" depends on "${dep}" which is not in the task list.`));
          logToFile(`Warning: Task "${task.name}" depends on "${dep}" which is not in the task list.`, false);
        }
      }
    }
  }
}

async function runInParallel(tasks: Task[], targetToken: string, continueOnError: boolean, disableLog: boolean, respectDependencies: boolean): Promise<void> {
  const taskStartTimes = new Map<string, number>();
  const completedTasks = new Set<string>();
  const pendingTasks = new Map<string, Task>();
  
  // Add all tasks to pendingTasks
  tasks.forEach(task => pendingTasks.set(task.name, task));
  
  while (pendingTasks.size > 0) {
    const readyTasks: Task[] = [];
    
    // Find tasks ready to execute
    for (const [taskName, task] of pendingTasks.entries()) {
      const canRun = !respectDependencies || 
                    !task.dependsOn || 
                    task.dependsOn.every(dep => completedTasks.has(dep));
      
      if (canRun) {
        readyTasks.push(task);
        pendingTasks.delete(taskName);
      }
    }
    
    if (readyTasks.length === 0 && pendingTasks.size > 0) {
      console.error(chalk.red('Dependency cycle detected or all remaining tasks have unmet dependencies'));
      if (!continueOnError) {
        throw new Error('Dependency cycle detected');
      }
      break;
    }
    
    // Execute ready tasks in parallel
    await Promise.all(readyTasks.map(async (task) => {
      taskStartTimes.set(task.name, Date.now());
      console.log(chalk.cyan(`\n[${new Date().toISOString()}] Starting task: ${task.name}`));
      logToFile(`Starting task: ${task.name}`, disableLog);
      
      // Check dependency output to decide if task should be skipped
      if (task.skipIf && task.dependsOn) {
        for (const dep of task.dependsOn) {
          const depOutput = taskResults.get(dep);
          if (depOutput && task.skipIf(depOutput)) {
            console.log(chalk.yellow(`⚠️ Skipping task "${task.name}" based on dependency output`));
            logToFile(`Skipping task "${task.name}" based on dependency output`, disableLog);
            completedTasks.add(task.name);
            return;
          }
        }
      }
      
      try {
        // Add retry logic
        const maxRetries = task.retries || 0;
        let retries = 0;
        let success = false;
        let lastError;
        let stdout = '';
        let stderr = '';
        
        while (!success && retries <= maxRetries) {
          try {
            if (retries > 0) {
              console.log(chalk.yellow(`Retrying task "${task.name}" (attempt ${retries + 1}/${maxRetries + 1})...`));
              await new Promise(resolve => setTimeout(resolve, 2000 * retries)); // Exponential backoff
            }
            
            const result = await execAsync(task.command, { timeout: 120000 });
            stdout = result.stdout;
            stderr = result.stderr;
            success = true;
          } catch (error) {
            lastError = error;
            retries++;
            if (retries > maxRetries) break;
          }
        }
        
        if (!success) throw lastError;
        
        const taskDuration = ((Date.now() - taskStartTimes.get(task.name)!) / 1000).toFixed(2);
        console.log(chalk.green(`✓ Task "${task.name}" completed in ${taskDuration}s`));
        console.log(chalk.gray('Output:', stdout));
        logToFile(`Task "${task.name}" completed in ${taskDuration}s`, disableLog);
        logToFile(`Output: ${stdout}`, disableLog);
        if (stderr) {
          console.log(chalk.yellow(`Warning output: ${stderr}`));
          logToFile(`Warning output: ${stderr}`, disableLog);
        }
        completedTasks.add(task.name);
        taskResults.set(task.name, stdout); // Store result
      } catch (error) {
        const taskDuration = ((Date.now() - taskStartTimes.get(task.name)!) / 1000).toFixed(2);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`✗ Task "${task.name}" failed after ${taskDuration}s`));
        console.error(errorMessage);
        logToFile(`Task "${task.name}" failed after ${taskDuration}s: ${errorMessage}`, disableLog);
        if (!continueOnError) {
          throw error;
        }
        // Mark as completed for dependency purposes even if failed
        completedTasks.add(task.name);
      }
    }));
  }
}

async function runSequentially(tasks: Task[], targetToken: string, continueOnError: boolean, disableLog: boolean, respectDependencies: boolean): Promise<void> {
  const completedTasks = new Set<string>();
  
  // Sort tasks considering dependencies
  if (respectDependencies) {
    const sortedTasks: Task[] = [];
    const pendingTasks = new Map<string, Task>();
    
    // Add all tasks to pendingTasks
    tasks.forEach(task => pendingTasks.set(task.name, task));
    
    while (pendingTasks.size > 0) {
      let taskAdded = false;
      
      for (const [taskName, task] of pendingTasks.entries()) {
        const canRun = !task.dependsOn || 
                      task.dependsOn.every(dep => sortedTasks.some(t => t.name === dep));
        
        if (canRun) {
          sortedTasks.push(task);
          pendingTasks.delete(taskName);
          taskAdded = true;
          break;
        }
      }
      
      if (!taskAdded && pendingTasks.size > 0) {
        console.error(chalk.red('Dependency cycle detected or all remaining tasks have unmet dependencies'));
        if (!continueOnError) {
          throw new Error('Dependency cycle detected');
        }
        // Add remaining tasks in order
        pendingTasks.forEach(task => sortedTasks.push(task));
        break;
      }
    }
    
    tasks = sortedTasks;
  }
  
  for (const task of tasks) {
    const taskStartTime = Date.now();
    
    // Dependency check
    if (respectDependencies && task.dependsOn) {
      console.log(chalk.cyan(`Checking dependencies: ${task.dependsOn.join(', ')}`));
      const missingDeps = task.dependsOn.filter(dep => !completedTasks.has(dep));
      if (missingDeps.length > 0) {
        const errorMsg = `Task "${task.name}" has unmet dependencies: ${missingDeps.join(', ')}`;
        console.error(chalk.red(errorMsg));
        logToFile(errorMsg, disableLog);
        if (!continueOnError) {
          throw new Error(errorMsg);
        }
        continue;
      }
      
      // Check dependency output to decide if task should be skipped
      if (task.skipIf) {
        let shouldSkip = false;
        for (const dep of task.dependsOn) {
          const depOutput = taskResults.get(dep);
          if (depOutput && task.skipIf(depOutput)) {
            shouldSkip = true;
            break;
          }
        }
        
        if (shouldSkip) {
          console.log(chalk.yellow(`⚠️ Skipping task "${task.name}" based on dependency output`));
          logToFile(`Skipping task "${task.name}" based on dependency output`, disableLog);
          completedTasks.add(task.name);
          continue;
        }
      }
    }
    
    try {
      // Add retry logic
      const maxRetries = task.retries || 0;
      let retries = 0;
      let success = false;
      let lastError;
      let stdout = '';
      let stderr = '';
      
      while (!success && retries <= maxRetries) {
        try {
          if (retries > 0) {
            console.log(chalk.yellow(`Retrying task "${task.name}" (attempt ${retries + 1}/${maxRetries + 1})...`));
            await new Promise(resolve => setTimeout(resolve, 2000 * retries)); // Exponential backoff
          }
          
          const result = await execAsync(task.command, { timeout: 120000 });
          stdout = result.stdout;
          stderr = result.stderr;
          success = true;
        } catch (error) {
          lastError = error;
          retries++;
          if (retries > maxRetries) break;
        }
      }
      
      if (!success) throw lastError;
      
      const taskDuration = ((Date.now() - taskStartTime) / 1000).toFixed(2);
      if (parseFloat(taskDuration) > 3) {
        console.log(chalk.yellow(`⚠️ Task ${task.name} took a long time: ${taskDuration}s`));
      }
      console.log(chalk.green(`✓ Task "${task.name}" completed in ${taskDuration}s`));
      console.log(chalk.gray('Output:', stdout));
      logToFile(`Task "${task.name}" completed in ${taskDuration}s`, disableLog);
      logToFile(`Output: ${stdout}`, disableLog);
      if (stderr) {
        console.log(chalk.yellow(`Warning output: ${stderr}`));
        logToFile(`Warning output: ${stderr}`, disableLog);
      }
      completedTasks.add(task.name);
      taskResults.set(task.name, stdout); // Store result
    } catch (error) {
      const taskDuration = ((Date.now() - taskStartTime) / 1000).toFixed(2);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`✗ Task "${task.name}" failed after ${taskDuration}s`));
      console.error(errorMessage);
      logToFile(`Task "${task.name}" failed after ${taskDuration}s: ${errorMessage}`, disableLog);
      if (!continueOnError) {
        throw error;
      }
    }
  }
}

async function main(): Promise<void> {
  const targetToken = CONFIG.TOKEN_ADDRESS;
  const parallel = process.argv.includes('--parallel');
  const taskArg = process.argv.find(arg => arg.startsWith('--task='));
  const taskCategory = taskArg ? taskArg.split('=')[1] : null;
  const tokenArg = process.argv.find(arg => arg.startsWith('--token='));
  const effectiveToken = tokenArg ? tokenArg.split('=')[1] : targetToken;
  const continueOnError = process.argv.includes('--continue-on-error') || process.argv.includes('--force');
  const disableLog = process.argv.includes('--no-log');
  const respectDependencies = !process.argv.includes('--ignore-dependencies');

  const startTime = Date.now();
  try {
    if (!disableLog) {
      const timestamp = new Date().toISOString();
      fs.writeFileSync(LOG_FILE, `${timestamp} - Batch process started\n`);
    }

    console.log(chalk.yellow('🚀 Starting MOTO PROTOCOL token management batch process...'));
    console.log(chalk.cyan(`Target token: ${effectiveToken}`));
    console.log(chalk.cyan(`Using wallet: ${WALLET_FILE}`));
    logToFile(`Starting batch process for token: ${effectiveToken}`, disableLog);
    logToFile(`Using wallet file: ${WALLET_FILE}`, disableLog);

    let tasksToRun = filterExistingTasks(tasks);

    if (taskCategory) {
      tasksToRun = filterTasksByCategory(tasksToRun, taskCategory);
      console.log(chalk.cyan(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`));
      logToFile(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`, disableLog);
      if (tasksToRun.length === 0) {
        console.log(chalk.yellow(`No tasks found in category: ${taskCategory}`));
        console.log(chalk.yellow('Available categories: metadata, transfer, check, other, setup'));
        logToFile(`No tasks found in category: ${taskCategory}`, disableLog);
        return;
      }
    }

    checkDependencies(tasksToRun, parallel, respectDependencies);

    console.log(chalk.cyan(`Preparing to run ${tasksToRun.length} tasks:`));
    tasksToRun.forEach((task, index) => {
      const deps = task.dependsOn ? ` (depends on: ${task.dependsOn.join(', ')})` : '';
      const skip = task.skipIf ? ' (may be skipped based on conditions)' : '';
      const retry = task.retries ? ` (with ${task.retries} retries)` : '';
      console.log(chalk.gray(`${index + 1}. ${task.name} (${task.category})${deps}${skip}${retry}`));
    });

    if (parallel) {
      console.log(chalk.cyan(`⚡ Executing tasks in parallel${respectDependencies ? ' (respecting dependencies)' : ''}.`));
      logToFile(`Executing tasks in parallel${respectDependencies ? ' (respecting dependencies)' : ''}`, disableLog);
      await runInParallel(tasksToRun, effectiveToken, continueOnError, disableLog, respectDependencies);
    } else {
      console.log(chalk.cyan(`⏱️ Executing tasks sequentially${respectDependencies ? ' (respecting dependencies)' : ''}.`));
      logToFile(`Executing tasks sequentially${respectDependencies ? ' (respecting dependencies)' : ''}`, disableLog);
      await runSequentially(tasksToRun, effectiveToken, continueOnError, disableLog, respectDependencies);
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.yellow(`✨ Batch process completed in ${totalDuration}s.`));
    logToFile(`Batch process completed successfully in ${totalDuration}s`, disableLog);
  } catch (error) {
    const failDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`💥 Batch process failed after ${failDuration}s: ${errorMessage}`));
    logToFile(`Batch process failed: ${errorMessage}`, disableLog);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('💥 Fatal error during batch process:'), error);
  process.exit(1);
});
