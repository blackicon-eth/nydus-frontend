import {
  type AppKitNetwork,
  baseSepoliaPreconf as baseSepoliaPreconfReown,
} from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "viem";
import { env } from "./zod";

// 1. Get projectId from https://cloud.reown.com
const projectId = env.NEXT_PUBLIC_REOWN_PROJECT_ID;
const appName = env.NEXT_PUBLIC_APPLICATION_NAME;
const appDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

// 2. Create a metadata object - optional
const metadata = {
  name: appName,
  description: appDescription,
  url: env.NEXT_PUBLIC_URL,
  icons: [`${env.NEXT_PUBLIC_URL}/images/icon.png`],
};

// 3. Set the networks for AppKit
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  baseSepoliaPreconfReown,
];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: undefined, // important for reown to work on nextjs
  transports: {
    [baseSepoliaPreconfReown.id]: http(),
  },
});

// 5. Create wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// 6. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});
