# Quick Start Guide

## Prerequisites

1. Node.js 18+ and npm
2. MetaMask or other Web3 wallet
3. Google Cloud Console account (for OAuth)
4. Sepolia testnet ETH (for paying gas fees)

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 2: Configure Environment Variables

Create a `.env` file:

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string (you can use: openssl rand -base64 32)

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Contract address (fill after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

### Get Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env` file

## Step 3: Compile Smart Contracts

```bash
npm run compile
```

## Step 4: Deploy Smart Contracts to Sepolia

```bash
npm run deploy:sepolia
```

After successful deployment, copy the contract address to `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env` file.

## Step 5: Add Sample Books

```bash
npm run add-books
```

This will add 5 sample books to the contract.

## Step 6: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 7: Test Features

1. **Browse Books**: View all available books on the home page
2. **Add to Cart**: Click "Add to Cart" (no login required)
3. **Login**: Click "Login" button to sign in with Google account
4. **Connect Wallet**: Click "Connect Wallet" button to connect MetaMask
5. **Add Favorites**: After logging in and connecting wallet, click the heart icon to favorite books
6. **Purchase Books**: Complete purchase on the cart page

## Troubleshooting

### 1. Contract Deployment Failed

- Ensure `PRIVATE_KEY` is set in `.env` file
- Ensure account has sufficient Sepolia ETH to pay gas fees
- Check network connection and RPC URL

### 2. Frontend Cannot Connect to Contract

- Ensure `NEXT_PUBLIC_CONTRACT_ADDRESS` is correctly set
- Ensure contract is successfully deployed to Sepolia
- Check browser console for errors

### 3. Google Login Failed

- Check if Google OAuth credentials are correct
- Ensure redirect URI is properly configured
- Check if `NEXTAUTH_SECRET` is set

### 4. Wallet Connection Failed

- Ensure MetaMask or other Web3 wallet is installed
- Ensure wallet is switched to Sepolia test network
- Check browser console for errors

## Getting Test ETH

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

## Next Steps

- Read the full [README.md](./README.md) to understand the project structure
- Modify smart contracts to add new features
- Customize frontend UI
- Add more test cases
