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

// ... existing code ...

## 🧪 Test Environment Setup
1. **Create Test Wallets**
   ```bash
   # Create a new test wallet
   solana-keygen new --outfile test-wallet.json

   # Get SOL from Devnet faucet
   solana airdrop 1 $(solana-keygen pubkey test-wallet.json) --url devnet
   ```

2. **Create Test Tokens**
   ```bash
   # Create and mint test tokens
   npm run mint:test-tokens

   # Save the output addresses:
   # MINT_ADDRESS=<your-token-mint-address>
   # TOKEN_ACCOUNT=<your-token-account-address>
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in project root
   RPC_URL=https://api.devnet.solana.com
   WALLET_FILE=./test-wallet.json
   ```

4. **Run Examples**
   ```bash
   # Basic examples
   npm run example:balance    # Check wallet balance
   npm run example:info      # Get token info
   npm run example:transfer  # Transfer tokens

   # Advanced examples
   npm run batch            # Run batch processing
   ```

5. **Security Notes**
   - Add `test-wallet.json` and `.env` to `.gitignore`
   - Never use production wallets for testing
   - Keep your test wallet's private key secure
   - Test tokens have no real value and are for testing only


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

## 📝 License Information

### MIT License

Copyright (c) 2024 MOTO PROTOCOL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### Third-Party Licenses

This project includes the following third-party software:

- **@solana/web3.js**: [Apache-2.0](https://github.com/solana-labs/solana-web3.js/blob/master/LICENSE)
- **@solana/spl-token**: [Apache-2.0](https://github.com/solana-labs/solana-program-library/blob/master/LICENSE)
- **@metaplex-foundation/mpl-token-metadata**: [Apache-2.0](https://github.com/metaplex-foundation/mpl-token-metadata/blob/master/LICENSE)

For detailed license information of dependencies, please see the respective project repositories.

### Note

- This software is part of the MOTO PROTOCOL project
- For commercial use, please contact the MOTO PROTOCOL team
- Test tokens created using this software have no real value
- Use at your own risk on Devnet only
