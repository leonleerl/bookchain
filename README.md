# BookChain - Web3 Online Bookstore

A decentralized online bookstore project built with Web3 technologies, developed using Next.js 15, Solidity, Zustand, and Hardhat 3.

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Smart Contracts**: Solidity ^0.8.24
- **Development Tools**: Hardhat 3 + Viem
- **State Management**: Zustand
- **Web3 Interactions**: Wagmi + Viem
- **Authentication**: NextAuth.js (Google OAuth)
- **Test Network**: Sepolia

## Features

1. **Shopping Cart**: Users can add books to cart (no login required)
2. **Favorites**: Users can favorite books (login required)
3. **Purchase & Payment**: Users can purchase books via blockchain (login and wallet connection required)
4. **Google Login**: Authentication using Google OAuth
5. **Wallet Connection**: Support for MetaMask and other Web3 wallets

## Project Structure

```
bookchain/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth authentication routes
│   ├── components/        # React components
│   ├── store/             # Zustand state management
│   ├── lib/               # Utility functions and configuration
│   ├── cart/              # Cart page
│   ├── favorites/         # Favorites page
│   └── page.tsx           # Home page
├── contracts/             # Solidity smart contracts
│   └── BookStore.sol     # Bookstore smart contract
├── scripts/               # Hardhat deployment scripts
│   └── deploy.ts         # Deployment script
├── test/                 # Test files
└── hardhat.config.ts     # Hardhat configuration

```

## Installation and Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env` file (refer to `.env.example`):

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Contract address (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Compile Smart Contracts

```bash
npm run compile
```

### 4. Deploy Smart Contracts to Sepolia

```bash
npm run deploy:sepolia
```

After successful deployment, update the contract address in the `.env` file's `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### 5. Add Initial Book Data

After deploying the contract, you need to add some initial book data via Hardhat console or by writing a script. You can use the provided script:

```bash
npm run add-books
```

This will add 5 sample books to the contract.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### User Flow

1. **Browse Books**: Visit the home page to view all available books
2. **Add to Cart**: Click the "Add to Cart" button (no login required)
3. **Login**: Click the "Login" button to sign in with Google account
4. **Connect Wallet**: Click the "Connect Wallet" button to connect MetaMask or other Web3 wallets
5. **Add Favorites**: After logging in, click the heart icon to favorite books
6. **Purchase Books**: On the cart page, login and connect wallet to purchase books

### Developer Flow

1. **Modify Smart Contract**: Edit `contracts/BookStore.sol`
2. **Recompile**: `npm run compile`
3. **Redeploy**: `npm run deploy:sepolia`
4. **Update Contract Address**: Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` file
5. **Test Features**: Test new features in the browser

## Smart Contract Functions

### BookStore.sol

- `addBook()`: Add new book (owner only)
- `getBook()`: Get book information
- `getAllBookIds()`: Get all book IDs
- `purchaseBook()`: Purchase book
- `addToFavorites()`: Add to favorites
- `removeFromFavorites()`: Remove from favorites
- `getUserFavorites()`: Get user's favorite list
- `getUserPurchases()`: Get user's purchase history

## Important Notes

1. **Test Network**: This project uses Sepolia test network, test ETH is required for transactions
2. **Gas Fees**: All blockchain operations require gas fees
3. **Environment Variables**: Ensure all necessary environment variables are properly configured
4. **Contract Address**: Remember to update frontend environment variables after deploying the contract

## Getting Test ETH

- Sepolia Faucet: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
- Alchemy Sepolia Faucet: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

## License

MIT
