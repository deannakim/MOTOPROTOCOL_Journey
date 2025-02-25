#!/usr/bin/env ts-node

/**
 * Batch Process Script
 *
 * This script implements a batch process that executes multiple tasks sequentially or in parallel.
 * Each task is defined as a command, and the execution results are output through colorful logging (chalk).
 *
 * Usage:
 *   ts-node batch-process.ts           // Default: Sequential execution
 *   ts-node batch-process.ts --parallel // Parallel execution
 *
 * Note: The task list is defined in the tasks array below.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

interface Task {
  name: string;
  command: string;
}

const tasks: Task[] = [
  { name: 'Check Wallet', command: 'ts-node src/check-wallet.ts' },
  { name: 'Create Metadata', command: 'ts-node src/create-metadata.ts' },
  { name: 'Simple Token Transfer', command: 'ts-node src/simple-token-transfer.ts' },
  // Define additional tasks here if needed.
];

async function runTask(task: Task): Promise<void> {
  console.log(chalk.blue(`\nExecuting: ${task.name}`));
  try {
    const { stdout, stderr } = await execAsync(task.command);
    if (stdout) console.log(chalk.green(`Output:\n${stdout}`));
    if (stderr) console.error(chalk.red(`Error Output:\n${stderr}`));
  } catch (error) {
    console.error(chalk.red(`Error occurred while executing task ${task.name}:`), error);
    throw error; // Rethrow if you want to stop the entire process when an error occurs
  }
}

async function runSequentially(tasks: Task[]): Promise<void> {
  for (const task of tasks) {
    await runTask(task);
  }
}

async function runInParallel(tasks: Task[]): Promise<void> {
  await Promise.all(tasks.map(task => runTask(task)));
}

async function main(): Promise<void> {
  console.log(chalk.yellow('Starting batch process...'));

  const parallel = process.argv.includes('--parallel');
  if (parallel) {
    console.log(chalk.cyan('Executing tasks in parallel.'));
    await runInParallel(tasks);
  } else {
    console.log(chalk.cyan('Executing tasks sequentially.'));
    await runSequentially(tasks);
  }

  console.log(chalk.yellow('Batch process completed.'));
}

main().catch(error => {
  console.error(chalk.red('Fatal error during batch process:'), error);
  process.exit(1);
});
