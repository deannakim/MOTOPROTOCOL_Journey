import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer, getAssociatedTokenAddress } from '@solana/spl-token';
import * as fs from 'fs';
import chalk from 'chalk';
import { CONFIG } from '../../../config/config';

async function transferTokens() {
  try {
    // Check command line arguments
    const args = process.argv.slice(2);
    if (args.length !== 3) {
      console.error(chalk.red('Usage: npm run example:transfer <token_address> <amount> <recipient_address>'));
      process.exit(1);
    }

    const [tokenAddress, amount, recipientAddress] = args;

    // Set up network connection
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Load wallet
    const walletPath = CONFIG.WALLET_FILE;
    if (!fs.existsSync(walletPath)) {
      throw new Error(`Wallet file not found at ${walletPath}`);
    }
    
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));

    // Parse token mint address
    const mint = new PublicKey(tokenAddress);
    const recipient = new PublicKey(recipientAddress);

    console.log(chalk.cyan('\nInitiating token transfer...'));
    console.log(`From: ${wallet.publicKey.toString()}`);
    console.log(`To: ${recipient.toString()}`);
    console.log(`Amount: ${amount}`);
    console.log(`Token: ${mint.toString()}`);

    // Get sender's token account
    const senderAta = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    // Get or create recipient's token account
    const recipientAta = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      recipient
    );

    // Calculate transfer amount considering decimals
    const transferAmount = Number(amount) * Math.pow(10, 9); // 9 decimals

    console.log(chalk.cyan('\nExecuting transfer...'));

    // Execute token transfer
    const signature = await transfer(
      connection,
      wallet,
      senderAta.address,
      recipientAta.address,
      wallet,
      transferAmount
    );

    // Wait for transaction confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    console.log(chalk.green('\n✓ Transfer completed successfully!'));
    console.log(`Transaction signature: ${signature}`);

    // Check balance after transfer
    const senderBalance = await connection.getTokenAccountBalance(senderAta.address);
    console.log(`\nUpdated sender balance: ${senderBalance.value.uiAmount} tokens`);

  } catch (error) {
    console.error(chalk.red('Error during transfer:'), error);
    process.exit(1);
  }
}

transferTokens();
