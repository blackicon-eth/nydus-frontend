import type { Metadata } from "next";
import { env } from "@/lib/zod";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

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
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold font-mono mb-4 glow-text">
            CYPHER PROTOCOL
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-mono">
            Decentralized bridge and transfer protocol
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href={{ pathname: "/bridge" }} className="cursor-pointer">
            <Button
              size="lg"
              className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 glow-border"
            >
              Bridge Tokens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={{ pathname: "/transfer" }} className="cursor-pointer">
            <Button
              size="lg"
              variant="outline"
              className="font-mono border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              Transfer Tokens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mt-16"
        >
          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
            <Shield className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-mono text-lg font-bold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Military-grade encryption and decentralized architecture
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
            <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-mono text-lg font-bold mb-2">Fast</h3>
            <p className="text-sm text-muted-foreground">
              Lightning-fast transactions with minimal fees
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
