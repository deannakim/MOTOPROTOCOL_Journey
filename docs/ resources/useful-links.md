# Useful Resources & Links

A curated collection of resources, tools, and documentation used during the MOTO PROTOCOL SPL Token Project development process, from environment setup to token automation as of March 4, 2025.

## Official Documentation

### Solana
- [Solana Docs](https://docs.solana.com/)
  - Core blockchain concepts and CLI tools (e.g., `solana balance` for debugging).
  - Network setup guides for Devnet testing.

- [Solana RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints)
  - Official RPC URLs (e.g., `https://api.devnet.solana.com`) and alternatives.
  - Used for switching endpoints during "fetch failed" errors.

### Metaplex
- [Metaplex Token Metadata Overview](https://docs.metaplex.com/programs/token-metadata/overview)
  - Standards for SPL token metadata (e.g., `fetchMetadata`, `nfts().create`).
  - Key for resolving `NotEnoughBytesError` and API compatibility issues.

### SPL Token
- [SPL Token Program](https://spl.solana.com/token)
  - Token creation (`createMint`), transfers, and account management.
  - Core reference for `check-balance.ts` and `transfer-tokens.ts`.

## Development Tools & Libraries

### Node.js & Package Management
- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
  - Managed Node.js v16.20.0 for compatibility (e.g., resolved build failures on 2025-02-25).
  - Installation: `nvm install 16.20.0`.

- [PNPM Documentation](https://pnpm.io/)
  - Used PNPM 7.x with Node.js 16 for efficient dependency management.
  - Fixed workspace protocol errors during setup.

### Coding Environment
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - Essential for strict typing fixes (e.g., PublicKey mismatches in `check-balance.ts`).
  - Configured via `tsconfig.json` for `src/` and `dist/`.

- [VS Code](https://code.visualstudio.com/)
  - JSON validation and TypeScript debugging (e.g., fixed `EJSONPARSE` on 2025-02-26).
  - Optional: [Solana Extension](https://marketplace.visualstudio.com/items?itemName=solana.solana) for syntax support.

- [Chalk](https://www.npmjs.com/package/chalk)
  - Colored console logging in scripts (e.g., `mint-test-tokens.ts`).
  - Install: `npm install chalk`.

- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
  - JavaScript API for connections, keypairs, and token operations.
  - Used extensively in all scripts (e.g., `Connection` setup).

## Testing & Debugging

### Network Tools
- [Solana Explorer](https://explorer.solana.com/)
  - Verified token info (e.g., `GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h`).
  - Monitored Devnet transactions and network status.

- [Solana CLI](https://docs.solana.com/cli)
  - Commands like `solana balance` and `solana airdrop` for RPC troubleshooting.
  - Example: `solana airdrop 2 <WALLET_PUBLIC_KEY> --url https://rpc.ankr.com/solana_devnet`.

- [Ankr Solana Devnet RPC](https://rpc.ankr.com/solana_devnet)
  - Alternative RPC endpoint to resolve `fetch failed` errors (2025-03-04).

### Testing Frameworks
- [Jest Documentation](https://jestjs.io/)
  - Planned for future comprehensive tests (per "Next Steps" on 2025-03-04).
  - Setup guide for TypeScript integration.

## Community Resources

- [Solana Stack Exchange](https://solana.stackexchange.com/)
  - Q&A for troubleshooting TypeScript and RPC issues.

- [Solana Discord](https://discord.com/invite/solana)
  - Real-time help for API changes and network errors.

- [Solana Cookbook](https://solanacookbook.com/)
  - Practical SPL token examples (e.g., minting, transfers).
  - Reference for script implementations.

- [Metaplex JS Examples](https://github.com/metaplex-foundation/js-examples)
  - Code samples for `keypairIdentity` and metadata handling.

- [MOTO PROTOCOL GitHub (Placeholder)](https://github.com/yourusername/MOTOPROTOCOL_Journey)
  - Hypothetical repo for metadata URI and project code.

## Project-Specific Resources

### Environment Setup
- [Environment Setup Guide](../journey/environment-setup.md)
  - Steps for Node.js, PNPM, and TypeScript configuration.
  - Troubleshooting version conflicts.

### Development Guides
- [Token Creation Guide](../guides/token-creation.md)
  - Minting process with `createMint` and `mintTo`.
  - Common pitfalls (e.g., insufficient SOL).

- [Metadata Setup Guide](../guides/metadata-setup.md)
  - Adding metadata with `nfts().create` (ongoing as of 2025-03-04).
  - Fallback handling for `NotEnoughBytesError`.

- [Config Management Guide](../guides/config-management.md)
  - Centralizing settings in `config.ts` or `.env` (e.g., `TOKEN_ADDRESS` updates).

### Problem Solving
- [Troubleshooting Guide](../guides/troubleshooting.md)
  - Fixes for `fetch failed`, TypeScript errors, and path issues.

- [Debugging Notes](../journey/debugging-notes.md)
  - Detailed log of challenges (e.g., RPC switches, API updates) up to March 4, 2025.

## Additional Utilities

- [JSONLint](https://jsonlint.com/)
  - Online JSON validator for `package.json` fixes (2025-02-26).
  - Alternative: VS Code built-in validation.

- [Solscan](https://solscan.io/)
  - Backup explorer for Devnet token tracking.

## Future Resources

- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)
  - Guidelines for production deployment.

- [Metaplex API Changelog](https://github.com/metaplex-foundation/js/releases)
  - Track updates to avoid compatibility issues (e.g., `TS2345` errors).

---

> **Note:** This list evolves with the project and community input. Last updated: March 4, 2025.
