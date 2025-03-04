# Token Metadata Integration Guide - MOTO PROTOCOL

## Metadata Integration Code

### Mint With Metadata Function
```typescript
async function mintWithMetadata() {
  try {
    console.log(chalk.cyan("Creating token with metadata..."));
    const connection = new Connection(CONFIG.RPC_URL, "confirmed");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(CONFIG.WALLET_FILE, "utf8"))));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    // 1. Create Mint
    const { mint } = await metaplex.tokens().createMint({
      decimals: 9,
      mintAuthority: wallet.publicKey
    });

    // 2. Mint Initial Supply
    await metaplex.tokens().mint({
      mintAddress: mint.address,
      amount: { 
        basisPoints: BigInt(1000000 * 10 ** 9), 
        currency: { 
          decimals: 9, 
          symbol: TOKEN_METADATA.symbol, 
          namespace: "spl-token" 
        } 
      },
      toOwner: wallet.publicKey
    });

    // 3. Create Metadata
    const { nft } = await metaplex.nfts().create({
      uri: TOKEN_METADATA.uri,
      name: TOKEN_METADATA.name,
      symbol: TOKEN_METADATA.symbol,
      sellerFeeBasisPoints: 0,
      mint: mint.address,
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet.publicKey
    });

    console.log(chalk.green("✓ Token and metadata created!"));
    console.log(`Mint Address: ${chalk.yellow(mint.address.toBase58())}`);
    console.log(`Metadata: ${JSON.stringify(nft.metadata, null, 2)}`);
  } catch (error) {
    console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
  }
}
```

## Configuration Setup

### Update config/config.ts
```typescript
import * as dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  RPC_URL: process.env.RPC_URL || "https://rpc.ankr.com/solana_devnet",
  WALLET_FILE: process.env.WALLET_FILE || "./docs/examples/basic/my_wallet.json",
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || ""
};
```

## Build and Run Instructions

1. Execute the metadata creation:
```bash
ts-node src/mint-with-metadata.ts
```
*Note: Output includes the mint address—update config.ts manually or automate it (see debugging-notes.md).*

2. Verify metadata:
```bash
npm run example:info
```

## Troubleshooting Guide

### Common Issues

1. **Node Version Conflicts**:
   - Fix: `nvm use 16.20.0`

2. **Network Errors (fetch failed)**:
   - Fix: Use `https://rpc.ankr.com/solana_devnet` in .env

3. **Metadata Errors (NotEnoughBytesError)**:
   - Fix: Ensure token is minted with metadata above

4. **Build Failures**:
   - Fix: Validate tsconfig.json paths and file locations

## Best Practices

### Version Management
- Use Node.js 16.20.0, PNPM 7.x

### Error Handling
- Add try-catch and clear logs (e.g., chalk)

### Automation
- Script config.ts updates post-minting

### Security
- Store keys in .env
- Test on Devnet first

## Resources

- [Solana SPL Token Docs](https://spl.solana.com/token)
- [Metaplex JS SDK](https://docs.metaplex.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

## Next Steps

1. Host metadata JSON online
2. Update metadata dynamically
3. Test on Mainnet

*Note: See ../journey/debugging-notes.md for detailed fixes and my journey optimizing this process.*
