"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Card } from "@/components/shadcn-ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { NydusTabs } from "@/components/custom-ui/nydus-tabs";
import Image from "next/image";
import { Separator } from "@/components/shadcn-ui/separator";

enum BridgeTab {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export default function BridgePage() {
  const [activeTab, setActiveTab] = useState<BridgeTab>(BridgeTab.DEPOSIT);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Bridge</h1>
          <p className="text-muted-foreground">Enter or exit the protocol</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border glow-border">
            {/* Tab Switcher */}
            <NydusTabs
              id="bridge-tabs"
              selectedTab={activeTab}
              setSelectedTab={setActiveTab}
              items={BridgeTab}
              className="h-[50px]"
            />

            {/* From/To Section */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col justify-center items-start gap-2 w-[30%] shrink-0">
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <div className="flex items-center gap-2 border border-border rounded-lg p-2 w-full">
                    <Image src="/chains/arbitrum-logo.svg" alt="Arbitrum" width={20} height={20} />
                    Arbitrum
                  </div>
                </div>

                <div className="flex justify-center h-full">
                  <div className="p-2 rounded-lg bg-secondary border border-border">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 w-[30%] shrink-0">
                  <Label className="text-sm text-muted-foreground">To</Label>
                  <div className="flex items-center gap-2 border border-border rounded-lg p-2 w-full">
                    {/* <Image src="/chains/nydus-logo.svg" alt="NYDUS" width={20} height={20} /> */}
                    NYDUS
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amount Input */}
            <div className="space-y-2 mb-6">
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-secondary border-border text-2xl h-16 pr-32"
                />
                <Select defaultValue="eth">
                  <SelectTrigger className="absolute right-2 top-1/2 -translate-y-1/2 w-28 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary/20" />
                        ETH
                      </div>
                    </SelectItem>
                    <SelectItem value="usdc">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-accent/20" />
                        USDC
                      </div>
                    </SelectItem>
                    <SelectItem value="usdt">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-accent/20" />
                        USDT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>Balance: 0.00</span>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <Button className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
              Connect Wallet
            </Button>

            {/* Info */}
            <div className="mt-6 flex justify-start items-center gap-2 text-xs text-muted-foreground">
              <Info className="size-4 shrink-0" />
              <p>
                Estimated time: ~5 minutes. Gas fees will be calculated after wallet connection.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
