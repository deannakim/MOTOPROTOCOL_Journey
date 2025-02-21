# Development and Testing Guide

## Development Environment Setup

### Required Versions
- Node.js: v18.14.0
- Solana CLI: 2.1.5
- npm: 9.3.1

### Installation Steps

1. **Install Solana CLI Tools**
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

2. **Configure Solana for Devnet**
solana config set --url devnet

3. **Install Project Dependencies**
npm install

## Token Information

### Basic Token Details
- Token Address: `6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE`
- Total Supply: 15,000,000,000 MTP
- Decimals: 9

### Token Accounts
1. Main Account
   - Address: `i7kvq4gvPbSFL8JbcJsM3RBWGWoFe5dR27L3DH9mFSS`
   - Balance: 18,446,744,073.709553 MTP
   - Owner: `6P247mnw8bxXHRExiG3zSW6THgUj1KAude9hKRZmHjiD`

2. Secondary Account
   - Address: `HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog`
   - Balance: 2.56e-7 MTP
   - Owner: `6P247mnw8bxXHRExiG3zSW6THgUj1KAude9hKRZmHjiD`

## Testing Guide

### 1. Check Token Information
npx ts-node check-token-info.ts

This command will display:
- Total supply
- Decimal places
- Freeze authority
- Mint authority
- Token accounts and balances

### 2. Account Validation Test
npx ts-node account-validation-test.ts

Expected Results:
- Valid accounts: Successfully retrieves account information
- Invalid accounts: Throws 'InvalidAccountData' error

### 3. Maximum Transfer Test
npx ts-node max-transfer-test.ts

Test Parameters:
- Sender: `HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog`
- Receiver: `BJ4ceJCkSZ1LpDtj38HwCHYiFqt75VjXWcBE2Q8UyDA4`
- Expected behavior: 'insufficient funds' error when attempting to transfer more than balance

### 4. Invalid Address Test
npx ts-node invalid-address-test.ts

Test Parameters:
- Sender: `HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog`
- Invalid Receiver: `4YpLE6MQL7r7qNNj1eaJSNVQPkpUqejNMxhp4b7zL3Mn`
- Expected behavior: 'InvalidAccountData' error

## Test Results Summary

All tests have been successfully completed on Solana Devnet:
- ✅ Account validation
- ✅ Balance overflow prevention
- ✅ Invalid address protection
- ✅ Token information verification

## Additional Notes
- All tests are performed on Devnet
- Test scripts are stored in the project repository
- For testing, ensure sufficient devnet SOL: solana airdrop 2
