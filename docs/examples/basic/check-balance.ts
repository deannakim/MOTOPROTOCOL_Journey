#!/usr/bin/env ts-node

/**
 * MOTO PROTOCOL Wallet Balance Checker
 *
 * This script checks the balance of a Solana wallet, including SOL and MTP token balances.
 * It serves as a basic example of interacting with the Solana blockchain using Metaplex Umi.
 *
 * Prerequisites:
 * - Node.js v18+ and npm installed
 * - Required dependencies (from package.json):
 *   - @metaplex-foundation/umi: "^1.0.0"
 *   - @metaplex-foundation/umi-bundle-defaults: "^1.0.0"
 *   - @solana/web3.js: "^1.98.0"
 *   - @solana/spl-token: "^0.4.12"
 *   - ts-node: "^10.9.2"
 *   - typescript: "^5.7.3"
 * - A Solana wallet file (e.g., test-wallet.json) with some devnet SOL
 *
 * Setup:
 * 1. Create a test wallet:
 *    solana-keygen new --outfile test-wallet.json
 * 
 * 2. Get devnet SOL:
 *    solana airdrop 1 <YOUR-WALLET-ADDRESS> --url devnet
 *
 * Usage:
 *   npm run example:balance
 *
 * Example Output:
 *   Wallet balance: 1.00000000 SOL, MTP: 0
 */

// ... rest of the code ...
#!/usr/bin/env ts-node

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';
import { getAccount } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';

// Configuration
const WALLET_FILE = './test-wallet.json'; // 새로 생성한 지갑 파일 사용
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
    const solBalance = await connection.getBalance(new PublicKey(umi.identity.publicKey.toString()));
    const solAmount = solBalance / LAMPORTS_PER_SOL;

    // Check MTP token balance
    const tokenMint = publicKey(TOKEN_ADDRESS);
    const accounts = await umi.rpc.getAccounts([umi.identity.publicKey]);
    const mtpAccount = accounts.find((acc: any) => acc?.data?.mint?.equals?.(tokenMint));
    let mtpBalance = '0';
    
    if (mtpAccount) {
      const accountInfo = await getAccount(connection, new PublicKey(mtpAccount.publicKey.toString()));
      mtpBalance = (Number(accountInfo.amount) / 1e9).toLocaleString(); // Assuming 9 decimals
    }

    // Output result
    console.log(`Wallet balance: ${solAmount} SOL, MTP: ${mtpBalance}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error checking balance:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

// Execute the function
checkBalance();
