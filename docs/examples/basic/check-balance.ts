#!/usr/bin/env ts-node

/**
 * MOTO PROTOCOL Wallet Balance Checker
 *
 * This script checks the balance of a Solana wallet, including SOL and MTP token balances.
 * It serves as a basic example of interacting with the Solana blockchain using Metaplex Umi.
 *
 * Prerequisites:
 * - Node.js v16+ and npm/yarn installed
 * - Required dependencies:
 *   - @metaplex-foundation/umi: "^0.8.9"
 *   - @metaplex-foundation/umi-bundle-defaults: "^0.8.9"
 *   - @solana/web3.js: "^1.78.0"
 *   - @solana/spl-token: "^0.3.8"
 *   - ts-node: "^10.9.1"
 *   - typescript: "^4.9.0"
 *   - @types/node: "^18.0.0"
 * - A wallet file (e.g., my_wallet.json) with a private key
 *
 * Installation:
 * npm install @metaplex-foundation/umi@0.8.9 @metaplex-foundation/umi-bundle-defaults@0.8.9 \
 *   @solana/web3.js@1.78.0 @solana/spl-token@0.3.8 ts-node@10.9.1 typescript@4.9.0 @types/node@18.0.0
 *
 * Usage:
 *   ts-node check-balance.ts
 *
 * Example Output:
 *   Wallet balance: 3.38845844 SOL, MTP: 18,446,744,073.709551615
 */

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';
import { getAccount } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';

// Configuration
const WALLET_FILE = './my_wallet.json'; // Wallet with address 7L7C9RB8Y6RtChco9QGgf8mo7wNiM7HFwHe4vWC7jLwH
const TOKEN_ADDRESS = 'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h'; // MOTO PROTOCOL (MTP)
const RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Solana Devnet

// Initialize Umi and load wallet
const umi = createUmi(RPC_ENDPOINT);
const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
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
