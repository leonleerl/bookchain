"use client";

import { useCartStore, CartItem } from "../store/cartStore";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useSession } from "next-auth/react";
import { CONTRACT_ADDRESS, BOOKSTORE_ABI, formatEther, parseEther } from "../lib/contract";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [purchasing, setPurchasing] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!session) {
      alert("Please login first");
      router.push("/");
      return;
    }

    if (!isConnected || !address) {
      alert("Please connect your wallet");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setPurchasing(true);

    try {
      // Purchase each book
      for (const item of items) {
        const totalPrice = BigInt(item.price) * BigInt(item.quantity);
        
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: BOOKSTORE_ABI,
          functionName: "purchaseBook",
          args: [BigInt(item.bookId), BigInt(item.quantity)],
          value: totalPrice,
        });
      }

      // Wait for all transactions to complete
      // Note: This is simplified - in production, wait for each transaction confirmation
      clearCart();
      alert("Purchase successful!");
    } catch (error: any) {
      console.error("Purchase failed:", error);
      alert(`Purchase failed: ${error.message || "Unknown error"}`);
    } finally {
      setPurchasing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-400">Cart is empty</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.bookId}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.author}
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatEther(BigInt(item.price))} ETH
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                  className="rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                  className="rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.bookId)}
                className="rounded-md bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">
            {formatEther(totalPrice)} ETH
          </span>
        </div>

        <button
          onClick={handlePurchase}
          disabled={purchasing || isConfirming || !session || !isConnected}
          className="mt-4 w-full rounded-md bg-green-500 px-4 py-3 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {purchasing || isConfirming
            ? "Processing..."
            : !session
            ? "Please Login"
            : !isConnected
            ? "Please Connect Wallet"
            : "Purchase"}
        </button>

        {isSuccess && (
          <p className="mt-2 text-center text-sm text-green-600">
            Transaction successful! Hash: {hash?.slice(0, 10)}...
          </p>
        )}
      </div>
    </div>
  );
}

