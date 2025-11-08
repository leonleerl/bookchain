import { network } from "hardhat";

async function main() {
  // Connect to network and get viem instance
  // According to Hardhat 3 docs: https://hardhat.org/docs/guides/using-viem
  const connection = await network.connect();
  const { viem } = connection as { viem: any };

  // Get wallet clients (one for each account in Hardhat config)
  const [walletClient] = await viem.getWalletClients();
  console.log("Deploying contracts with account:", walletClient.account.address);

  // Deploy contract - deployContract waits until the contract is deployed
  const bookStore = await viem.deployContract("BookStore", []);

  console.log("BookStore deployed to:", bookStore.address);
  
  // Get public client to check transaction status
  const publicClient = await viem.getPublicClient();
  
  // Get deployment transaction hash
  const deploymentTx = bookStore.deploymentTransaction();
  if (deploymentTx?.hash) {
    const deploymentReceipt = await publicClient.waitForTransactionReceipt({
      hash: deploymentTx.hash,
    });
    console.log("Deployment transaction:", deploymentReceipt.transactionHash);
  }

  console.log("\nPlease add the following address to your .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${bookStore.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

