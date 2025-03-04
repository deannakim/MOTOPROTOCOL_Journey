# MOTO PROTOCOL Programs

This document outlines the Solana programs used by MOTO PROTOCOL and how they interact with the token ecosystem.

## Overview
MOTO PROTOCOL leverages standard Solana programs rather than deploying custom on-chain code. This approach offers:

- **Security:** Uses audited, widely-tested programs to minimize risks
- **Compatibility:** Ensures integration with the Solana ecosystem
- **Efficiency:** Builds on existing infrastructure to avoid redundancy

## Core Programs

### SPL Token Program
The SPL Token Program underpins MOTO PROTOCOL's token functionality.

- **Program ID:** `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- **Key Functions:**
  - Token creation and minting
  - Token transfers between accounts
  - Account creation and management
  - Authority management (mint and freeze)

#### MOTO Token Details (Dynamic Example):
```json
{
  "tokenMint": "<Dynamically generated>",
  "tokenAccount": "<Generated per wallet>",
  "owner": "<Wallet public key>",
  "decimals": 9,
  "totalSupply": "<Configurable, e.g., 1,000,000 for testing>"
}
```

#### Example Interaction:
```typescript
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from "@solana/spl-token";
import { CONFIG } from "../config/config";

async function checkTokenInfo() {
  const connection = new Connection(CONFIG.RPC_URL, "confirmed");
  const mintAddress = new PublicKey(CONFIG.TOKEN_ADDRESS);

  const mintInfo = await getMint(connection, mintAddress);
  console.log("Total Supply:", Number(mintInfo.supply) / 1e9);
  console.log("Decimals:", mintInfo.decimals);

  const account = new PublicKey("<Token Account Address>");
  const accountInfo = await getAccount(connection, account);
  console.log("Account Balance:", Number(accountInfo.amount) / 1e9);
}
```

### Metaplex Token Metadata Program
Manages metadata for MOTO tokens, still under active development as of March 4, 2025.

- **Program ID:** `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`
- **Key Functions:**
  - Creating and storing token metadata
  - Managing metadata (name, symbol, URI)
  - Updating metadata

#### Metadata Structure (Test Example):
```json
{
  "name": "MOTO Journey Test Token",
  "symbol": "MJTEST",
  "uri": "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json"
}
```

#### Example Interaction:
```typescript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findMetadataPda, mplTokenMetadata, fetchMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { CONFIG } from "../config/config";

async function checkMetadata() {
  const umi = createUmi(CONFIG.RPC_URL).use(mplTokenMetadata());
  const mintAddress = publicKey(CONFIG.TOKEN_ADDRESS);

  const [metadataAddress] = findMetadataPda(umi, { mint: mintAddress });
  const metadata = await fetchMetadata(umi, metadataAddress).catch(() => ({
    name: "Unknown",
    symbol: "N/A",
    uri: ""
  }));

  console.log("Name:", metadata.name);
  console.log("Symbol:", metadata.symbol);
  console.log("URI:", metadata.uri);
}
```

## Token Operations

### Token Creation
```typescript
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { CONFIG } from "../config/config";

async function createToken() {
  const connection = new Connection(CONFIG.RPC_URL, "confirmed");
  const payer = Keypair.fromSecretKey(/* wallet secret key */);

  const mint = await createMint(connection, payer, payer.publicKey, null, 9);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, 
    payer, 
    mint, 
    payer.publicKey
  );
  
  await mintTo(
    connection, 
    payer, 
    mint, 
    tokenAccount.address, 
    payer, 
    BigInt(CONFIG.MINT_AMOUNT * 1e9)
  );

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
  await metaplex.nfts().create({
    uri: "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json",
    name: "MOTO Journey Test Token",
    symbol: "MJTEST",
    sellerFeeBasisPoints: 0,
    mint: mint,
    tokenOwner: payer.publicKey,
    updateAuthority: payer.publicKey
  });
}
```

### Token Transfers
```typescript
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { CONFIG } from "../config/config";

async function transferTokens() {
  const connection = new Connection(CONFIG.RPC_URL, "confirmed");
  const payer = Keypair.fromSecretKey(/* wallet secret key */);
  const mintAddress = new PublicKey(CONFIG.TOKEN_ADDRESS);

  const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection, 
    payer, 
    mintAddress, 
    payer.publicKey
  );
  
  const destinationWallet = new PublicKey("<Recipient Address>");
  const destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection, 
    payer, 
    mintAddress, 
    destinationWallet
  );

  const transferAmount = 1000 * 1e9;
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

## Authority Management
- **Mint Authority:** Configurable, typically the wallet's public key
- **Freeze Authority:** Optional, often null or same as mint authority

## Transaction Validation
Includes:
- Account existence checks
- Balance verification
- Authority confirmation
- Detailed error logging

## Testing and Validation
Status: Ongoing as of March 4, 2025

### Planned Tests:
- Account validation
- Transfer limits
- Invalid address handling

## Conclusion
MOTO PROTOCOL builds on the SPL Token Program and Metaplex Token Metadata Program for a secure, compatible token ecosystem. While metadata integration remains in progress, the focus on off-chain automation and robust documentation ensures a user-friendly experience compatible with Solana's broader infrastructure.
