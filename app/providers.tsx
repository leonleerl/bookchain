"use client"

import ContextProvider from "@/context";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  cookies: string | null;
}

export function Providers({ children, cookies }: ProvidersProps) {

  const [queryClient] = useState(() => new QueryClient());
  return (
      <ContextProvider cookies={cookies}>
      <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  </ContextProvider>
  );
}

