import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  bookId: number;
  title: string;
  author: string;
  price: string; // Price string in wei
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => bigint;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.bookId === item.bookId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.bookId === item.bookId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },
      removeItem: (bookId) => {
        set({
          items: get().items.filter((item) => item.bookId !== bookId),
        });
      },
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.bookId === bookId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + BigInt(item.price) * BigInt(item.quantity);
        }, BigInt(0));
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "bookchain-cart",
    }
  )
);

