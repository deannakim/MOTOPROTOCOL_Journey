# MOTO PROTOCOL SPL Token Project

A Solana-based project for creating, managing, and interacting with SPL tokens, complete with metadata support and future DEX integration.

## 📌 Quick Start

Get up and running in minutes:

1. **Install Prerequisites**: Node.js, npm, and Solana CLI.
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/MOTOPROTOCOL_Journey.git
   cd MOTOPROTOCOL_Journey
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Test Token**:
   ```bash
   npm run mint:test-tokens
   ```
5. **Update Configuration**: Add the generated MINT_ADDRESS to config/config.ts.
6. **Verify**:
   ```bash
   npm run example:info
   ```

## Features
- **SPL Token Creation**: Generate fungible tokens on Solana Devnet.
- **Metadata Management**: Attach names, symbols, and URIs to your tokens.
- **Token Operations**: Check balances, transfer tokens, and batch process tasks.
- **Future Plans**: DEX integration and marketing automation tools.

## Installation

### Prerequisites
- **Node.js & npm**: Install the latest LTS version from nodejs.org.
- **Solana CLI**: For wallet management and Devnet interactions.

  Verify installation:
  ```bash
  solana --version
  ```

  If not installed:
  
  **Windows**:
  ```powershell
  curl https://release.solana.com/stable/install -o solana-install.ps1
  powershell -ExecutionPolicy Bypass -File solana-install.ps1
  $env:Path += ";C:\Users\<YourUsername>\.local\share\solana\install\active_release\bin"
  setx PATH "$env:Path" /M
  ```
  
  **MacOS/Linux**:
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
  export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
  ```

  Confirm:
  ```bash
  solana --version
  ```

### Setup
1. **Install Project Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Edit config/config.ts with your wallet and token settings (default uses test-wallet.json).

## Test Environment Setup

1. **Create a Test Wallet**
   ```bash
   solana-keygen new --outfile test-wallet.json
   solana airdrop 2 $(solana-keygen pubkey test-wallet.json) --url https://rpc.ankr.com/solana_devnet
   ```

2. **Mint Test Tokens**
   ```bash
   npm run mint:test-tokens
   ```
   Copy the MINT_ADDRESS from the output.

3. **Update Configuration**
   Open config/config.ts and set:
   ```ts
   TOKEN_ADDRESS: "<your-MINT_ADDRESS>",
   ```

4. **Run Examples**
   - Check Balance:
     ```bash
     npm run example:balance
     ```
   - View Token Info:
     ```bash
     npm run example:info
     ```
   - Transfer Tokens:
     ```bash
     npm run example:transfer -- <AMOUNT> <RECIPIENT_ADDRESS>
     ```
   - Batch Process:
     ```bash
     npm run batch
     ```

## Troubleshooting

### Common Issues
- **"Insufficient Balance"**:
  Error: Insufficient balance. You have 0 tokens but tried to send 1.

  Fix:
  - Verify token balance: `npm run example:balance`
  - Ensure TOKEN_ADDRESS in config.ts matches your minted token.
  - Request more SOL: `solana airdrop 2 <WALLET_ADDRESS> --url https://rpc.ankr.com/solana_devnet`

- **"Script File Not Found"**:
  Fix:
  - Run commands from the project root.
  - Check file paths in docs/examples/.

- **"Fetch Failed" or Network Errors**:
  Fix:
  - Update config.ts:
    ```ts
    RPC_URL: "https://rpc.ankr.com/solana_devnet",
    ```

### Best Practices
- Use a dedicated test wallet for development.
- Test with small amounts before scaling.
- Enable logging for debugging (disable with --no-log).

## Documentation

### Guides:  
- [Token Creation](./docs/guides/token-creation.md)  
- [Metadata Setup](./docs/guides/metadata-setup.md)  

### Technical:  
- [Architecture](./docs/technical/architecture.md)  
- [API Reference](./docs/technical/api-reference.md)

## Testing
Run tests with Jest:
```bash
npm test
```

## Contributing
Contributions are not currently accepted. For inquiries, contact the MOTO PROTOCOL team.

## License
MIT License
Copyright (c) 2024 MOTO PROTOCOL

See full MIT License below.

### Third-Party Licenses
- @solana/web3.js: Apache-2.0
- @solana/spl-token: Apache-2.0
- @metaplex-foundation/mpl-token-metadata: Apache-2.0

### Notes
- For commercial use, contact the MOTO PROTOCOL team.
- Test tokens have no real value; use on Devnet only.

## MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
