import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface UserStore {
  user: User | null;
  walletAddress: string | null;
  isConnected: boolean;
  setUser: (user: User | null) => void;
  setWalletAddress: (address: string | null) => void;
  setIsConnected: (connected: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  walletAddress: null,
  isConnected: false,
  setUser: (user) => set({ user }),
  setWalletAddress: (address) => set({ walletAddress: address }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  logout: () =>
    set({
      user: null,
      walletAddress: null,
      isConnected: false,
    }),
}));

