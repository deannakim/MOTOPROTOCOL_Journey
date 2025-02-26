# MOTO PROTOCOL SPL Token Project

## 📌 Quick Start
### Environment Setup
Check required tools:
node -v  # Node.js LTS version
npm -v   # npm version
solana -v # Solana CLI

Project setup:
git clone https://github.com/MOTOPROTOCOL/MOTOPROTOCOL_Journey.git
cd MOTOPROTOCOL_Journey
npm install

### Test Wallet Setup (for development)
# Create test wallet for Devnet (NEVER commit to GitHub!)
solana-keygen new --outfile test-wallet.json

# Get Devnet SOL
solana airdrop 1 [YOUR_WALLET_ADDRESS] --url devnet

### Quick Usage Example
# View token info and transfer tokens
npm run example:info
npm run example:transfer

## 🎯 Features
- SPL Token Creation & Management
- Metadata Configuration
- DEX Listing
- [Future] Marketing Automation

## 🛠 Installation
- Prerequisites: Node.js (LTS), npm, Solana CLI
- Step-by-Step: Detailed instructions in [Setup Guide](docs/journey/environment-setup.md)

## 📖 Documentation
### DevRel Journey
- [Environment Setup Story](docs/journey/environment-setup.md)
- [Debugging Notes](docs/journey/debugging-notes.md)
- [Lessons Learned](docs/journey/lessons-learned.md)

### User Guides
- [Token Creation Guide](docs/guides/token-creation.md)
- [Metadata Setup](docs/guides/metadata-setup.md)
- [Troubleshooting Guide](docs/guides/troubleshooting.md)

### Technical Documentation
- [Architecture Design](./technical/architecture.md)
- [API Reference](./technical/api-reference.md)
- [Development Log](./technical/process-log.md)
- [Solana Programs Documentation](./technical/programs.md)

## 💻 Examples
Run basic examples:
# Check balance
npm run example:balance
# View token info
npm run example:info
# Transfer tokens
npm run example:transfer

## ⚠️ Security Notes
- NEVER commit private keys or wallet files to GitHub
- Add to your .gitignore:
  *.json
  !package.json
  !package-lock.json
  .env

## 🛠 Development Environment
- Node.js (LTS)
- npm
- Solana CLI
- TypeScript
- Jest (Testing)

## 🤝 Contributing
External contributions are currently not accepted.

## 📝 License
MIT License - Feel free to use this code for any purpose, including commercial use, modification, and distribution. Just keep the license notice intact.
