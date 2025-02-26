# MOTO PROTOCOL SPL Token Project

## 📌 Quick Start
- **Installation requirements:** Node.js, npm, Solana CLI, etc.
- **Basic setup commands:** Environment configuration, token creation, and metadata setup.
- **Quick usage example:** Running basic commands to create and list your SPL token.

## 🎯 Features
- SPL Token Creation
- Metadata Management
- DEX Listing
- [Future] Marketing Automation
// ... existing code ...

## 🛠 Installation
- **Prerequisites:** Node.js (latest LTS), npm, and Solana CLI.
- **Step-by-step installation:** See [Setup Guide](./docs/setup-guide.md).

## 🧪 Test Environment Setup
1. **Create Test Wallet**
   ```bash
   # Create a new test wallet
   solana-keygen new --outfile test-wallet.json

   # Get SOL from Devnet faucet
   solana airdrop 1 $(solana-keygen pubkey test-wallet.json) --url devnet
   ```

2. **Environment Configuration**
   ```bash
   # Create .env file in project root
   RPC_URL=https://api.devnet.solana.com
   WALLET_FILE=./test-wallet.json
   ```

3. **Run Examples**
   ```bash
   # Check wallet balance
   npm run example:balance

   # Get token info
   npm run example:info

   # Transfer tokens (requires recipient address)
   npm run example:transfer
   ```

4. **Security Notes**
   - Add `test-wallet.json` and `.env` to `.gitignore`
   - Never use production wallets for testing
   - Keep your test wallet's private key secure

## 📖 Documentation

Detailed documentation can be found in the [docs](./docs) directory:
- **Guides:**
  - [Token Creation Guide](./docs/guides/token-creation.md)
  - [Metadata Setup](./docs/guides/metadata-setup.md)
  - [DEX Listing Guide](./docs/guides/dex-listing.md)
- **Technical:**
  - [Architecture](./docs/technical/architecture.md)
  - [API Reference](./docs/technical/api-reference.md)
- **Troubleshooting:** [Troubleshooting](./docs/troubleshooting.md)
- **FAQ:** [FAQ](./docs/faq.md) *(new)*

## 📝 Testing
Tests are run using Jest. For details, see [Testing Guidelines](./docs/guides/testing-guidelines.md).

## 📊 Roadmap
Future updates and plans are outlined in [Roadmap](./docs/roadmap.md).

## 📝 Contribution
*Contributions are currently not accepted.*

## 📝 License
[License information]

