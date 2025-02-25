# MOTO PROTOCOL API Reference

This document provides a comprehensive reference for the MOTO PROTOCOL SDK functions that interact with the Solana blockchain.

## Table of Contents

- [Token Management](#token-management)
  - [createTestToken](#createtesttoken)
  - [transferTokens](#transfertokens)
  - [transferTotalSupply](#transfertotalsupply)
  - [disableMinting](#disableminting)
- [Metadata Management](#metadata-management)
  - [createTokenMetadata](#createtokenmetadata)
  - [checkMetadata](#checkmetadata)
- [Account Management](#account-management)
  - [changeTokenAuthority](#changetokenauthority)
  - [checkAccountInfo](#checkaccountinfo)

## Token Management

### createTestToken

Creates a new test token on the Solana devnet.

**Parameters**: None (uses wallet from `my_wallet.json`)

**Returns**: Object containing token information
- `tokenMint`: The address of the token mint
- `tokenAccount`: The address of the token account
- `owner`: The address of the token owner
- `decimals`: The number of decimal places
- `totalSupply`: The total supply of tokens

**Example**:
```typescript
import { createTestToken } from './src/create-test-token';

// Create a new test token
const tokenInfo = await createTestToken();
console.log(`Token created: ${tokenInfo.tokenMint}`);
```

### transferTokens

Transfers tokens from one account to another.

**Parameters**:
- `connection`: Solana connection object
- `owner`: Keypair of the token owner
- `sourceAccount`: PublicKey of the source token account
- `destinationAccount`: PublicKey of the destination token account
- `amount`: Amount of tokens to transfer (in base units)

**Returns**: Transaction signature

**Example**:
```typescript
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { transferTokens } from './src/transfer-tokens';

const connection = new Connection("https://api.devnet.solana.com");
const owner = Keypair.fromSecretKey(/* wallet secret key */);
const sourceAccount = new PublicKey("source-account-address");
const destinationAccount = new PublicKey("destination-account-address");
const amount = 1000 * 1e9; // 1000 tokens with 9 decimals

const signature = await transferTokens(
  connection,
  owner,
  sourceAccount,
  destinationAccount,
  amount
);
console.log(`Transfer complete: ${signature}`);
```

### transferTotalSupply

Transfers the entire balance of tokens from one account to another.

**Parameters**: None (uses wallet from `my_wallet.json`)

**Returns**: Transaction signature

**Example**:
```typescript
import { transferTotalSupply } from './src/transfer-total-supply';

// Transfer all tokens from the source account to the destination account
const signature = await transferTotalSupply();
console.log(`Transfer complete: ${signature}`);
```

### disableMinting

Permanently disables the ability to mint new tokens by removing the mint authority.

**Parameters**: None (uses wallet from `my_wallet.json`)

**Returns**: Transaction signature

**Example**:
```typescript
import { disableMinting } from './src/disable-minting';

// Disable minting for the token
const signature = await disableMinting();
console.log(`Minting disabled: ${signature}`);
```

## Metadata Management

### createTokenMetadata

Creates metadata for an existing token.

**Parameters**: None (uses wallet from `my_wallet.json` and hardcoded token address)

**Returns**: Transaction signature

**Example**:
```typescript
import { createTokenMetadata } from './src/create-metadata-2';

// Create metadata for the token
const signature = await createTokenMetadata();
console.log(`Metadata created: ${signature}`);
```

### checkMetadata

Retrieves and displays the metadata for a token.

**Parameters**: None (uses hardcoded token address)

**Returns**: None (logs metadata to console)

**Example**:
```typescript
import { checkMetadata } from './src/check-metadata';

// Check the metadata for the token
await checkMetadata();
```

## Account Management

### changeTokenAuthority

Changes the authority for a token account.

**Parameters**:
- `connection`: Solana connection object
- `payer`: Keypair of the transaction fee payer
- `tokenAccount`: PublicKey of the token account
- `currentAuthority`: Keypair of the current authority
- `newAuthority`: PublicKey of the new authority

**Returns**: Transaction signature

**Example**:
```typescript
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { changeTokenAuthority } from './src/token-authority-config';

const connection = new Connection("https://api.devnet.solana.com");
const payer = Keypair.fromSecretKey(/* payer secret key */);
const tokenAccount = new PublicKey("token-account-address");
const currentAuthority = Keypair.fromSecretKey(/* current authority secret key */);
const newAuthority = new PublicKey("new-authority-address");

const signature = await changeTokenAuthority(
  connection,
  payer,
  tokenAccount,
  currentAuthority,
  newAuthority
);
console.log(`Authority changed: ${signature}`);
```

### checkAccountInfo

Retrieves and displays information about token accounts.

**Parameters**: None (uses hardcoded token addresses)

**Returns**: None (logs account information to console)

**Example**:
```typescript
import { checkAccountInfo } from './src/check-account-info';

// Check information about token accounts
await checkAccountInfo();
```

## Error Handling

All functions include error handling with specific error messages. Common errors include:

- `InvalidAccountData`: The account does not exist or is not a token account
- `TokenAccountNotFoundError`: The specified token account does not exist
- `TokenInvalidMintError`: The token mint is invalid
- `TokenInvalidOwnerError`: The owner of the token account is invalid
- `TokenInsufficientFundsError`: The token account has insufficient funds for the operation

Example of handling errors:
```typescript
try {
  const signature = await transferTokens(/* parameters */);
  console.log(`Transfer complete: ${signature}`);
} catch (error) {
  if (error.message.includes("insufficient funds")) {
    console.error("Not enough tokens to complete the transfer");
  } else if (error.message.includes("InvalidAccountData")) {
    console.error("One of the accounts is invalid");
  } else {
    console.error(`Error: ${error.message}`);
  }
}
```

## Conclusion

This API reference provides the essential functions for interacting with MOTO PROTOCOL tokens on the Solana blockchain. For more detailed examples and use cases, refer to the [examples directory](https://github.com/MOTOPROTOCOL/MOTOPROTOCOL_Journey/tree/main/docs/examples) in the repository.
