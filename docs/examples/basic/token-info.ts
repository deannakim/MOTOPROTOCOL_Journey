/**
 * Simple Solana Token Info Checker
 * 
 * 이 예제는 Solana 네트워크 상의 SPL 토큰 정보를 조회하는 방법을 보여줍니다.
 * DevRel 포트폴리오용으로, 토큰 데이터를 블록체인에서 직접 가져오는 방식을 시연합니다.
 * 
 * 필수 전제:
 *  - Node.js v18+ 설치
 *  - 아래 패키지들:
 *      @metaplex-foundation/mpl-token-metadata: "^3.4.0"
 *      @solana/web3.js: "^1.98.0"
 *      @solana/spl-token: "^0.4.12"
 *      chalk: "^4.1.2"
 * 
 * 사용법:
 *  npm run example:info
 *  또는 커스텀 토큰을 지정: npm run example:info TOKEN_ADDRESS
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { fetchMetadata } from '@metaplex-foundation/mpl-token-metadata';
import chalk from 'chalk';

// 기본 토큰 (MOTO PROTOCOL - MTP)
const DEFAULT_TOKEN = 'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h';
// 커맨드라인 인자로부터 토큰 주소 받기
const tokenAddress = process.argv[2] || DEFAULT_TOKEN;

// 토큰 주소 포맷 검증
try {
  new PublicKey(tokenAddress);
} catch (error) {
  console.log(chalk.red('Invalid token address format'));
  console.log(chalk.yellow('Usage: npm run example:info [TOKEN_ADDRESS]'));
  console.log(chalk.yellow(`Example: npm run example:info ${DEFAULT_TOKEN}`));
  process.exit(1);
}

// Solana 네트워크와 Umi 초기화
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const umi = createUmi('https://api.devnet.solana.com');

// Creator 인터페이스 정의
interface Creator {
  address: string;
  verified: boolean;
  share: number;
}

async function getTokenInfo() {
  try {
    console.log(chalk.cyan(`Checking token: ${tokenAddress}`));
    console.log(chalk.cyan('Network: Devnet'));

    // 토큰 민트 정보 조회
    const mintPublicKey = new PublicKey(tokenAddress);
    const mintInfo = await getMint(connection, mintPublicKey);

    // 소수점 자리수에 맞게 공급량 포맷팅
    const supply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
    const formattedSupply = supply.toLocaleString('en-US', {
      maximumFractionDigits: Math.min(mintInfo.decimals, 6)
    });

    // fetchMetadata를 통해 메타데이터 조회
    const metadata = await fetchMetadata(umi, publicKey(tokenAddress));

    // 토큰 정보 출력
    console.log(chalk.green('\n=== Token Information ==='));
    console.log(`Token: ${chalk.bold(`${metadata.name} (${metadata.symbol})`)}`);
    console.log(`Mint Address: ${chalk.yellow(tokenAddress)}`);
    console.log(`Decimals: ${chalk.yellow(mintInfo.decimals.toString())}`);
    console.log(`Supply: ${chalk.yellow(formattedSupply)}`);

    if (mintInfo.mintAuthority) {
      console.log(`Mint Authority: ${chalk.yellow(mintInfo.mintAuthority.toBase58())}`);
    } else {
      console.log(`Mint Authority: ${chalk.green('None (fixed supply)')}`);
    }

    if (mintInfo.freezeAuthority) {
      console.log(`Freeze Authority: ${chalk.yellow(mintInfo.freezeAuthority.toBase58())}`);
    } else {
      console.log(`Freeze Authority: ${chalk.green('None')}`);
    }

    // 메타데이터 출력
    console.log(chalk.green('\n=== Token Metadata ==='));
    console.log(`Name: ${chalk.bold(metadata.name)}`);
    console.log(`Symbol: ${chalk.bold(metadata.symbol)}`);
    if (metadata.uri) {
      console.log(`Metadata URI: ${chalk.blue(metadata.uri)}`);
    }

    // Option 타입으로 반환된 creators 처리 (내부 value가 있는지 확인)
    let creators: Creator[] = [];
    if (
      metadata.creators &&
      typeof metadata.creators === 'object' &&
      'value' in metadata.creators
    ) {
      creators = metadata.creators.value as Creator[];
    }

    if (Array.isArray(creators) && creators.length > 0) {
      console.log(chalk.green('\n=== Creators ==='));
      creators.forEach((creator: Creator, index: number) => {
        console.log(`Creator ${index + 1}: ${chalk.yellow(creator.address)} (Share: ${creator.share}%)`);
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Error getting token information:'), error.message);
      console.log(chalk.yellow('\nTips:'));
      console.log('- Check if the token address is correct');
      console.log('- Make sure you are connected to the internet');
      console.log('- The token might not exist on Devnet');
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }
    process.exit(1);
  }
}

// 실행
getTokenInfo();
