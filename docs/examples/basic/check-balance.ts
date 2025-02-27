// check-balance.ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';
import { getAccount } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import { TOKEN_ADDRESS } from './config';

const WALLET_FILE = './test-wallet.json'; // 지갑 파일 경로
const RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Devnet 엔드포인트

// Umi 초기화 및 지갑 로드
const umi = createUmi(RPC_ENDPOINT);
const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletData));
umi.use(keypairIdentity(keypair));

// Solana 연결 (SOL 잔액 확인용)
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

async function checkBalance() {
  try {
    // SOL 잔액 체크
    const solBalance = await connection.getBalance(new PublicKey(umi.identity.publicKey.toString()));
    const solAmount = solBalance / LAMPORTS_PER_SOL;

    // 지정된 토큰(TOKEN_ADDRESS)의 잔액 체크
    const tokenMint = publicKey(TOKEN_ADDRESS);
    const accounts = await umi.rpc.getAccounts([umi.identity.publicKey]);
    const tokenAccount = accounts.find((acc: any) => acc?.data?.mint?.equals?.(tokenMint));
    let tokenBalance = '0';
    
    if (tokenAccount) {
      const accountInfo = await getAccount(connection, new PublicKey(tokenAccount.publicKey.toString()));
      tokenBalance = (Number(accountInfo.amount) / 1e9).toLocaleString(); // 9 소수점 기준
    }

    console.log(`Wallet balance: ${solAmount} SOL, Token: ${tokenBalance}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error checking balance:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

// 실행
checkBalance();
