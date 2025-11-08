"use client";

import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { useCartStore } from "../store/cartStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { useAddToFavorites, useRemoveFromFavorites } from "../lib/web3Actions";
import { formatEther } from "viem";
import { useState, useEffect } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: bigint;
  stock: bigint;
  exists: boolean;
}

interface BookCardProps {
  book: Book;
  onAddToFavorites?: (bookId: number) => Promise<void>;
  onRemoveFromFavorites?: (bookId: number) => Promise<void>;
}

export default function BookCard({
  book,
  onAddToFavorites,
  onRemoveFromFavorites,
}: BookCardProps) {
  const { data: session } = useSession();
  const { isConnected } = useAccount();
  const { addItem } = useCartStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { addToFavorites, isPending: isAdding } = useAddToFavorites();
  const { removeFromFavorites, isPending: isRemoving } = useRemoveFromFavorites();
  const [isFav, setIsFav] = useState(isFavorite(book.id));
  const isLoading = isAdding || isRemoving;

  useEffect(() => {
    setIsFav(isFavorite(book.id));
  }, [book.id, isFavorite]);

  const handleAddToCart = () => {
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price.toString(),
    });
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      alert("Please login to add favorites");
      return;
    }

    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }

    try {
      if (isFav) {
        await removeFromFavorites(book.id);
        removeFavorite(book.id);
        setIsFav(false);
        if (onRemoveFromFavorites) {
          await onRemoveFromFavorites(book.id);
        }
      } else {
        await addToFavorites(book.id);
        addFavorite(book.id);
        setIsFav(true);
        if (onAddToFavorites) {
          await onAddToFavorites(book.id);
        }
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      alert(`Operation failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Author: {book.author}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatEther(book.price)} ETH
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Stock: {book.stock.toString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleAddToCart}
          disabled={book.stock === BigInt(0)}
          className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading || !session}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isFav
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          } ${!session ? "cursor-not-allowed opacity-50" : ""}`}
          title={!session ? "Please login first" : ""}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}

