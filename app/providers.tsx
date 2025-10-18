"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { CustomWagmiProvider } from "@/contexts/custom-wagmi-provider";
import { NydusAuthProvider } from "@/contexts/nydus-auth-context";

interface ProvidersProps {
  children: React.ReactNode;
  cookies: string | null;
}

export default function Providers({ children, cookies }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <CustomWagmiProvider cookies={cookies}>
        <NydusAuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </NydusAuthProvider>
      </CustomWagmiProvider>
    </NuqsAdapter>
  );
}
