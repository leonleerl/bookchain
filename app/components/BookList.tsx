"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { publicClient, CONTRACT_ADDRESS, BOOKSTORE_ABI } from "../lib/contract";
import BookCard from "./BookCard";

interface Book {
  id: number;
  title: string;
  author: string;
  price: bigint;
  stock: bigint;
  exists: boolean;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      if (!CONTRACT_ADDRESS) {
        console.error("Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file");
        setLoading(false);
        return;
      }

      // Get all book IDs
      const bookIds = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: BOOKSTORE_ABI,
        functionName: "getAllBookIds",
      });

      // Get detailed information for each book
      const bookPromises = (bookIds as bigint[]).map((id) =>
        publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: BOOKSTORE_ABI,
          functionName: "getBook",
          args: [id],
        })
      );

      const bookData = await Promise.all(bookPromises);
      const formattedBooks = bookData.map((book: any) => ({
        id: Number(book.id),
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        exists: book.exists,
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("Failed to load books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (bookId: number) => {
    // Actual blockchain call will be implemented in the purchase component
    console.log("Add to favorites:", bookId);
  };

  const handleRemoveFromFavorites = async (bookId: number) => {
    // Actual blockchain call will be implemented in the purchase component
    console.log("Remove from favorites:", bookId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Contract Address Not Configured
          </h3>
          <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
            Please add <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs dark:bg-yellow-900">NEXT_PUBLIC_CONTRACT_ADDRESS</code> to your <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs dark:bg-yellow-900">.env</code> file.
          </p>
          <div className="rounded bg-yellow-100 p-3 text-xs dark:bg-yellow-900">
            <p className="mb-1 font-mono font-semibold">Steps to fix:</p>
            <ol className="list-inside list-decimal space-y-1 text-yellow-800 dark:text-yellow-200">
              <li>Deploy the contract: <code className="rounded bg-yellow-200 px-1 dark:bg-yellow-800">npm run deploy:sepolia</code></li>
              <li>Copy the contract address from the deployment output</li>
              <li>Add to <code className="rounded bg-yellow-200 px-1 dark:bg-yellow-800">.env</code>: <code className="rounded bg-yellow-200 px-1 dark:bg-yellow-800">NEXT_PUBLIC_CONTRACT_ADDRESS=0x...</code></li>
              <li>Restart the dev server: <code className="rounded bg-yellow-200 px-1 dark:bg-yellow-800">npm run dev</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          No books available. Please deploy the contract and add books.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
        />
      ))}
    </div>
  );
}

