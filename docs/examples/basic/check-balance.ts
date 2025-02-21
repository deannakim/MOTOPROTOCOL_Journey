/**
 * MOTO PROTOCOL Token Balance Checker
 * 
 * This example demonstrates how to check MPT token balances on Solana.
 * Key features:
 * - Connection management with retry logic
 * - Comprehensive error handling
 * - Detailed balance information display
 * - Support for multiple token accounts
 */

import { Connection, PublicKey, ConnectionConfig } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import { sleep } from './utils';

// Configuration constants
const DEVNET_URL = 'https://api.devnet.solana.com';
const MPT_TOKEN_ADDRESS = '6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface TokenBalance {
    address: string;
    amount: number;
    decimals: number;
    uiAmount: string;
}

class TokenBalanceChecker {
    private connection: Connection;
    private tokenMint: PublicKey;

    constructor() {
        const config: ConnectionConfig = {
            commitment: 'confirmed',
            confirmTransactionInitialTimeout: 60000,
            disableRetryOnRateLimit: false
        };
        
        this.connection = new Connection(DEVNET_URL, config);
        this.tokenMint = new PublicKey(MPT_TOKEN_ADDRESS);
    }

    /**
     * Check token balance for a given wallet address
     * @param walletAddress - Solana wallet address
     * @returns Promise<TokenBalance[]>
     */
    async checkBalance(walletAddress: string): Promise<TokenBalance[]> {
        try {
            const wallet = new PublicKey(walletAddress);
            
            // Get all token accounts for the wallet
            const accounts = await this.retryOperation(() => 
                this.connection.getTokenAccountsByOwner(wallet, {
                    programId: TOKEN_PROGRAM_ID,
                    mint: this.tokenMint,
                })
            );

            if (accounts.value.length === 0) {
                console.log(`No MPT token accounts found for wallet: ${walletAddress}`);
                return [];
            }

            // Process each token account
            const balances = accounts.value.map(account => {
                const accountData = AccountLayout.decode(account.account.data);
                
                return {
                    address: account.pubkey.toString(),
                    amount: Number(accountData.amount),
                    decimals: 9, // MPT uses 9 decimals
                    uiAmount: (Number(accountData.amount) / Math.pow(10, 9)).toLocaleString()
                };
            });

            this.displayBalances(balances);
            return balances;

        } catch (error) {
            this.handleError('Error checking balance', error);
            return [];
        }
    }

    /**
     * Retry an operation with exponential backoff
     * @param operation - Function to retry
     * @returns Promise<T>
     */
    private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
        let lastError;
        
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed, retrying...`);
                await sleep(RETRY_DELAY * attempt);
            }
        }
        
        throw lastError;
    }

    /**
     * Display token balances in a formatted way
     * @param balances - Array of token balances
     */
    private displayBalances(balances: TokenBalance[]): void {
        console.log('\n=== MPT Token Balances ===\n');
        
        balances.forEach((balance, index) => {
            console.log(`Account ${index + 1}:`);
            console.log(`Address: ${balance.address}`);
            console.log(`Balance: ${balance.uiAmount} MPT`);
            console.log('------------------------');
        });
    }

    /**
     * Handle errors with detailed logging
     * @param message - Error context message
     * @param error - Error object
     */
    private handleError(message: string, error: any): void {
        console.error(`${message}:`);
        
        if (error instanceof Error) {
            console.error('Name:', error.name);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        } else {
            console.error('Unknown error:', error);
        }
    }
}

// Example usage
async function main() {
    const checker = new TokenBalanceChecker();
    const walletAddress = 'HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog';
    
    console.log('Checking MPT token balance...');
    await checker.checkBalance(walletAddress);
}

// Run the example if this file is executed directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

// Export for testing
export { TokenBalanceChecker, TokenBalance };
