import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import { env } from "@/lib/zod";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APPLICATION_NAME}`,
  description: `${env.NEXT_PUBLIC_APPLICATION_DESCRIPTION}`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} size-full antialiased`}>
          <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
