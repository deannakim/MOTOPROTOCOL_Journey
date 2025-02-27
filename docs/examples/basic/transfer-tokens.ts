// transfer-tokens.ts
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, getMint, getAccount } from '@solana/spl-token';
import { fetchMetadata } from '@metaplex-foundation/mpl-token-metadata';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import chalk from 'chalk';
import promptSync from 'prompt-sync';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey as toPublicKey } from '@metaplex-foundation/umi';
import { TOKEN_ADDRESS } from './config';

const prompt = promptSync({ sigint: true });
dotenv.config();

const DEFAULT_TOKEN = TOKEN_ADDRESS;
const WALLET_FILE = process.env.WALLET_FILE || './test-wallet.json';
let keypair: Keypair;

try {
  const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
  keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
} catch (error) {
  console.error(chalk.red(`Error loading wallet from ${WALLET_FILE}:`), error instanceof Error ? error.message : error);
  console.log(chalk.yellow('Make sure your wallet file exists and contains a valid private key array.'));
  process.exit(1);
}

const connection = new Connection(process.env.RPC_URL || 'https://api.devnet.solana.com', 'confirmed');
const umi = createUmi(process.env.RPC_URL || 'https://api.devnet.solana.com');

let tokenAddress: string;
let amount: number;
let recipientAddress: string;

if (process.argv.length === 4) {
  // 형식: ts-node transfer-tokens.ts AMOUNT RECIPIENT_ADDRESS
  tokenAddress = DEFAULT_TOKEN;
  amount = parseFloat(process.argv[2]);
  recipientAddress = process.argv[3];
} else if (process.argv.length === 5) {
  // 형식: ts-node transfer-tokens.ts TOKEN_ADDRESS AMOUNT RECIPIENT_ADDRESS
  tokenAddress = process.argv[2];
  amount = parseFloat(process.argv[3]);
  recipientAddress = process.argv[4];
} else {
  console.log(chalk.cyan('=== Solana Token Transfer Tool ==='));
  tokenAddress = prompt(`Token address (press Enter for ${DEFAULT_TOKEN}): `) || DEFAULT_TOKEN;
  amount = parseFloat(prompt('Amount to send: '));
  recipientAddress = prompt('Recipient address: ');
}

// 입력 값 검증
try {
  new PublicKey(tokenAddress);
  new PublicKey(recipientAddress);
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }
} catch (error) {
  console.error(chalk.red('Invalid input:'), error instanceof Error ? error.message : error);
  console.log(chalk.yellow('Usage: ts-node transfer-tokens.ts [TOKEN_ADDRESS] AMOUNT RECIPIENT_ADDRESS'));
  process.exit(1);
}

async function fetchTokenMetadata(mint: PublicKey) {
  try {
    const metadata = await fetchMetadata(umi, toPublicKey(mint.toString()));
    return metadata;
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
    
    // SOL 잔액 체크 (수수료용)
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
    
    // 토큰 메타데이터 조회
    const metadata = await fetchTokenMetadata(tokenPubkey);
    if (metadata) {
      console.log(`Token: ${chalk.green(`${metadata.name} (${metadata.symbol})`)}`);
    } else {
      console.log(`Token: ${chalk.yellow(tokenAddress)}`);
    }
    
    // 민트 정보 및 소수점 자리수 확인
    const mintInfo = await getMint(connection, tokenPubkey);
    const decimals = mintInfo.decimals;
    
    const amountString = amount.toString();
    const decimalPart = amountString.includes('.') ? amountString.split('.')[1].length : 0;
    if (decimalPart > decimals) {
      console.error(chalk.red(`Error: Amount has too many decimal places. This token supports up to ${decimals} decimals.`));
      process.exit(1);
    }
    
    const adjustedAmount = amount * Math.pow(10, decimals);
    
    // 보낸 사람의 토큰 계정 확인
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, tokenPubkey, keypair.publicKey);
    const tokenBalance = Number(senderTokenAccount.amount) / Math.pow(10, decimals);
    console.log(`Your balance: ${chalk.green(tokenBalance.toString())} tokens`);
    console.log(`Amount to send: ${chalk.green(amount.toString())} tokens`);
    
    if (tokenBalance < amount) {
      console.error(chalk.red(`Error: Insufficient balance. You have ${tokenBalance} tokens but tried to send ${amount}.`));
      process.exit(1);
    }
    
    console.log(chalk.cyan('Setting up recipient token account...'));
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, tokenPubkey, new PublicKey(recipientAddress));
    
    const confirmation = prompt(chalk.yellow('Confirm transfer? (y/n): '));
    if (confirmation.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Transfer cancelled.'));
      process.exit(0);
    }
    
    console.log(chalk.cyan('Creating transfer transaction...'));
    
    const transferInstruction = createTransferInstruction(
      senderTokenAccount.address,
      recipientTokenAccount.address,
      keypair.publicKey,
      BigInt(Math.round(adjustedAmount))
    );
    
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    
    console.log(chalk.green('\n✅ Transfer successful!'));
    console.log(`Amount: ${chalk.yellow(amount.toString())} tokens`);
    console.log(`Recipient: ${chalk.yellow(recipientAddress)}`);
    console.log(`Transaction signature: ${chalk.blue(signature)}`);
    console.log(chalk.gray(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`));
    
    const updatedAccount = await getAccount(connection, senderTokenAccount.address);
    const newBalance = Number(updatedAccount.amount) / Math.pow(10, decimals);
    console.log(`\nYour new balance: ${chalk.green(newBalance.toString())} tokens`);
    
  } catch (error) {
    console.error(chalk.red('\n❌ Transfer failed:'), error instanceof Error ? error.message : error);
    console.log(chalk.yellow('\nTroubleshooting tips:'));
    console.log('- Check that you have enough SOL to pay for transaction fees');
    console.log('- Verify the recipient address is correct');
    console.log('- Make sure your wallet has enough tokens to send');
    console.log('- If using Devnet, get free SOL from https://solfaucet.com');
  }
}

transferTokens();
