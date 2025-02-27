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

2. **Create & Setup Test Tokens**
   ```bash
   # Create and mint test tokens
   npm run mint:test-tokens

   # Verify token creation and balance
   npm run example:balance

   # Check token information
   npm run example:info
   ```

3. **Run Batch Process**
   ```bash
   # Basic sequential execution
   npm run batch

   # With options
   npm run batch -- --parallel         # Run in parallel
   npm run batch -- --task=transfer    # Run specific task
   npm run batch -- --continue-on-error # Continue on errors
   ```

4. **Troubleshooting**
   - If token balance is 0:
     ```bash
     # Mint new test tokens first
     npm run mint:test-tokens
     
     # Verify the balance
     npm run example:balance
     ```
   - If transfer fails:
     - Check SOL balance for fees
     - Verify token balance is sufficient
     - Ensure correct token address is used

5. **Security Notes**
   - Add `test-wallet.json` and `.env` to `.gitignore`
   - Never use production wallets for testing
   - Keep your test wallet's private key secure
   - Test tokens have no real value and are for testing only
// ... existing code ...

## 🔧 Troubleshooting

### Common Issues

1. **Token Transfer Issues**
   ```bash
   Error: Insufficient balance. You have 0 tokens but tried to send 1.
   ```
   **Solution:**
   - Check if your wallet has enough tokens
   - Verify the token address is correct
   - Make sure you're using the right wallet file
   ```bash
   # Verify token balance first
   npm run example:balance
   
   # Then try transfer with correct parameters
   npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT>
   ```

2. **Script Path Errors**
   ```bash
   Script file not found: <filepath>
   ```
   **Solution:**
   - Verify all example scripts are in the correct directory
   - Check file permissions
   - Make sure you're running from project root

3. **Environment Setup**
   - Always use test wallet for development
   - Keep test tokens separate from production
   - Use Devnet for testing

### Best Practices
1. Always check balances before transfers
2. Use `--continue-on-error` flag for batch operations
3. Test with small amounts first
4. Keep logs for debugging (`--no-log` disables logging)

For more detailed troubleshooting, see [Troubleshooting Guide](./docs/troubleshooting.md)

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
