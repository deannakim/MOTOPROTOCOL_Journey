# MOTO PROTOCOL Programs

This document outlines the Solana programs used by MOTO PROTOCOL and how they interact with the token ecosystem.

## Overview

MOTO PROTOCOL leverages standard Solana programs rather than deploying custom on-chain code. This approach provides several advantages:

- **Security**: Using audited, battle-tested programs reduces security risks
- **Compatibility**: Ensures compatibility with the broader Solana ecosystem
- **Efficiency**: Avoids redundancy by utilizing existing on-chain infrastructure

## Core Programs

### SPL Token Program

The SPL Token Program is the foundation of MOTO PROTOCOL's token functionality.

**Program ID**: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

**Key Functions**:
- Token creation and minting
- Token transfers between accounts
- Account creation and management
- Authority management (mint and freeze authorities)

**MOTO Token Details**:
```json
{
  "tokenMint": "6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE",
  "tokenAccount": "HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog",
  "owner": "6P247mnw8bxXHRExiG3zSW6THgUj1KAude9hKRZmHjiD",
  "decimals": 9,
  "totalSupply": "15,000,000,000"
}
```

**Example Interaction**:
```typescript
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from "@solana/spl-token";

async function checkTokenInfo() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const mintAddress = new PublicKey("6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE");
  
  // Fetch token mint information
  const mintInfo = await getMint(connection, mintAddress);
  console.log("Total Supply:", Number(mintInfo.supply) / 1e9);
  console.log("Decimals:", mintInfo.decimals);
  
  // Fetch token account information
  const account = new PublicKey("HunkbMppfzjSMFanXFzm1piNpiu926ciJNYxbDgg3dog");
  const accountInfo = await getAccount(connection, account);
  console.log("Account Balance:", Number(accountInfo.amount) / 1e9);
}
```

### Metaplex Token Metadata Program

The Metaplex Token Metadata Program manages metadata for the MOTO token.

**Program ID**: `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`

**Key Functions**:
- Creating and storing token metadata
- Managing metadata such as name, symbol, and image URI
- Updating token metadata

**Metadata Structure**:
```typescript
{
  name: "MOTO PROTOCOL",
  symbol: "MTP",
  uri: "https://arweave.net/..."  // URI to metadata JSON file
}
```

**Example Interaction**:
```typescript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { 
  findMetadataPda,
  mplTokenMetadata,
  fetchMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

async function checkMetadata() {
  const umi = createUmi("https://api.devnet.solana.com");
  umi.use(mplTokenMetadata());
  
  const mintAddress = "GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h";
  
  // Find metadata PDA
  const [metadataAddress] = findMetadataPda(umi, {
    mint: publicKey(mintAddress)
  });
  
  // Fetch metadata
  const metadata = await fetchMetadata(umi, metadataAddress);
  
  console.log("Name:", metadata.name);
  console.log("Symbol:", metadata.symbol);
  console.log("URI:", metadata.uri);
}
```

## Token Operations

### Token Creation

MOTO PROTOCOL tokens are created using the SPL Token Program's mint functionality:

```typescript
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";

async function createToken() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.fromSecretKey(/* wallet secret key */);
  
  // Create token mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,  // mint authority
    payer.publicKey,  // freeze authority (optional)
    9                 // decimals
  );
  
  // Create token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  
  // Mint tokens
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    15_000_000_000_000_000_000 // 15 billion tokens with 9 decimals
  );
}
```

### Token Transfers

MOTO PROTOCOL implements various token transfer mechanisms:

```typescript
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

async function transferTokens() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.fromSecretKey(/* wallet secret key */);
  const mintAddress = new PublicKey("6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE");
  
  // Source account
  const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAddress,
    payer.publicKey
  );
  
  // Destination account (create if it doesn't exist)
  const destinationWallet = new PublicKey("CLskX6hMUxbAgRXXQ5XojqciN6eSvNjbFJ1Xx5iZbGCX");
  const destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAddress,
    destinationWallet
  );
  
  // Transfer tokens
  const transferAmount = 1000 * 1e9; // 1000 tokens with 9 decimals
  const signature = await transfer(
    connection,
    payer,
    sourceAccount.address,
    destinationAccount.address,
    payer,
    transferAmount
  );
  
  console.log("Transfer complete:", signature);
}
```

### Disabling Minting

For token supply management, MOTO PROTOCOL can permanently disable minting:

```typescript
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { setAuthority, AuthorityType } from "@solana/spl-token";

async function disableMinting() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.fromSecretKey(/* wallet secret key */);
  const mintAddress = new PublicKey("6DytphLb57wEgYyrAUnYFCraYEz3Ljfhi3NGcSpBcTaE");
  
  // Remove mint authority (set to null)
  const result = await setAuthority(
    connection,
    payer,
    mintAddress,
    payer,
    AuthorityType.MintTokens,
    null  // null = permanently remove authority
  );
  
  console.log("Minting disabled:", result);
}
```

### Batch Processing

MOTO PROTOCOL implements a batch processing system to automate various token management tasks. This system provides:

- Sequential or parallel execution of multiple operations
- Filtering operations by category
- Error handling and logging
- Managing dependencies between operations

The batch processing system is implemented in [batch-process.ts](https://github.com/MOTOPROTOCOL/MOTOPROTOCOL_Journey/blob/main/docs/examples/advanced/batch-process.ts).

## Authority Management

MOTO PROTOCOL carefully manages token authorities:

- **Mint Authority**: Controls the ability to mint new tokens
  - Current holder: `6P247mnw8bxXHRExiG3zSW6THgUj1KAude9hKRZmHjiD`
  
- **Freeze Authority**: Controls the ability to freeze token accounts
  - Current holder: `6P247mnw8bxXHRExiG3zSW6THgUj1KAude9hKRZmHjiD`

For production deployments, these authorities may be disabled or transferred to governance mechanisms.

### Changing Account Authority

Example of changing token account ownership:

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { setAuthority, AuthorityType } from '@solana/spl-token';

async function changeTokenAuthority(
  connection: Connection,
  payer: Keypair,
  tokenAccount: PublicKey,
  currentAuthority: Keypair,
  newAuthority: PublicKey
) {
  const signature = await setAuthority(
    connection,
    payer,            // Transaction fee payer
    tokenAccount,     // Token account to change authority for
    currentAuthority, // Current authority holder
    AuthorityType.AccountOwner, // Type of authority to change
    newAuthority     // New authority holder
  );
  
  return signature;
}
```

## Transaction Validation

All token operations include multiple validation steps:

1. Account existence verification
2. Balance checks for transfers
3. Authority validation
4. Error handling with specific error messages

## Testing and Validation

MOTO PROTOCOL has undergone extensive testing on Devnet:

### Test Results Summary

```
- Account Validation Test: ✅ PASSED
  - Valid accounts correctly identified
  - Invalid accounts properly rejected with appropriate errors

- Maximum Transfer Test: ✅ PASSED
  - Transfers exceeding balance rejected with "insufficient funds" error

- Invalid Address Test: ✅ PASSED
  - Transfers to invalid accounts rejected with "InvalidAccountData" error
```

Full test documentation is available in the project repository.

## Conclusion

MOTO PROTOCOL leverages Solana's existing program infrastructure rather than deploying custom on-chain code. This approach provides security, compatibility, and efficiency while still enabling all the functionality required for the token ecosystem.

By building on top of the SPL Token Program and Metaplex Token Metadata Program, MOTO PROTOCOL ensures compatibility with wallets, exchanges, and other Solana ecosystem components while focusing development efforts on creating a robust and user-friendly experience.
