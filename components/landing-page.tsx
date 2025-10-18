"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

export function LandingPage() {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="flex flex-col justify-center items-center max-w-4xl text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 glow-text">NYDUS PROTOCOL</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            The privacy protocol for the next generation of the internet.
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
              className="bg-primary text-lg text-primary-foreground hover:bg-primary/90 glow-border w-[225px]"
            >
              Bridge Tokens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={{ pathname: "/transfer" }} className="cursor-pointer">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-lg text-primary hover:bg-primary/10 bg-transparent w-[225px]"
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
          className="grid md:grid-cols-2 gap-6 sm:mt-12 mt-4"
        >
          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur hover:bg-white/5 transition-all duration-300">
            <Shield className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="text-lg font-bold mb-2">Secure</h3>
            <p className="text-base text-muted-foreground">
              ZK-based encryption and decentralized architecture
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur hover:bg-white/5 transition-all duration-300">
            <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="text-lg font-bold mb-2">Fast</h3>
            <p className="text-base text-muted-foreground">
              Fast and efficient transactions with minimal fees
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
