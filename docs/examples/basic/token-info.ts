/**
 * MOTO PROTOCOL Token Information Example
 * 
 * This example demonstrates how to:
 * 1. Fetch token metadata
 * 2. Get supply information
 * 3. Check token authorities
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getMint } from '@solana/spl-token';

// Configuration
const DEVNET_URL = 'https://api.devnet.solana.com';
const MPT_TOKEN_ADDRESS = '6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE';

async function getTokenInfo() {
    try {
        // Initialize connection
        const connection = new Connection(DEVNET_URL, 'confirmed');
        
        // Create PublicKey object for token
        const tokenMint = new PublicKey(MPT_TOKEN_ADDRESS);

        // Fetch mint info
        const mintInfo = await getMint(connection, tokenMint);

        // Display token information
        console.log('=== MPT Token Information ===\n');
        
        console.log('Basic Information:');
        console.log('------------------');
        console.log('Token Address:', MPT_TOKEN_ADDRESS);
        console.log('Decimals:', mintInfo.decimals);
        console.log('Supply:', (Number(mintInfo.supply) / 10 ** mintInfo.decimals).toLocaleString(), 'MPT');
        
        console.log('\nAuthorities:');
        console.log('------------');
        console.log('Mint Authority:', mintInfo.mintAuthority?.toBase58() || 'Not set');
        console.log('Freeze Authority:', mintInfo.freezeAuthority?.toBase58() || 'Not set');
        
        console.log('\nFlags:');
        console.log('------');
        console.log('Is Initialized:', mintInfo.isInitialized);
        console.log('Supply is Fixed:', !mintInfo.mintAuthority);

        // Get token accounts count
        const tokenAccounts = await connection.getTokenLargestAccounts(tokenMint);
        
        console.log('\nToken Accounts:');
        console.log('--------------');
        console.log('Number of Token Accounts:', tokenAccounts.value.length);
        
        // Display largest holders
        console.log('\nLargest Holders:');
        console.log('---------------');
        for (const account of tokenAccounts.value) {
            const balance = (Number(account.amount) / 10 ** mintInfo.decimals).toLocaleString();
            console.log(`${account.address}: ${balance} MPT`);
        }

    } catch (error) {
        console.error('Error fetching token information:', error);
    }
}

// Run the example
getTokenInfo()
    .then(() => console.log('\nToken info check completed'))
    .catch(console.error);

/**
 * To run this example:
 * 1. npm install @solana/web3.js @solana/spl-token
 * 2. ts-node token-info.ts
 * 
 * Expected output:
 * === MPT Token Information ===
 * 
 * Basic Information:
 * ------------------
 * Token Address: 6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE
 * Decimals: 9
 * Supply: 15,000,000,000 MPT
 * ...
 */
