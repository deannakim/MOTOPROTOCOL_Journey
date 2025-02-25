/**
 * MOTO PROTOCOL Batch Processing Example
 * 
 * This example demonstrates how to:
 * 1. Process multiple SPL token transfers in a single transaction
 * 2. Optimize for Solana's transaction size limits
 * 3. Handle errors and provide detailed logging
 * 
 * Use case: Vehicle fleet management system processing multiple data points
 */

import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { 
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import * as fs from 'fs';

// Configuration
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const MAX_INSTRUCTIONS_PER_TRANSACTION = 5; // Solana limit is around 1232 bytes per transaction

interface TokenTransferData {
    recipientAddress: string;
    amount: number;
    reference: string; // For tracking/auditing
}

class BatchTokenProcessor {
    private connection: Connection;
    private payer: Keypair;
    private tokenMint: PublicKey;
    private sourceTokenAccount: PublicKey;
    
    constructor(
        payerKeypairPath: string,
        tokenMintAddress: string
    ) {
        this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
        
        // Load payer from file
        const payerKeyData = JSON.parse(fs.readFileSync(payerKeypairPath, 'utf-8'));
        this.payer = Keypair.fromSecretKey(new Uint8Array(payerKeyData));
        
        // Set token mint
        this.tokenMint = new PublicKey(tokenMintAddress);
        
        // Will be initialized in setup()
        this.sourceTokenAccount = null as unknown as PublicKey;
    }
    
    async setup() {
        // Get the associated token account for the payer
        this.sourceTokenAccount = await getAssociatedTokenAddress(
            this.tokenMint,
            this.payer.publicKey
        );
        
        console.log(`Batch processor initialized for token: ${this.tokenMint.toString()}`);
        console.log(`Source token account: ${this.sourceTokenAccount.toString()}`);
        
        // Verify the token account exists and has sufficient balance
        try {
            const tokenBalance = await this.connection.getTokenAccountBalance(this.sourceTokenAccount);
            console.log(`Current token balance: ${tokenBalance.value.uiAmount}`);
        } catch (error) {
            console.error('Error checking token balance:', error);
            throw new Error('Failed to verify token account. Please check if it exists and has sufficient balance.');
        }
    }
    
    async processBatch(transferDataList: TokenTransferData[]) {
        if (!this.sourceTokenAccount) {
            throw new Error('Batch processor not initialized. Call setup() first.');
        }
        
        console.log(`Processing batch of ${transferDataList.length} transfers...`);
        
        // Split transfers into multiple transactions if needed
        const transactionBatches: TokenTransferData[][] = [];
        for (let i = 0; i < transferDataList.length; i += MAX_INSTRUCTIONS_PER_TRANSACTION) {
            transactionBatches.push(
                transferDataList.slice(i, i + MAX_INSTRUCTIONS_PER_TRANSACTION)
            );
        }
        
        console.log(`Split into ${transactionBatches.length} transaction batches`);
        
        // Process each transaction batch
        const signatures: string[] = [];
        for (let i = 0; i < transactionBatches.length; i++) {
            const batch = transactionBatches[i];
            console.log(`Processing batch ${i+1}/${transactionBatches.length} with ${batch.length} transfers`);
            
            try {
                const signature = await this.processTransactionBatch(batch);
                signatures.push(signature);
                console.log(`Batch ${i+1} processed successfully: ${signature}`);
            } catch (error) {
                console.error(`Error processing batch ${i+1}:`, error);
                throw error;
            }
        }
        
        return signatures;
    }
    
    private async processTransactionBatch(batch: TokenTransferData[]) {
        // Create a new transaction
        const transaction = new Transaction();
        
        // Add transfer instructions
        for (const transfer of batch) {
            const recipientPublicKey = new PublicKey(transfer.recipientAddress);
            
            // Get or create the recipient's associated token account
            const destinationTokenAccount = await getAssociatedTokenAddress(
                this.tokenMint,
                recipientPublicKey
            );
            
            // Add transfer instruction
            transaction.add(
                createTransferInstruction(
                    this.sourceTokenAccount,
                    destinationTokenAccount,
                    this.payer.publicKey,
                    transfer.amount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Add memo for reference (optional)
            // transaction.add(
            //     new TransactionInstruction({
            //         keys: [],
            //         programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            //         data: Buffer.from(transfer.reference)
            //     })
            // );
        }
        
        // Send and confirm transaction
        const signature = await sendAndConfirmTransaction(
            this.connection,
            transaction,
            [this.payer]
        );
        
        return signature;
    }
    
    // Utility method to generate test data
    static generateTestData(count: number, recipientBase: string): TokenTransferData[] {
        const data: TokenTransferData[] = [];
        
        for (let i = 0; i < count; i++) {
            // In a real scenario, these would be actual recipient addresses
            const recipientSuffix = (i % 10).toString().repeat(31); // Create variation in addresses
            data.push({
                recipientAddress: recipientBase + recipientSuffix,
                amount: 1000 + (i * 100), // Varying amounts
                reference: `VEHICLE-${1000 + i}-PAYMENT`
            });
        }
        
        return data;
    }
}

/**
 * Example usage:
 * 
 * 1. Create a new instance with your keypair and token mint
 * 2. Initialize with setup()
 * 3. Process a batch of transfers
 */
async function runExample() {
    try {
        // Replace with your actual keypair path and token mint
        const processor = new BatchTokenProcessor(
            './my_wallet.json',
            'GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h'
        );
        
        // Initialize
        await processor.setup();
        
        // Generate test data (in production, this would come from your database)
        const testData = BatchTokenProcessor.generateTestData(
            12, // Number of transfers
            '8ZKS' // Base for recipient addresses (would be real addresses in production)
        );
        
        // Process the batch
        const signatures = await processor.processBatch(testData);
        
        console.log('All batches processed successfully!');
        console.log('Transaction signatures:', signatures);
        
    } catch (error) {
        console.error('Error in batch processing example:', error);
    }
}

// Uncomment to run the example
// runExample();

export { BatchTokenProcessor, TokenTransferData };
