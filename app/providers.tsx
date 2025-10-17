"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { CustomWagmiProvider } from "@/contexts/customWagmiProvider";


interface ProvidersProps {
  children: React.ReactNode;
  cookies: string | null;
}

export default function Providers({ children, cookies }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <CustomWagmiProvider cookies={cookies}>
          {children}
          <Toaster richColors position="top-right" />
      </CustomWagmiProvider>
    </NuqsAdapter>
  );
}
