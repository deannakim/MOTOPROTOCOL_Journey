#!/usr/bin/env ts-node

/**
 * MOTO PROTOCOL Wallet Balance Checker
 *
 * This script checks the balance of a Solana wallet, including SOL and MTP token balances.
 * It serves as a basic example of interacting with the Solana blockchain using Metaplex Umi.
 *
 * Prerequisites:
 * - Node.js v16+ and npm/yarn installed
 * - Required dependencies (see package.json)
 * - A Solana wallet file (DO NOT commit this to GitHub)
 *
 * Setup:
 * 1. Create a test wallet: `solana-keygen new --outfile test-wallet.json`
 * 2. Get SOL from faucet: `solana airdrop 1 [YOUR_WALLET_ADDRESS] --url devnet`
 * 3. Rename test-wallet.json to my_wallet.json or update WALLET_PATH in .env
 *
 * Usage:
 *   ts-node check-balance.ts
 *
 * Example Output:
 *   Wallet balance: 1.00000000 SOL, MTP: 0
 */

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';
import { getAccount } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Configuration
const WALLET_PATH = process.env.WALLET_PATH || './my_wallet.json'; // Use .env or default path
const TOKEN_ADDRESS = 'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h'; // MOTO PROTOCOL (MTP)
const RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Solana Devnet

// Wallet file check
if (!fs.existsSync(WALLET_PATH)) {
  console.error(`Error: Wallet file not found at ${WALLET_PATH}`);
  console.log('\nPlease follow these steps:');
  console.log('1. Create a test wallet: solana-keygen new --outfile test-wallet.json');
  console.log('2. Rename test-wallet.json to my_wallet.json');
  console.log('3. Add my_wallet.json to .gitignore');
  process.exit(1);
}

// Initialize Umi and load wallet
const umi = createUmi(RPC_ENDPOINT);
const walletData = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8'));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletData));
umi.use(keypairIdentity(keypair));

// Solana Web3.js connection for SOL balance
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

async function checkBalance() {
  try {
    // Check SOL balance
    const solBalance = await connection.getBalance(umi.identity.publicKey);
    const solAmount = solBalance / LAMPORTS_PER_SOL;

    // Check MTP token balance
    const tokenMint = publicKey(TOKEN_ADDRESS);
    const tokenAccounts = await umi.rpc.getTokenAccounts({ owner: umi.identity.publicKey });
    const mtpAccount = tokenAccounts.find((acc) => acc.mint.equals(tokenMint));
    let mtpBalance = '0';
    
    if (mtpAccount) {
      const accountInfo = await getAccount(connection, mtpAccount.publicKey.toWeb3Js());
      mtpBalance = (Number(accountInfo.amount) / 1e9).toLocaleString(); // Assuming 9 decimals
    }

    // Output result
    console.log(`Wallet balance: ${solAmount} SOL, MTP: ${mtpBalance}`);
  } catch (error) {
    console.error('Error checking balance:', error.message);
    process.exit(1);
  }
}

// Execute the function
checkBalance();
