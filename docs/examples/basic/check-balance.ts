import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import * as fs from 'fs';
import chalk from 'chalk';
import { CONFIG } from '../../../config/config';

async function checkBalance() {
  try {
    // Set up network connection
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Load wallet
    const walletPath = CONFIG.WALLET_FILE;
    if (!fs.existsSync(walletPath)) {
      throw new Error(`Wallet file not found at ${walletPath}`);
    }
    
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
    
    // Check SOL balance
    const solBalance = await connection.getBalance(wallet.publicKey);
    
    // Check token balance
    let tokenBalance = 0;
    try {
      const mintAddress = new PublicKey(CONFIG.TOKEN_ADDRESS);
      const ata = await getAssociatedTokenAddress(mintAddress, wallet.publicKey);
      
      try {
        const tokenAccount = await getAccount(connection, ata);
        tokenBalance = Number(tokenAccount.amount);
      } catch (error) {
        console.log(chalk.yellow('Token account not found. The ATA may not have been created.'));
      }
    } catch (error) {
      console.log(chalk.yellow('The token address is invalid or not set.'));
    }
    
    console.log(`Wallet balance: ${(solBalance / 1e9).toFixed(8)} SOL, Token: ${tokenBalance}`);
    
  } catch (error) {
    console.error(chalk.red('Error checking balance:'), error);
    process.exit(1);
  }
}

checkBalance();
