#!/usr/bin/env ts-node

/**
 * Test Token Minting Script
 * 
 * 테스트 환경에서 SPL 토큰을 생성하고 초기 물량을 민팅하는 스크립트입니다.
 * Devnet에서만 사용하세요!
 * 
 * Features:
 * - 새로운 테스트 토큰 생성
 * - 초기 물량 민팅
 * - 메타데이터 설정 (선택사항)
 */

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo 
} from '@solana/spl-token';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import chalk from 'chalk';

dotenv.config();

const connection = new Connection(
  process.env.RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// 지갑 설정
const WALLET_FILE = process.env.WALLET_FILE || './test-wallet.json';
let keypair: Keypair;

try {
  const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
  keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
} catch (error) {
  console.error(
    chalk.red(`Error loading wallet from ${WALLET_FILE}:`),
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}

// 토큰 설정
const DECIMALS = 9;  // MTP와 동일하게 설정
const MINT_AMOUNT = 1000000;  // 테스트용 초기 물량

async function createTestToken() {
  try {
    console.log(chalk.cyan('\nCreating test token...'));
    console.log(`Network: ${process.env.RPC_URL || 'Devnet'}`);
    console.log(`Wallet: ${chalk.yellow(keypair.publicKey.toBase58())}`);

    // 토큰 민트 생성
    console.log(chalk.cyan('\nCreating mint...'));
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,  // mint authority
      keypair.publicKey,  // freeze authority (선택사항)
      DECIMALS
    );
    console.log(chalk.green('✓ Mint created successfully!'));
    console.log(`Mint Address: ${chalk.yellow(mint.toBase58())}`);

    // 토큰 계정 생성 및 초기 물량 민팅
    console.log(chalk.cyan('\nMinting initial supply...'));
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    await mintTo(
      connection,
      keypair,
      mint,
      tokenAccount.address,
      keypair,
      MINT_AMOUNT * Math.pow(10, DECIMALS)
    );

    console.log(chalk.green('✓ Initial supply minted successfully!'));
    console.log(`Amount: ${chalk.yellow(MINT_AMOUNT.toString())} tokens`);
    console.log(`Token Account: ${chalk.yellow(tokenAccount.address.toBase58())}`);

    // 저장할 정보 출력
    console.log(chalk.cyan('\nSave these addresses for testing:'));
    console.log(`MINT_ADDRESS=${mint.toBase58()}`);
    console.log(`TOKEN_ACCOUNT=${tokenAccount.address.toBase58()}`);

  } catch (error) {
    console.error(
      chalk.red('\nFailed to create test token:'),
      error instanceof Error ? error.message : error
    );
    console.log(chalk.yellow('\nTroubleshooting tips:'));
    console.log('- Make sure you have enough SOL for transaction fees');
    console.log('- Check your wallet file path and permissions');
    console.log('- Verify your network connection');
    process.exit(1);
  }
}

// 스크립트 실행
createTestToken();
