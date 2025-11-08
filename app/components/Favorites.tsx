"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useFavoriteStore } from "../store/favoriteStore";
import { publicClient, CONTRACT_ADDRESS, BOOKSTORE_ABI } from "../lib/contract";
import BookCard from "./BookCard";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  price: bigint;
  stock: bigint;
  exists: boolean;
}

export default function Favorites() {
  const { address } = useAccount();
  const { favorites } = useFavoriteStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    loadFavoriteBooks();
  }, [favorites]);

  const loadFavoriteBooks = async () => {
    try {
      setLoading(true);
      if (!CONTRACT_ADDRESS) {
        console.error("Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file");
        setLoading(false);
        return;
      }

      // Get favorite book details
      const bookPromises = favorites.map((id) =>
        publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: BOOKSTORE_ABI,
          functionName: "getBook",
          args: [BigInt(id)],
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
      console.error("Failed to load favorite books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (bookId: number) => {
    // Actual blockchain call will be implemented when needed
    console.log("Add to favorites:", bookId);
  };

  const handleRemoveFromFavorites = async (bookId: number) => {
    // Actual blockchain call will be implemented when needed
    console.log("Remove from favorites:", bookId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-400">No favorites yet</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Favorites</h1>
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
    </div>
  );
}

