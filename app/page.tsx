import type { Metadata } from "next";
import { env } from "@/lib/zod";

const appUrl = env.NEXT_PUBLIC_URL;
const appName = env.NEXT_PUBLIC_APPLICATION_NAME;
const appDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

export function generateMetadata(): Metadata {
  return {
    title: `${appName}`,
    description: appDescription,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: `${appName}`,
      description: appDescription,
      type: "website",
      images: [
        {
          url: `${appUrl}/images/feed.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Home() {
  return <div>Hello World</div>;
}
