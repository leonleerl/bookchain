import { network } from "hardhat";

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!contractAddress) {
        throw new Error("Please set CONTRACT_ADDRESS or NEXT_PUBLIC_CONTRACT_ADDRESS environment variable");
    }

    const bookId = 4;
    const newStock = 145;

    const connection = await network.connect();
    const { viem } = connection as { viem: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

    // const [walletClient] = await viem.getWalletClients();

    const bookStore = await viem.getContractAt("BookStore", contractAddress as `0x${string}`);

    const currentBook = await bookStore.read.getBook([BigInt(bookId)]);
    console.log(`Current book info:`);
    console.log(`  Title: ${currentBook.title}`);
    console.log(`  Author: ${currentBook.author}`);
    console.log(`  Current Stock: ${currentBook.stock}`);

    console.log(`Updating stock for book ${currentBook.id}, name ${currentBook.title} to ${newStock}...`);

    const hash = await bookStore.write.updateBookStock([BigInt(bookId), BigInt(newStock)]);
    console.log(`Transaction hash: ${hash}`);

    // wait for transaction to be mined
    const publicClient = await viem.getPublicClient();
    await publicClient.waitForTransactionReceipt({ hash });

    // verify the updated stock
    const updatedBook = await bookStore.read.getBook([BigInt(bookId)]);
    console.log(`\n✓ Stock updated successfully!`);
    console.log(`  New Stock: ${updatedBook.stock}`);
}

main()
    .then(() => process.exit(0))    
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });