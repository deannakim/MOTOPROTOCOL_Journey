# MOTO PROTOCOL SPL Token Project

A Solana-based project for creating, managing, and interacting with SPL tokens, complete with basic metadata support and future DEX integration. Designed with detailed debugging notes to support the developer community.

## 📌 Quick Start

Get up and running in minutes:

1. **Install Prerequisites**: Node.js, npm, TypeScript (`npm install -g ts-node`), and Solana CLI.  

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

5. **Verify Configuration**: Configuration auto-updates; check TOKEN_ADDRESS in config/config.ts.  

6. **Verify**:  
   ```bash
   npm run example:info
   ```

## Features

- **SPL Token Creation**: Generate fungible tokens on Solana Devnet.  
- **Basic Metadata Support**: Attach names, symbols, and URIs (full Metaplex integration planned).  
- **Token Operations**: Check balances, transfer tokens, and more.  
- **Future Plans**: DEX integration and marketing automation tools.

## Installation

### Prerequisites

- **Node.js & npm**: Install the latest LTS version from nodejs.org.  
- **TypeScript**: `npm install -g ts-node`.  
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
   npm install @solana/web3.js @solana/spl-token @metaplex-foundation/mpl-token-metadata @metaplex-foundation/js dotenv chalk
   ```

2. **Configure Environment**: Edit config/config.ts with your wallet (default: docs/examples/basic/my_wallet.json) and token settings.

## Test Environment Setup

### Create a Test Wallet
```bash
solana-keygen new --outfile docs/examples/basic/my_wallet.json
solana airdrop 2 $(solana-keygen pubkey docs/examples/basic/my_wallet.json) --url https://rpc.ankr.com/solana_devnet
```

### Mint Test Tokens
```bash
npm run mint:test-tokens
```
Copy the MINT_ADDRESS from the output; config.ts auto-updates.

## Run Examples

**Check Balance**:  
```bash
npm run example:balance
```

**View Token Info**:  
```bash
npm run example:info
```

**Transfer Tokens**:  
```bash
npm run example:transfer -- D9FChW1G6LnFBnXfVNphoGqsgDGbCaWDRVvNJyEFsFDM 10 GZeQMMzrZdhg2h4CctUFBDGU2mv1R6uJY1LdAGSvpBHp
```

**Batch Process**:  
```bash
npm run batch
```

## Troubleshooting

### Common Issues

1. **"Insufficient Balance"**: "Error: Insufficient balance. You have 0 tokens but tried to send 1."
   - Fix:  
     - Verify token balance: `npm run example:balance`  
     - Ensure TOKEN_ADDRESS matches your minted token.  
     - Request SOL: `solana airdrop 2 <WALLET_ADDRESS> --url https://rpc.ankr.com/solana_devnet`

2. **"Script File Not Found"**:
   - Fix:  
     - Run commands from the project root.  
     - Check paths in docs/examples/.

3. **"Fetch Failed" or Network Errors**:
   - Fix: Edit config/config.ts:  
     ```typescript
     RPC_URL: "https://rpc.ankr.com/solana_devnet",
     ```

4. **"Metadata Not Found"**:
   - Fix: Run mint:test-tokens with metadata support or use a pre-metadata token.

### Best Practices
- Use a dedicated test wallet for development.  
- Test with small amounts before scaling.

## Documentation

- **Guides**: docs/guides/token-creation.md, docs/guides/metadata-setup.md  
- **Technical**: technical/architecture.md, technical/api-reference.md

## Testing

Run tests with Jest (planned):  
```bash
npm test
```

## Contributing

Contributions are not currently accepted. For inquiries, contact the MOTO PROTOCOL team.

## License

MIT License Copyright (c) 2024 MOTO PROTOCOL

See full MIT License (#mit-license) below.

### Third-Party Licenses
- @solana/web3.js: Apache-2.0  
- @solana/spl-token: Apache-2.0  
- @metaplex-foundation/mpl-token-metadata: Apache-2.0

## Notes
- For commercial use, contact the MOTO PROTOCOL team.  
- Test tokens have no real value; use on Devnet only.

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

