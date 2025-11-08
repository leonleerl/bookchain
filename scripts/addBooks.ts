import { network } from "hardhat";
import { parseEther } from "viem";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS or NEXT_PUBLIC_CONTRACT_ADDRESS environment variable");
  }

  // Connect to network and get viem instance
  // According to Hardhat 3 docs: https://hardhat.org/docs/guides/using-viem
  const connection = await network.connect();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { viem } = connection as { viem: any };

  // Get wallet clients
  const [walletClient] = await viem.getWalletClients();
  console.log("Using account:", walletClient.account.address);
  
  // Get contract instance at the deployed address
  const bookStore = await viem.getContractAt("BookStore", contractAddress as `0x${string}`);

  console.log("Adding sample books...");

  // Add sample books
  const books = [
    {
      title: "Web3 Development Guide",
      author: "John Doe",
      price: parseEther("0.01"), // 0.01 ETH
      stock: BigInt(100),
    },
    {
      title: "Solidity Smart Contract Programming",
      author: "Jane Smith",
      price: parseEther("0.015"), // 0.015 ETH
      stock: BigInt(50),
    },
    {
      title: "Ethereum Development in Practice",
      author: "Bob Johnson",
      price: parseEther("0.02"), // 0.02 ETH
      stock: BigInt(75),
    },
    {
      title: "DeFi Protocol Development",
      author: "Alice Williams",
      price: parseEther("0.025"), // 0.025 ETH
      stock: BigInt(30),
    },
    {
      title: "Complete Guide to NFT Development",
      author: "Charlie Brown",
      price: parseEther("0.03"), // 0.03 ETH
      stock: BigInt(40),
    },
  ];

  for (const book of books) {
    try {
      const hash = await bookStore.write.addBook([
        book.title,
        book.author,
        book.price,
        book.stock,
      ]);
      
      console.log(`Adding book "${book.title}" - Transaction hash: ${hash}`);
      
      // Wait for transaction confirmation
      const publicClient = await viem.getPublicClient();
      await publicClient.waitForTransactionReceipt({ hash });
      
      console.log(`✓ "${book.title}" added successfully`);
    } catch (error) {
      console.error(`Failed to add book "${book.title}":`, error);
    }
  }

  console.log("\nAll books added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

