 # MOTO PROTOCOL SPL Token Project

[![Node.js](https://img.shields.io/badge/Node.js-16.20.0-green)](https://nodejs.org/)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-blue)](https://solana.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue)](https://www.typescriptlang.org/)

A Solana-based project for creating and managing SPL tokens on Devnet, with basic metadata support in progress. Built with detailed debugging notes to empower the developer community—perfect for learning and experimentation.

---

##  Quick Start

Get started in minutes:

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/yourusername/MOTOPROTOCOL_Journey.git
   cd MOTOPROTOCOL_Journey
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Wallet**:
   ```bash
   solana-keygen new --outfile docs/examples/basic/my_wallet.json

   solana airdrop 2 $(solana-keygen pubkey docs/examples/basic/my_wallet.json) --url https://rpc.ankr.com/solana_devnet
   ```

4. **Mint a Test Token**:
   ```bash
   npm run mint:test-tokens
   ```

5. **Verify**:
   ```bash
   npm run example:info    # Check token details
   npm run example:balance # See wallet balance
   ```

## Features

- SPL Token Creation: Generate fungible tokens on Solana Devnet.
- Metadata Support: Basic metadata (name, symbol, URI) in development via Metaplex.
- Token Operations: Balance checks, transfers, and batch processing.
- Future Goals: Full metadata stability, DEX integration.

## Tech Stack

- Blockchain: Solana Devnet
- Token Standard: SPL Token
- Metadata: Metaplex (in progress)
- Language: TypeScript
- Runtime: Node.js 16.20.0
- Dependencies: @solana/web3.js, @solana/spl-token, @metaplex-foundation/js, chalk, dotenv

## Screenshots

- **Token Minting & Transfer**: [Mint Success](/.github/images/setup/17-mint-transfer-success.png)  
  *Successful token creation and transfer output.*
- **Balance & Info Check**: [Token Info Fixed](/.github/images/setup/15-fixed-output.png)  
  *Token details with metadata fallback after fixing `NotEnoughBytesError`.*
- **Debugging Example**: [JSON Parse Error](/.github/images/setup/06-json-parse-error.png)  
  *Common setup issue from early debugging.*
- **TypeScript Fix**: [TS Compilation Fix](/.github/images/setup/13-typescript-fix.png)  
  *Resolved TypeScript errors in `check-balance.ts`.*
## Installation

### Prerequisites

- Node.js: v16.20.0 (nvm use 16.20.0)
- TypeScript: npm install -g ts-node
- Solana CLI: Install Guide
  ```bash
  solana --version  # Verify
  ```

### Setup

- Install dependencies:
  ```bash
  npm install
  ```
- Configure config/config.ts with wallet path and RPC URL (e.g., https://rpc.ankr.com/solana_devnet).

## Run Examples

- Mint Token: npm run mint:test-tokens
- Check Balance: npm run example:balance
- View Token Info: npm run example:info
- Transfer Tokens: npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT>
- Batch Process: npm run batch

## Troubleshooting

- "Insufficient Balance": Airdrop SOL: solana airdrop 2 <WALLET_ADDRESS> --url https://rpc.ankr.com/solana_devnet
- "Fetch Failed": Update RPC_URL in config.ts to https://rpc.ankr.com/solana_devnet
- "Metadata Not Found": Metadata is optional; check ../journey/debugging-notes.md for progress
- Full guide: Troubleshooting (docs/guides/troubleshooting.md)

## Documentation

- Guides: [Token Creation](docs/guides/token-creation.md), [Troubleshooting](docs/guides/troubleshooting.md)
- Technical: [Architecture](docs/technical/architecture.md), [API Reference](docs/technical/api-reference.md)
- Debugging: [Notes](docs/journey/debugging-notes.md)

## Testing

Tests with Jest are planned:
```bash
npm test  # Coming soon
```

## Contributing

Contributions are not currently accepted. Contact the MOTO PROTOCOL team for inquiries.

## License

MIT License © 2025 MOTO PROTOCOL. See LICENSE for details.

### Third-Party Licenses:
- @solana/web3.js: Apache-2.0
- @solana/spl-token: Apache-2.0
- @metaplex-foundation/js: Apache-2.0

## Notes

Test tokens have no real value; use on Devnet only.

For commercial use, reach out to the MOTO PROTOCOL team.

Happy coding! Check out the debugging journey for tips and tricks!
