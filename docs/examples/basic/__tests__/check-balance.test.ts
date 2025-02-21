/**
 * Test suite for TokenBalanceChecker
 * 
 * Tests cover:
 * - Basic balance checking functionality
 * - Error handling
 * - Retry mechanism
 * - Edge cases
 */

import { TokenBalanceChecker } from '../check-balance';
import { Connection, PublicKey } from '@solana/web3.js';

// Mock the @solana/web3.js dependencies
jest.mock('@solana/web3.js', () => ({
    Connection: jest.fn(),
    PublicKey: jest.fn(),
    ConnectionConfig: jest.fn()
}));

describe('TokenBalanceChecker', () => {
    let checker: TokenBalanceChecker;
    const mockWalletAddress = 'HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog';

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        checker = new TokenBalanceChecker();
    });

    describe('checkBalance', () => {
        it('should return token balances for valid wallet', async () => {
            // Mock successful response
            const mockAccounts = {
                value: [
                    {
                        pubkey: { toString: () => 'account1' },
                        account: {
                            data: Buffer.from([
                                // Mock account data structure
                                ...new Array(32).fill(0), // authority
                                ...new Array(32).fill(0), // mint
                                1, 0, 0, 0, 0, 0, 0, 0,  // amount (1 token)
                                ...new Array(93).fill(0)  // rest of the data
                            ])
                        }
                    }
                ]
            };

            // Mock Connection.getTokenAccountsByOwner
            (Connection.prototype.getTokenAccountsByOwner as jest.Mock).mockResolvedValueOnce(mockAccounts);

            const balances = await checker.checkBalance(mockWalletAddress);

            expect(balances).toHaveLength(1);
            expect(balances[0]).toEqual({
                address: 'account1',
                amount: 1,
                decimals: 9,
                uiAmount: '0.000000001'
            });
        });

        it('should handle empty token accounts', async () => {
            // Mock empty response
            (Connection.prototype.getTokenAccountsByOwner as jest.Mock).mockResolvedValueOnce({
                value: []
            });

            const balances = await checker.checkBalance(mockWalletAddress);

            expect(balances).toHaveLength(0);
        });

        it('should retry on connection failure', async () => {
            // Mock connection failure then success
            (Connection.prototype.getTokenAccountsByOwner as jest.Mock)
                .mockRejectedValueOnce(new Error('Connection failed'))
                .mockResolvedValueOnce({ value: [] });

            const balances = await checker.checkBalance(mockWalletAddress);

            expect(Connection.prototype.getTokenAccountsByOwner).toHaveBeenCalledTimes(2);
            expect(balances).toHaveLength(0);
        });

        it('should handle invalid wallet address', async () => {
            const invalidWallet = 'invalid-address';

            // Mock PublicKey constructor to throw
            (PublicKey as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid public key');
            });

            const balances = await checker.checkBalance(invalidWallet);

            expect(balances).toHaveLength(0);
        });

        it('should handle multiple token accounts', async () => {
            // Mock multiple accounts
            const mockAccounts = {
                value: [
                    {
                        pubkey: { toString: () => 'account1' },
                        account: {
                            data: Buffer.from([
                                ...new Array(32).fill(0),
                                ...new Array(32).fill(0),
                                100, 0, 0, 0, 0, 0, 0, 0,
                                ...new Array(93).fill(0)
                            ])
                        }
                    },
                    {
                        pubkey: { toString: () => 'account2' },
                        account: {
                            data: Buffer.from([
                                ...new Array(32).fill(0),
                                ...new Array(32).fill(0),
                                200, 0, 0, 0, 0, 0, 0, 0,
                                ...new Array(93).fill(0)
                            ])
                        }
                    }
                ]
            };

            (Connection.prototype.getTokenAccountsByOwner as jest.Mock).mockResolvedValueOnce(mockAccounts);

            const balances = await checker.checkBalance(mockWalletAddress);

            expect(balances).toHaveLength(2);
            expect(balances[0].amount).toBe(100);
            expect(balances[1].amount).toBe(200);
        });
    });
});
