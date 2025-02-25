#!/usr/bin/env ts-node

/**
 * Simple Solana Token Info Checker
 *
 * This example demonstrates how to query SPL token information on the Solana network.
 * Optimized for DevRel portfolios, it shows how to fetch token data directly from the blockchain.
 *
 * Prerequisites:
 * - Node.js v16+ installed
 * - Required packages:
 *   - ts-node: Runs TypeScript directly
 *   - @solana/web3.js: Connects to Solana
 *   - @solana/spl-token: Works with SPL tokens
 *   - @metaplex-foundation/mpl-token-metadata: Fetches token metadata
 *   - dotenv: Manages environment variables
 *   - chalk: Adds colors to console output
 *
 * Installation:
 * 1. Create a .env file with RPC_URL (optional, defaults to Devnet)
 * 2. Run: npm install ts-node @solana/web3.js @solana/spl-token @metaplex-foundation/mpl-token-metadata dotenv chalk
 *
 * Usage:
 * - Run: ts-node token-info.ts
 * - Or specify a custom token: ts-node token-info.ts TOKEN_ADDRESS
 *
 * Example Output:
 *   Token: MOTO PROTOCOL (MTP)
 *   Mint Address: GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h
 *   Decimals: 9
 *   Supply: 18,446,744,073.709552
 *   Mint Authority: None (fixed supply)
 *   Metadata URI: https://...
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Default token to check (MOTO PROTOCOL - MTP)
const DEFAULT_TOKEN = 'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h';

// Get token address from command line or use default
const tokenAddress = process.argv[2] || DEFAULT_TOKEN;

// Validate token address format
try {
  new PublicKey(tokenAddress);
} catch (error) {
  console.log(chalk.red('Invalid token address format'));
  console.log(chalk.yellow('Usage: ts-node token-info.ts [TOKEN_ADDRESS]'));
  console.log(chalk.yellow('Example: ts-node token-info.ts GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h'));
  process.exit(1);
}

// Solana connection - use environment variable or default to Devnet
const connection = new Connection(
  process.env.RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Fetch token metadata from blockchain using Metaplex standard
async function fetchMetadata(mint: PublicKey) {
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    const metadataAccount = await Metadata.load(connection, metadataPDA);
    return metadataAccount.data;
  } catch (error) {
    console.log(chalk.yellow('No on-chain metadata found for this token'));
    return null;
  }
}

async function getTokenInfo() {
  try {
    console.log(chalk.cyan(`Checking token: ${tokenAddress}`));
    console.log(chalk.cyan(`Network: ${process.env.RPC_URL || 'Devnet'}`));
    
    // Get token mint info
    const mintPublicKey = new PublicKey(tokenAddress);
    const mintInfo = await getMint(connection, mintPublicKey);
    
    // Format supply with proper decimals (limit to 6 decimal places for display)
    const supply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
    const formattedSupply = supply.toLocaleString('en-US', {
      maximumFractionDigits: Math.min(mintInfo.decimals, 6)
    });
    
    // Try to get metadata from blockchain
    const metadata = await fetchMetadata(mintPublicKey);
    const tokenName = metadata ? `${metadata.data.name} (${metadata.data.symbol})` : 'Unknown';
    
    // Display token information
    console.log(chalk.green('\n=== Token Information ==='));
    console.log(`Token: ${chalk.bold(tokenName)}`);
    console.log(`Mint Address: ${chalk.yellow(tokenAddress)}`);
    console.log(`Decimals: ${chalk.yellow(mintInfo.decimals.toString())}`);
    console.log(`Supply: ${chalk.yellow(formattedSupply)}`);
    
    // Check if mint authority exists
    if (mintInfo.mintAuthority) {
      console.log(`Mint Authority: ${chalk.yellow(mintInfo.mintAuthority.toBase58())}`);
    } else {
      console.log(`Mint Authority: ${chalk.green('None (fixed supply)')}`);
    }
    
    // Check if freeze authority exists
    if (mintInfo.freezeAuthority) {
      console.log(`Freeze Authority: ${chalk.yellow(mintInfo.freezeAuthority.toBase58())}`);
    } else {
      console.log(`Freeze Authority: ${chalk.green('None')}`);
    }
    
    // Show additional metadata if available
    if (metadata) {
      console.log(chalk.green('\n=== Token Metadata ==='));
      console.log(`Name: ${chalk.bold(metadata.data.name)}`);
      console.log(`Symbol: ${chalk.bold(metadata.data.symbol)}`);
      
      if (metadata.data.uri) {
        console.log(`Metadata URI: ${chalk.blue(metadata.data.uri)}`);
        console.log(chalk.yellow('Tip: You can fetch additional data from this URI'));
      }
      
      // If we have creators info
      if (metadata.data.creators && metadata.data.creators.length > 0) {
        console.log(chalk.green('\n=== Creators ==='));
        metadata.data.creators.forEach((creator, index) => {
          console.log(`Creator ${index+1}: ${chalk.yellow(creator.address.toBase58())} (Share: ${creator.share}%)`);
        });
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Error getting token information:'), error.message);
    console.log(chalk.yellow('\nTips:'));
    console.log('- Check if the token address is correct');
    console.log('- Make sure you are connected to the internet');
    console.log('- The token might not exist on the selected network');
    console.log('- Try switching networks by setting RPC_URL in .env file');
  }
}

// Run the check
getTokenInfo();
