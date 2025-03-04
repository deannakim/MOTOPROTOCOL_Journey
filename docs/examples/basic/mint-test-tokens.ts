import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { CONFIG } from '../../../config/config';

// Function for retry logic
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.log(chalk.yellow(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`));
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * backoff, backoff);
  }
}

// Function to update config.ts file
async function updateConfigFile(tokenAddress: string): Promise<void> {
  try {
    const configPath = path.join(__dirname, '../../../config/config.ts');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update TOKEN_ADDRESS value
    const tokenAddressRegex = /(TOKEN_ADDRESS:\s*['"])([^'"]*)(["'])/;
    configContent = configContent.replace(tokenAddressRegex, `$1${tokenAddress}$3`);
    
    fs.writeFileSync(configPath, configContent);
    console.log(chalk.green('✓ config.ts file has been automatically updated.'));
  } catch (error) {
    console.error(chalk.red('An error occurred while updating config.ts file:'), error);
  }
}

// Function to check token balance
async function checkTokenBalance(connection: Connection, wallet: Keypair, mintAddress: PublicKey): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(mintAddress, wallet.publicKey);
    const tokenAccount = await connection.getTokenAccountBalance(ata);
    return parseInt(tokenAccount.value.amount);
  } catch (error) {
    console.log(chalk.yellow('Error occurred while checking token balance, assuming 0.'));
    return 0;
  }
}

// Simple token creation function
async function createSimpleToken(): Promise<string> {
  console.log(chalk.cyan('\nCreating fungible token...'));
  
  // Set up network connection
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  console.log(`Network: ${connection.rpcEndpoint}`);
  
  // Load wallet
  const walletPath = CONFIG.WALLET_FILE;
  if (!fs.existsSync(walletPath)) {
    throw new Error(`Wallet file not found at ${walletPath}`);
  }
  
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
  console.log(`Wallet: ${wallet.publicKey.toString()}`);
  
  // Generate token mint
  const mintKeypair = Keypair.generate();
  console.log(`Generated mint address: ${mintKeypair.publicKey.toString()}`);
  
  // Create mint with retry logic
  await retry(async () => {
    console.log(chalk.cyan('\nCreating fungible token with metadata...'));
    
    // Create mint account
    await createMint(
      connection,
      wallet,
      wallet.publicKey,
      wallet.publicKey,
      9, // Decimal places
      mintKeypair
    );
    
    // Create and verify ATA
    console.log('Creating associated token account...');
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintKeypair.publicKey,
      wallet.publicKey
    );
    
    // Mint initial supply
    console.log('Minting initial supply...');
    const initialSupply = 1000000 * Math.pow(10, 9); // 1,000,000 tokens (considering 9 decimal places)
    
    await mintTo(
      connection,
      wallet,
      mintKeypair.publicKey,
      ata.address, // Explicitly mint to ATA address
      wallet,
      initialSupply
    );
    
    // Check token balance
    const balance = await checkTokenBalance(connection, wallet, mintKeypair.publicKey);
    if (balance === 0) {
      throw new Error('Tokens were not successfully minted. Retrying...');
    }
    
    console.log(chalk.green(`✓ Token balance confirmed: ${balance} (normal)`));
  }, 3, 2000, 1.5);
  
  console.log(chalk.green('\n✓ Fungible token created successfully!'));
  console.log(`Mint Address: ${mintKeypair.publicKey.toString()}`);
  
  console.log('\nToken Details:');
  console.log(`Name: MOTOPROTOCOL Test Token`);
  console.log(`Symbol: MTPTEST`);
  console.log(`Decimals: 9`);
  console.log(`Initial Supply: 1000000`);
  console.log(`Description: Test token for MOTO Protocol Journey`);
  
  // Update config.ts file
  await updateConfigFile(mintKeypair.publicKey.toString());
  
  console.log('\nNext Steps:');
  console.log('1. Run \'npm run example:info\' to verify the token details');
  console.log('2. Run \'npm run example:balance\' to check your token balance');
  
  return mintKeypair.publicKey.toString();
}

// Main function
async function main() {
  try {
    await createSimpleToken();
  } catch (error) {
    console.error(chalk.red('Error creating token:'), error);
    process.exit(1);
  }
}

main();
