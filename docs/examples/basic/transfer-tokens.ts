/**
 * MOTO PROTOCOL Token Transfer Example
 * 
 * This example demonstrates how to:
 * 1. Connect to Solana devnet
 * 2. Transfer MPT tokens between accounts
 * 3. Confirm transaction
 */

import { 
    Connection, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction 
} from '@solana/web3.js';
import { 
    TOKEN_PROGRAM_ID,
    createTransferInstruction
} from '@solana/spl-token';

// Configuration
const DEVNET_URL = 'https://api.devnet.solana.com';
const MPT_TOKEN_ADDRESS = '6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE';

async function transferTokens(
    fromAddress: string,
    toAddress: string,
    amount: number
) {
    try {
        // Initialize connection
        const connection = new Connection(DEVNET_URL, 'confirmed');

        // Create PublicKey objects
        const fromPubkey = new PublicKey(fromAddress);
        const toPubkey = new PublicKey(toAddress);
        const tokenMint = new PublicKey(MPT_TOKEN_ADDRESS);

        // Find token accounts
        const fromTokenAccount = await connection.getTokenAccountsByOwner(
            fromPubkey,
            { mint: tokenMint }
        );
        
        const toTokenAccount = await connection.getTokenAccountsByOwner(
            toPubkey,
            { mint: tokenMint }
        );

        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
            fromTokenAccount.value[0].pubkey,
            toTokenAccount.value[0].pubkey,
            fromPubkey,
            amount * (10 ** 9) // Convert to raw amount (9 decimals)
        );

        // Create and send transaction
        const transaction = new Transaction().add(transferInstruction);
        
        console.log('Sending transaction...');
        
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [/* your wallet keypair */]
        );

        console.log('Transaction successful!');
        console.log('Signature:', signature);

    } catch (error) {
        console.error('Error transferring tokens:', error);
    }
}

// Example usage
const FROM_WALLET = 'HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog';
const TO_WALLET = 'BJ4ceJCkSZ1LpDtj38HwCHYiFqt75VjXWcBE2Q8UyDA4';
const AMOUNT = 1; // 1 MPT

transferTokens(FROM_WALLET, TO_WALLET, AMOUNT)
    .then(() => console.log('Transfer completed'))
    .catch(console.error);

/**
 * To run this example:
 * 1. npm install @solana/web3.js @solana/spl-token
 * 2. ts-node transfer-tokens.ts
 * 
 * Note: You need to add your wallet keypair for actual transfers
 */
