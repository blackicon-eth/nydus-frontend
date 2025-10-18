"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Config } from "@wagmi/core";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { wagmiAdapter } from "@/lib/reown";

const queryClient = new QueryClient();

interface CustomWagmiProviderProps {
  children: React.ReactNode;
  cookies: string | null;
}

export const CustomWagmiProvider = ({
  children,
  cookies,
}: CustomWagmiProviderProps) => {
  // Create the initial state
  const wagmiWebAppInitialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  const config = wagmiAdapter.wagmiConfig as Config;

  return (
    <WagmiProvider
      config={config}
      initialState={wagmiWebAppInitialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
