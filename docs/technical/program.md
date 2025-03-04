# MOTO PROTOCOL Programs

## Overview
MOTO PROTOCOL utilizes standard Solana programs rather than deploying custom on-chain code. This strategy enhances:
- Security through audited, widely-tested programs
- Compatibility with the Solana ecosystem
- Efficiency by building on existing infrastructure

## Core Programs

### SPL Token Program
- **Program ID:** `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- **Functions:**
  - Token creation and minting
  - Token transfers
  - Account management
  - Authority management

### Metaplex Token Metadata Program
- **Program ID:** `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`
- **Functions:**
  - Metadata creation and storage
  - Metadata updates
  - URI management

## Example Interactions

### Check Token Information
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

### Check Metadata
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

## Authority Management
- **Mint Authority:** Typically the wallet's public key
- **Freeze Authority:** Optional, often null or same as mint authority

## Transaction Validation
- Account existence checks
- Balance verification
- Authority confirmation
- Detailed error logging

## Testing & Validation
Status: Ongoing as of March 4, 2025
- Account validation
- Transfer limits
- Invalid address handling

## Conclusion
MOTO PROTOCOL builds on Solana's core programs for a secure, compatible token ecosystem. While metadata integration continues, the focus remains on robust implementation and documentation.
