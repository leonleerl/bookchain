"use client";

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, BOOKSTORE_ABI } from "./contract";
import { Address } from "viem";

export function usePurchaseBook() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const purchaseBook = async (bookId: number, quantity: number, value: bigint) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract address not configured");
    }

    return writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: BOOKSTORE_ABI,
      functionName: "purchaseBook",
      args: [BigInt(bookId), BigInt(quantity)],
      value,
    });
  };

  return {
    purchaseBook,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useAddToFavorites() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addToFavorites = async (bookId: number) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract address not configured");
    }

    return writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: BOOKSTORE_ABI,
      functionName: "addToFavorites",
      args: [BigInt(bookId)],
    });
  };

  return {
    addToFavorites,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useRemoveFromFavorites() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const removeFromFavorites = async (bookId: number) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract address not configured");
    }

    return writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: BOOKSTORE_ABI,
      functionName: "removeFromFavorites",
      args: [BigInt(bookId)],
    });
  };

  return {
    removeFromFavorites,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  };
}