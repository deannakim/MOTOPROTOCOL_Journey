#!/usr/bin/env ts-node

/**
 * MOTO PROTOCOL Token Management Batch Process
 *
 * This script implements a batch process for managing MOTO PROTOCOL tokens on Solana.
 * It demonstrates how to automate common token management tasks using Metaplex Umi.
 *
 * Usage:
 *   ts-node batch-process.ts                    # Run all tasks sequentially
 *   ts-node batch-process.ts --parallel         # Run tasks in parallel
 *   ts-node batch-process.ts --task=metadata    # Run only metadata-related tasks
 *   ts-node batch-process.ts --task=transfer    # Run only transfer-related tasks
 *   ts-node batch-process.ts --token=<address>  # Specify custom token address
 *   ts-node batch-process.ts --continue-on-error # Continue execution even if tasks fail
 *   ts-node batch-process.ts --no-log           # Disable logging to file
 *   ts-node batch-process.ts --respect-dependencies # Force dependency order even in parallel mode
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import * as fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const LOG_FILE = path.join(process.cwd(), 'batch-process-log.txt');

// Define task interface
interface Task {
  name: string;
  command: string;
  description: string;
  category: 'metadata' | 'transfer' | 'check' | 'other';
  dependsOn?: string[]; // Names of tasks this task depends on
  filePath: string;     // 실제 실행할 파일의 경로
}

// Default Token address - Test Token
const DEFAULT_TOKEN_ADDRESS = "YLf4BdNj1iiKiroGLGELNZrZQP9JtGGDkDfDcYLNiR1";

// Wallet configuration
const WALLET_FILE = "./test-wallet.json"; // Test wallet for development

// Define tasks based on available scripts
const tasks: Task[] = [
  { 
    name: 'Check Wallet Balance', 
    command: 'ts-node docs/examples/basic/check-balance.ts',
    description: 'Checks wallet balance and token holdings',
    category: 'check',
    filePath: 'docs/examples/basic/check-balance.ts'
  },
  { 
    name: 'Simple Token Transfer', 
    // 인자를 전달하여 프롬프트 없이 진행: "1" 토큰, "GzeQMMzrZdhg2h4CctUFBDGUmv1R6uJY1LdAGSvpBhp" 수신자
    command: 'ts-node docs/examples/basic/transfer-tokens.ts 1 GzeQMMzrZdhg2h4CctUFBDGUmv1R6uJY1LdAGSvpBhp',
    description: 'Transfers tokens',
    category: 'transfer',
    filePath: 'docs/examples/basic/transfer-tokens.ts'
  },
  { 
    name: 'Check Token Info', 
    command: 'ts-node docs/examples/basic/token-info.ts',
    description: 'Displays token info',
    category: 'check',
    filePath: 'docs/examples/basic/token-info.ts'
  }
];

// Utility function to log messages to a file if logging is enabled
function logToFile(message: string, disableLog: boolean): void {
  if (!disableLog) {
    fs.appendFileSync(LOG_FILE, message + "\n");
  }
}

// Filter out tasks whose script files do not exist
function filterExistingTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    if (!fs.existsSync(task.filePath)) {
      console.log(chalk.yellow(`Script file not found: ${task.filePath}`));
      logToFile(`Script file not found: ${task.filePath}`, false);
      return false;
    }
    return true;
  });
}

// Filter tasks by category
function filterTasksByCategory(tasks: Task[], category: string): Task[] {
  return tasks.filter(task => task.category === category);
}

// Check dependencies among tasks (현재는 경고만 출력)
function checkDependencies(tasks: Task[], parallel: boolean, respectDependencies: boolean): void {
  for (const task of tasks) {
    if (task.dependsOn) {
      for (const dep of task.dependsOn) {
        const exists = tasks.some(t => t.name === dep);
        if (!exists) {
          console.log(chalk.yellow(`Warning: Task "${task.name}" depends on "${dep}" which is not in the task list.`));
          logToFile(`Warning: Task "${task.name}" depends on "${dep}" which is not in the task list.`, false);
        }
      }
    }
  }
}

// Execute tasks in parallel with timing
async function runInParallel(tasks: Task[], targetToken: string, continueOnError: boolean, disableLog: boolean, respectDependencies: boolean): Promise<void> {
  const taskStartTimes = new Map<string, number>();
  
  await Promise.all(tasks.map(async (task) => {
    taskStartTimes.set(task.name, Date.now());
    console.log(chalk.cyan(`\n[${new Date().toISOString()}] Starting task: ${task.name}`));
    logToFile(`Starting task: ${task.name}`, disableLog);
    
    try {
      const { stdout, stderr } = await execAsync(task.command);
      const taskDuration = ((Date.now() - taskStartTimes.get(task.name)!) / 1000).toFixed(2);
      console.log(chalk.green(`✓ Task "${task.name}" completed in ${taskDuration}s`));
      console.log(chalk.gray('Output:', stdout));
      
      logToFile(`Task "${task.name}" completed in ${taskDuration}s`, disableLog);
      logToFile(`Output: ${stdout}`, disableLog);
      
      if (stderr) {
        console.log(chalk.yellow(`Warning output: ${stderr}`));
        logToFile(`Warning output: ${stderr}`, disableLog);
      }
    } catch (error) {
      const taskDuration = ((Date.now() - taskStartTimes.get(task.name)!) / 1000).toFixed(2);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`✗ Task "${task.name}" failed after ${taskDuration}s`));
      console.error(errorMessage);
      
      logToFile(`Task "${task.name}" failed after ${taskDuration}s: ${errorMessage}`, disableLog);
      
      if (!continueOnError) {
        throw error;
      }
    }
  }));
}

// Execute tasks sequentially with timing
async function runSequentially(tasks: Task[], targetToken: string, continueOnError: boolean, disableLog: boolean): Promise<void> {
  for (const task of tasks) {
    const taskStartTime = Date.now();
    console.log(chalk.cyan(`\n[${new Date().toISOString()}] Starting task: ${task.name}`));
    logToFile(`Starting task: ${task.name}`, disableLog);
    
    try {
      const { stdout, stderr } = await execAsync(task.command);
      const taskDuration = ((Date.now() - taskStartTime) / 1000).toFixed(2);
      console.log(chalk.green(`✓ Task "${task.name}" completed in ${taskDuration}s`));
      console.log(chalk.gray('Output:', stdout));
      
      logToFile(`Task "${task.name}" completed in ${taskDuration}s`, disableLog);
      logToFile(`Output: ${stdout}`, disableLog);
      
      if (stderr) {
        console.log(chalk.yellow(`Warning output: ${stderr}`));
        logToFile(`Warning output: ${stderr}`, disableLog);
      }
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
  // Parse command line arguments
  const parallel = process.argv.includes('--parallel');
  const taskArg = process.argv.find(arg => arg.startsWith('--task='));
  const taskCategory = taskArg ? taskArg.split('=')[1] : null;
  const tokenArg = process.argv.find(arg => arg.startsWith('--token='));
  const targetToken = tokenArg ? tokenArg.split('=')[1] : DEFAULT_TOKEN_ADDRESS;
  const continueOnError = process.argv.includes('--continue-on-error');
  const disableLog = process.argv.includes('--no-log');
  const respectDependencies = process.argv.includes('--respect-dependencies');
  
  const startTime = Date.now();
  
  try {
    // Initialize log file if logging is enabled
    if (!disableLog) {
      const timestamp = new Date().toISOString();
      fs.writeFileSync(LOG_FILE, `${timestamp} - Batch process started\n`);
    }
    
    console.log(chalk.yellow('🚀 Starting MOTO PROTOCOL token management batch process...'));
    console.log(chalk.cyan(`Target token: ${targetToken}`));
    console.log(chalk.cyan(`Using wallet: ${WALLET_FILE}`));
    logToFile(`Starting batch process for token: ${targetToken}`, disableLog);
    logToFile(`Using wallet file: ${WALLET_FILE}`, disableLog);
    
    // Filter tasks to only include those with existing script files
    let tasksToRun = filterExistingTasks(tasks);
    
    // Filter tasks if a category is specified
    if (taskCategory) {
      tasksToRun = filterTasksByCategory(tasksToRun, taskCategory);
      console.log(chalk.cyan(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`));
      logToFile(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`, disableLog);
      
      if (tasksToRun.length === 0) {
        console.log(chalk.yellow(`No tasks found in category: ${taskCategory}`));
        console.log(chalk.yellow('Available categories: metadata, transfer, check, other'));
        logToFile(`No tasks found in category: ${taskCategory}`, disableLog);
        return;
      }
    }
    
    // Check for dependencies
    checkDependencies(tasksToRun, parallel, respectDependencies);
    
    // Display task summary
    console.log(chalk.cyan(`Preparing to run ${tasksToRun.length} tasks:`));
    tasksToRun.forEach((task, index) => {
      console.log(chalk.gray(`${index + 1}. ${task.name} (${task.category})`));
    });
    
    // Execute tasks
    if (parallel) {
      console.log(chalk.cyan('⚡ Executing tasks in parallel.'));
      logToFile('Executing tasks in parallel', disableLog);
      await runInParallel(tasksToRun, targetToken, continueOnError, disableLog, respectDependencies);
    } else {
      console.log(chalk.cyan('⏱️ Executing tasks sequentially.'));
      logToFile('Executing tasks sequentially', disableLog);
      await runSequentially(tasksToRun, targetToken, continueOnError, disableLog);
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

// Execute main function
main().catch(error => {
  console.error(chalk.red('💥 Fatal error during batch process:'), error);
  process.exit(1);
});
