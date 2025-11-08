"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useUserStore } from "../store/userStore";
import { useCartStore } from "../store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { setUser, setWalletAddress, setIsConnected, logout } = useUserStore();
  const { getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing cart count on client
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || undefined,
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  useEffect(() => {
    setWalletAddress(address || null);
    setIsConnected(isConnected);
  }, [address, isConnected, setWalletAddress, setIsConnected]);

  const handleGoogleLogin = () => {
    signIn("google");
  };

  const handleLogout = () => {
    signOut();
    logout();
  };

  const handleWalletConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const handleWalletDisconnect = () => {
    disconnect();
    setWalletAddress(null);
    setIsConnected(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-black/95">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">📚 BookChain</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            Home
          </Link>
          <Link
            href="/cart"
            className="relative text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            Cart
            {mounted && getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {getItemCount()}
              </span>
            )}
          </Link>
          {session && (
            <Link
              href="/favorites"
              className="text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
              Favorites
            </Link>
          )}

          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ""}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm">{session.user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                Login
              </button>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={handleWalletDisconnect}
                  className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleWalletConnect}
                className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

