import type { Metadata } from "next";
import { Geist_Mono, Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import { env } from "@/lib/zod";
import { Navbar } from "@/components/custom-ui/navbar";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${_geist.className} ${_geistMono.className} cyber-grid antialiased`}>
        <Providers cookies={cookies}>
          <Navbar />
          <main className="h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] mt-16 sm:mt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
