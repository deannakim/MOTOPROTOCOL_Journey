#!/usr/bin/env ts-node

/**
 * MOTO PROTOCOL Token Management Batch Process
 *
 * This script implements a batch process for managing MOTO PROTOCOL tokens on Solana.
 * It demonstrates how to automate common token management tasks using Metaplex Umi.
 *
 * Prerequisites:
 * - Node.js v16+ and npm/yarn installed
 * - Required dependencies:
 *   - chalk: "^4.1.2"
 *   - ts-node: "^10.9.1"
 *   - typescript: "^4.9.0"
 *   - @types/node: "^18.0.0"
 *   - @metaplex-foundation/umi: "^0.8.9"
 *   - @metaplex-foundation/umi-bundle-defaults: "^0.8.9"
 *   - @solana/web3.js: "^1.78.0"
 *   - @solana/spl-token: "^0.3.8"
 * - src/ directory with the following scripts:
 *   - check-wallet.ts: Checks wallet balance (uses WALLET_FILE env var)
 *     Example output: "Wallet balance: 3.38845844 SOL, MTP: 18,446,744,073.709551615"
 *   - check-metadata.ts: Retrieves token metadata (uses TOKEN_ADDRESS env var)
 *     Example output: "Token: MOTO PROTOCOL (MTP), URI: https://..."
 *   - update-metadata.ts: Updates token metadata (uses TOKEN_ADDRESS and WALLET_FILE env vars)
 *     Example output: "Metadata updated successfully for token MTP"
 *   - simple-token-transfer.ts: Transfers tokens (uses TOKEN_ADDRESS and WALLET_FILE env vars)
 *     Example output: "Transferred 1000 MTP to recipient address"
 *   - check-token-info.ts: Displays token info (uses TOKEN_ADDRESS env var)
 *     Example output: "Supply: 18,446,744,073,709,551,615, Decimals: 9, Mint Authority: ..."
 *
 * Installation:
 * npm install chalk@4.1.2 ts-node@10.9.1 typescript@4.9.0 @types/node@18.0.0 \
 *   @metaplex-foundation/umi@0.8.9 @metaplex-foundation/umi-bundle-defaults@0.8.9 \
 *   @solana/web3.js@1.78.0 @solana/spl-token@0.3.8
 * 
 * Usage:
 *   ts-node batch-process.ts                    # Run all tasks sequentially
 *   ts-node batch-process.ts --parallel         # Run tasks in parallel
 *                                               # (Note: Some tasks may have dependencies on others)
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
}

// Default Token address - MOTO PROTOCOL (MTP) token
const DEFAULT_TOKEN_ADDRESS = "GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h";

// Wallet configuration
const WALLET_FILE = "./my_wallet.json"; // Current wallet with address 7L7C9RB8Y6RtChco9QGgf8mo7wNiM7HFwHe4vWC7jLwH

// Define tasks based on available scripts in the src directory
const tasks: Task[] = [
  { 
    name: 'Check Wallet Balance', 
    command: 'ts-node ./src/check-wallet.ts', // Using relative path with ./ prefix
    description: 'Checks wallet balance and token holdings (uses WALLET_FILE env var)',
    category: 'check'
  },
  { 
    name: 'Check Token Metadata', 
    command: `ts-node ./src/check-metadata.ts`, // Using relative path with ./ prefix
    description: 'Retrieves and displays current token metadata (uses TOKEN_ADDRESS env var)',
    category: 'metadata'
  },
  { 
    name: 'Update Token Metadata', 
    command: 'ts-node ./src/update-metadata.ts', // Using relative path with ./ prefix
    description: 'Updates token metadata with latest information (uses TOKEN_ADDRESS and WALLET_FILE env vars)',
    category: 'metadata',
    dependsOn: ['Check Token Metadata'] // This task should run after checking metadata
  },
  { 
...(about 221 lines omitted)...
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
    console.log(chalk.cyan(`Target token: ${targetToken} ${targetToken === DEFAULT_TOKEN_ADDRESS ? '(MOTO PROTOCOL - MTP)' : ''}`));
    console.log(chalk.cyan(`Using wallet: ${WALLET_FILE} (7L7C9RB8Y6RtChco9QGgf8mo7wNiM7HFwHe4vWC7jLwH)`));
    logToFile(`Starting batch process for token: ${targetToken}`, disableLog);
    logToFile(`Using wallet file: ${WALLET_FILE}`, disableLog);
    
    // Verify that all script files exist
    const scriptsExist = verifyScripts();
    if (!scriptsExist) {
      console.log(chalk.yellow('⚠️ Some script files are missing. Continuing with available scripts.'));
      logToFile('Warning: Some script files are missing', disableLog);
    }
    
    // Set environment variables
    process.env.WALLET_FILE = WALLET_FILE;
    process.env.TOKEN_ADDRESS = targetToken;
    
    // Filter tasks if a category is specified
    let tasksToRun = tasks;
    if (taskCategory) {
      tasksToRun = filterTasksByCategory(tasks, taskCategory);
      console.log(chalk.cyan(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`));
      logToFile(`Filtered to ${tasksToRun.length} tasks in category: ${taskCategory}`, disableLog);
      
      if (tasksToRun.length === 0) {
        console.log(chalk.yellow(`No tasks found in category: ${taskCategory}`));
        console.log(chalk.yellow('Available categories: metadata, transfer, check, other'));
        logToFile(`No tasks found in category: ${taskCategory}`, disableLog);
        return;
      }
    }
    
    // Check for dependencies in parallel mode
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
    console.log(chalk.yellow(`✨ MOTO PROTOCOL token management batch process completed in ${totalDuration}s.`));
    logToFile(`Batch process completed successfully in ${totalDuration}s`, disableLog);
  } catch (error) {
    const failDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(chalk.red(`💥 Batch process failed after ${failDuration}s: ${error.message}`));
    logToFile(`Batch process failed: ${error.message}`, disableLog);
    process.exit(1);
  }
}

// Execute main function
main().catch(error => {
  console.error(chalk.red('💥 Fatal error during batch process:'), error);
  // Remove duplicate logging: Logging is already handled within the main() function, so it is unnecessary here
  process.exit(1);
});
