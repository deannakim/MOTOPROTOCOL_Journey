/**
 * MOTO PROTOCOL Token Balance Check Example
 * 
 * This example demonstrates how to:
 * 1. Connect to Solana devnet
 * 2. Check MPT token balance
 * 3. Display token account information
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Configuration
const DEVNET_URL = 'https://api.devnet.solana.com';
const MPT_TOKEN_ADDRESS = '6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE';

async function checkTokenBalance(walletAddress: string) {
    try {
        // Initialize connection to devnet
        const connection = new Connection(DEVNET_URL, 'confirmed');

        // Create PublicKey objects
        const wallet = new PublicKey(walletAddress);
        const token = new PublicKey(MPT_TOKEN_ADDRESS);

        // Find token account
        const tokenAccounts = await connection.getTokenAccountsByOwner(wallet, {
            programId: TOKEN_PROGRAM_ID,
            mint: token,
        });

        // Display results
        console.log('=== Token Balance Check ===\n');
        
        if (tokenAccounts.value.length === 0) {
            console.log('No MPT token account found');
            return;
        }

        tokenAccounts.value.forEach(tokenAccount => {
            const accountInfo = tokenAccount.account.data;
            const balance = accountInfo.parsed.info.tokenAmount.uiAmount;
            
            console.log('Token Account:', tokenAccount.pubkey.toString());
            console.log('Balance:', balance, 'MPT');
            console.log('------------------------');
        });

    } catch (error) {
        console.error('Error checking balance:', error);
    }
}

// Example usage
const EXAMPLE_WALLET = 'HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog';

checkTokenBalance(EXAMPLE_WALLET)
    .then(() => console.log('Balance check completed'))
    .catch(console.error);

/**
 * To run this example:
 * 1. npm install @solana/web3.js @solana/spl-token
 * 2. ts-node check-balance.ts
 * 
 * Expected output:
 * === Token Balance Check ===
 * Token Account: HunkbM...
 * Balance: 14,999,999,999 MPT
 * ------------------------
 * Balance check completed
 */
