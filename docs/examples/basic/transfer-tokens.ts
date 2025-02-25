#!/usr/bin/env ts-node

/**
 * Simple Solana Token Transfer Example
 *
 * This example demonstrates how to transfer SPL tokens on the Solana network.
 * It's designed for DevRel portfolios to show a clean implementation of token transfers.
 *
 * Prerequisites:
 * - Node.js v16+ installed
 * - Required packages:
 *   - ts-node: Runs TypeScript directly
 *   - @solana/web3.js: Connects to Solana
 *   - @solana/spl-token: Works with SPL tokens
 *   - @metaplex-foundation/mpl-token-metadata: Fetches token metadata
 *   - dotenv: Manages environment variables
 *   - chalk: Adds colors to console output
 *   - prompt-sync: Handles user input
 *
 * Installation:
 * 1. Create a .env file with RPC_URL (optional, defaults to Devnet)
 * 2. Run: npm install ts-node @solana/web3.js @solana/spl-token @metaplex-foundation/mpl-token-metadata dotenv chalk prompt-sync
 *
 * Usage:
 * - Run: ts-node transfer-tokens.ts
 * - Or specify amount and recipient: ts-node transfer-tokens.ts AMOUNT RECIPIENT_ADDRESS
 * - Or specify token, amount and recipient: ts-node transfer-tokens.ts TOKEN_ADDRESS AMOUNT RECIPIENT_ADDRESS
 *
 * Example:
 *   ts-node transfer-tokens.ts 100 9ZNTfG4NyQgxy2SWjSiQoUyBPEvXT2xo7fKc5hPYYJ7b
 *
 * Safety Features:
 * - Confirmation prompt before sending
 * - Validation of addresses and amounts
 * - Clear success/error messages
 */

import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, getMint, getAccount } from '@solana/spl-token';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import chalk from 'chalk';
import promptSync from 'prompt-sync';

// Setup prompt for user confirmation
const prompt = promptSync({ sigint: true });

// Load environment variables
dotenv.config();

// Default token to use (MOTO PROTOCOL - MTP)
const DEFAULT_TOKEN = 'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h';

// Wallet setup
const WALLET_FILE = process.env.WALLET_FILE || './my_wallet.json';
let keypair: Keypair;

try {
  const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
  keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
} catch (error) {
  console.error(chalk.red(`Error loading wallet from ${WALLET_FILE}:`), error.message);
  console.log(chalk.yellow('Make sure your wallet file exists and contains a valid private key array.'));
  process.exit(1);
}

// Solana connection - use environment variable or default to Devnet
const connection = new Connection(
  process.env.RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Parse command line arguments
let tokenAddress: string;
let amount: number;
let recipientAddress: string;

if (process.argv.length === 4) {
  // Format: ts-node transfer-tokens.ts AMOUNT RECIPIENT
  tokenAddress = DEFAULT_TOKEN;
  amount = parseFloat(process.argv[2]);
  recipientAddress = process.argv[3];
} else if (process.argv.length === 5) {
  // Format: ts-node transfer-tokens.ts TOKEN AMOUNT RECIPIENT
  tokenAddress = process.argv[2];
  amount = parseFloat(process.argv[3]);
  recipientAddress = process.argv[4];
} else {
  // Interactive mode
  console.log(chalk.cyan('=== Solana Token Transfer Tool ==='));
  tokenAddress = prompt(`Token address (press Enter for ${DEFAULT_TOKEN}): `) || DEFAULT_TOKEN;
  amount = parseFloat(prompt('Amount to send: '));
  recipientAddress = prompt('Recipient address: ');
}

// Validate inputs
try {
  const tokenPubkey = new PublicKey(tokenAddress);
  const recipientPubkey = new PublicKey(recipientAddress);
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }
} catch (error) {
  console.error(chalk.red('Invalid input:'), error.message);
  console.log(chalk.yellow('Usage: ts-node transfer-tokens.ts [TOKEN_ADDRESS] AMOUNT RECIPIENT_ADDRESS'));
  process.exit(1);
}

// Fetch token metadata from blockchain
async function fetchTokenMetadata(mint: PublicKey) {
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    const metadataAccount = await Metadata.load(connection, metadataPDA);
    return metadataAccount.data;
  } catch (error) {
    return null;
  }
}

async function transferTokens() {
  try {
    console.log(chalk.cyan(`\nPreparing to transfer tokens...`));
    console.log(`Network: ${process.env.RPC_URL || 'Devnet'}`);
    console.log(`From: ${chalk.yellow(keypair.publicKey.toBase58())}`);
    console.log(`To: ${chalk.yellow(recipientAddress)}`);
    
    const tokenPubkey = new PublicKey(tokenAddress);
    
    // Check SOL balance for transaction fees
    const solBalance = await connection.getBalance(keypair.publicKey);
    if (solBalance < 0.002 * LAMPORTS_PER_SOL) {
      console.error(chalk.red('Warning: Low SOL balance for transaction fees.'));
      console.log(chalk.yellow('You may need more SOL to complete this transaction.'));
      console.log(chalk.yellow('Get free Devnet SOL at https://solfaucet.com'));
      
      const continueAnyway = prompt(chalk.yellow('Continue anyway? (y/n): '));
      if (continueAnyway.toLowerCase() !== 'y') {
        console.log(chalk.yellow('Transfer cancelled.'));
        process.exit(0);
      }
    }
    
    // Get token metadata
    const metadata = await fetchTokenMetadata(tokenPubkey);
    if (metadata) {
      console.log(`Token: ${chalk.green(`${metadata.data.name} (${metadata.data.symbol})`)}`);
    } else {
      console.log(`Token: ${chalk.yellow(tokenAddress)}`);
    }
    
    // Get token decimals to calculate the actual amount
    const mintInfo = await getMint(connection, tokenPubkey);
    const decimals = mintInfo.decimals;
    
    // Validate amount precision against token decimals
    const amountString = amount.toString();
    const decimalPart = amountString.includes('.') ? amountString.split('.')[1].length : 0;
    if (decimalPart > decimals) {
      console.error(chalk.red(`Error: Amount has too many decimal places. This token supports up to ${decimals} decimals.`));
      process.exit(1);
    }
    
    const adjustedAmount = amount * Math.pow(10, decimals);
    
    // Check sender's token balance
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      tokenPubkey,
      keypair.publicKey
    );
    
    const tokenBalance = Number(senderTokenAccount.amount) / Math.pow(10, decimals);
    console.log(`Your balance: ${chalk.green(tokenBalance.toString())} tokens`);
    console.log(`Amount to send: ${chalk.green(amount.toString())} tokens`);
    
    if (tokenBalance < amount) {
      console.error(chalk.red(`Error: Insufficient balance. You have ${tokenBalance} tokens but tried to send ${amount}.`));
      process.exit(1);
    }
    
    // Get or create the recipient's token account
    console.log(chalk.cyan('Setting up recipient token account...'));
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      tokenPubkey,
      new PublicKey(recipientAddress)
    );
    
    // Ask for confirmation
    const confirmation = prompt(chalk.yellow('Confirm transfer? (y/n): '));
    if (confirmation.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Transfer cancelled.'));
      process.exit(0);
    }
    
    console.log(chalk.cyan('Creating transfer transaction...'));
    
    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount.address,
      recipientTokenAccount.address,
      keypair.publicKey,
      BigInt(Math.round(adjustedAmount)) // Using Math.round for better precision
    );
    
    // Create and send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    
    console.log(chalk.green('\n✅ Transfer successful!'));
    console.log(`Amount: ${chalk.yellow(amount.toString())} tokens`);
    console.log(`Recipient: ${chalk.yellow(recipientAddress)}`);
    console.log(`Transaction signature: ${chalk.blue(signature)}`);
    console.log(chalk.gray(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`));
    
    // Get updated balance
    const updatedAccount = await getAccount(connection, senderTokenAccount.address);
    const newBalance = Number(updatedAccount.amount) / Math.pow(10, decimals);
    console.log(`\nYour new balance: ${chalk.green(newBalance.toString())} tokens`);
    
  } catch (error) {
    console.error(chalk.red('\n❌ Transfer failed:'), error.message);
    console.log(chalk.yellow('\nTroubleshooting tips:'));
    console.log('- Check that you have enough SOL to pay for transaction fees');
    console.log('- Verify the recipient address is correct');
    console.log('- Make sure your wallet has enough tokens to send');
    console.log('- If using Devnet, get free SOL from https://solfaucet.com');
  }
}

// Run the transfer
transferTokens();
