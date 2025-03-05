# MOTO Protocol Token Creation Guide

## Token Metadata Configuration
```typescript
// This is a test configuration; metadata is optional in the stable workflow
export const TOKEN_METADATA = {
  name: "MOTO Journey Test Token",
  symbol: "MJTEST",
  uri: "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json",
};
```

## Token Creation Function

```typescript
async function createTestToken() {
  try {
    console.log(chalk.cyan("Creating SPL token..."));
    const connection = new Connection(CONFIG.RPC_URL, "confirmed");
    const wallet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(CONFIG.WALLET_FILE, "utf8")))
    );
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    // 1. Create Mint
    const { mint } = await metaplex.tokens().createMint({
      decimals: CONFIG.TOKEN_DECIMALS,
      mintAuthority: wallet.publicKey,
    });

    // 2. Mint Initial Supply
    await metaplex.tokens().mint({
      mintAddress: mint.address,
      amount: { 
        basisPoints: BigInt(CONFIG.MINT_AMOUNT * 10 ** CONFIG.TOKEN_DECIMALS), 
        currency: { 
          decimals: CONFIG.TOKEN_DECIMALS, 
          symbol: TOKEN_METADATA.symbol, 
          namespace: "spl-token" 
        } 
      },
      toOwner: wallet.publicKey,
    });

    // 3. Create Metadata (Optional, under development)
    // Note: Currently, stable token creation may skip this step
    await metaplex.nfts().create({
      uri: TOKEN_METADATA.uri,
      name: TOKEN_METADATA.name,
      symbol: TOKEN_METADATA.symbol,
      sellerFeeBasisPoints: 0,
      mint: mint.address,
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    });

    console.log(chalk.green("✓ Token created!"));
    console.log(`Mint Address: ${chalk.yellow(mint.address.toBase58())}`);
  } catch (error) {
    console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
  }
}
```

## Execution Instructions

### Create Token:
```bash
ts-node src/mint-test-tokens.ts
```

### Verify Token:
```bash
npm run example:info    # Check metadata (if included)
npm run example:balance # Verify balance
```

## Troubleshooting Guide

### Common Issues

1. **Node Version Conflicts:**
   - Fix: `nvm use 16.20.0`

2. **Build Errors:**
   - Fix: Check tsconfig.json paths, reinstall dependencies (pnpm install)

3. **Solana Issues:**
   - Network Errors: Switch to https://rpc.ankr.com/solana_devnet
   - Insufficient Balance: Airdrop SOL
   - Metadata Errors: Check if token was minted with metadata, or expect fallback values

## Best Practices

### Environment Management
- Use Node 16.20.0, PNPM 7.x
- Centralize configs in config.ts

### Security
- Backup my_wallet.json
- Test on Devnet first

### Development Flow
- Automate TOKEN_ADDRESS updates
- Document mint addresses in README

## Next Steps
1. Stabilize metadata integration (in progress)
2. Configure advanced properties (e.g., freeze authority)
3. Deploy to Mainnet
4. Integrate with liquidity pools

## Resources
- [Solana CLI Tools](https://docs.solana.com/cli)
- [SPL Token Program](https://spl.solana.com/token)
- [Metaplex Documentation](https://docs.metaplex.com)

*Note: Refer to ../journey/debugging-notes.md for detailed fixes—e.g., cutting batch times from 644s to 25s!*
