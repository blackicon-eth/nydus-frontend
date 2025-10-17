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
import { Switch } from "@/components/shadcn-ui/switch";

export default function BridgePage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Bridge</h1>
          <p className="text-muted-foreground">Transfer tokens between networks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border glow-border">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => setActiveTab("deposit")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                  activeTab === "deposit"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab("withdraw")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                  activeTab === "withdraw"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Withdraw
              </button>
            </div>

            {/* From/To Section */}
            <div className="space-y-4 mb-6">
              <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          Ethereum
                        </div>
                      </SelectItem>
                      <SelectItem value="polygon">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-accent/20" />
                          Polygon
                        </div>
                      </SelectItem>
                      <SelectItem value="arbitrum">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          Arbitrum
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center pb-2">
                  <div className="p-2 rounded-lg bg-secondary border border-border">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Select defaultValue="cypher">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cypher">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          CYPHER
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Token Selection Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button className="pb-2 px-4 text-sm border-b-2 border-primary text-primary">
                Token
              </button>
              <button className="pb-2 px-4 text-sm text-muted-foreground hover:text-foreground">
                NFT
              </button>
            </div>

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
                <span>$ 0</span>
                <span>Balance: 0.00</span>
              </div>
            </div>

            {/* Custom Address Toggle */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-secondary/50">
              <Label htmlFor="custom-address" className="text-sm cursor-pointer">
                Use Custom Address
              </Label>
              <Switch
                id="custom-address"
                checked={useCustomAddress}
                onCheckedChange={setUseCustomAddress}
              />
            </div>

            {useCustomAddress && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Input placeholder="0x..." className="bg-secondary border-border" />
              </motion.div>
            )}

            {/* Connect Wallet Button */}
            <Button className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
              Connect Wallet
            </Button>

            {/* Info */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Estimated time: ~5 minutes. Gas fees will be calculated after wallet connection.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Value Locked</p>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </Card>
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </Card>
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">Transactions</p>
            <p className="text-2xl font-bold text-primary">0</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
