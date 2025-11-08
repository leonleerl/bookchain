"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign in to BookChain
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Sign in with your Google account to access all features
        </p>
        <button
          onClick={() => signIn("google")}
          className="w-full rounded-md bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

