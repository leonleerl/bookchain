import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteStore {
  favorites: number[]; // Array of book IDs
  addFavorite: (bookId: number) => void;
  removeFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (bookId) => {
        const favorites = get().favorites;
        if (!favorites.includes(bookId)) {
          set({ favorites: [...favorites, bookId] });
        }
      },
      removeFavorite: (bookId) => {
        set({
          favorites: get().favorites.filter((id) => id !== bookId),
        });
      },
      isFavorite: (bookId) => {
        return get().favorites.includes(bookId);
      },
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "bookchain-favorites",
    }
  )
);

