"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

// TODO: Remove this after testing
const user_key = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const amount = "0x32";
const current_amount = "0x64";
const previous_nonce = "0x00";
const previous_personal_imt_root =
  "0x16fc095e8e313454d04067b1aa602db61a1d7408e778df5de967e04e113838f2";
const receiver_public_key = [
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
];
const imt_leaf_proof = [
  "0x2693a1812ae1fb5392b2f73cbffdd14fbf90b7430e4020594589245e45c5d283",
  "0x2b531be43bcdbfb0014cd8842cf18be46bcb09cfbcccb467cf5f27190a80e480",
  "0x0c8d11fe4e37bac6ca7f730a6dd8cf8e5b5eb43a0ba455682556c7e9edc8bf8b",
  "0x2616182a5261077406bad05306c3ac575664f3934af8f35572a6303909002247",
  "0x09b61b4d3868115549b3746d1d92583c079884ebffe17d5167bf385ed6408e84",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
];
const token_address = "0x58002bee8f43bf203964d38c54fa03e62d615959fa";
const master_tree_root = "0x2df510686c8a0028928fde220e3059fabe22f3ce3df3ec099811e051e77ef58d";
const personal_imt_root_proof = [
  "0x0c0e544bae08a03231d737d86976f2d342d4daea2649d6cccfe6ad0271149bc5",
  "0x2b531be43bcdbfb0014cd8842cf18be46bcb09cfbcccb467cf5f27190a80e480",
  "0x0c8d11fe4e37bac6ca7f730a6dd8cf8e5b5eb43a0ba455682556c7e9edc8bf8b",
  "0x2616182a5261077406bad05306c3ac575664f3934af8f35572a6303909002247",
  "0x09b61b4d3868115549b3746d1d92583c079884ebffe17d5167bf385ed6408e84",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
];
const personal_imt_root_leaf_value =
  "0x16fc095e8e313454d04067b1aa602db61a1d7408e778df5de967e04e113838f2";
const personal_imt_root_leaf_key = "1311768467294899695";
const personal_imt_root_leaf_idx = "1";

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
