"use client";
import { motion } from "motion/react";
import { Send, Info, User } from "lucide-react";
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

export default function TransferPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 glow-text">Transfer</h1>
          <p className="text-muted-foreground font-mono">Send tokens to another address</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border glow-border">
            {/* Recipient Address */}
            <div className="space-y-2 mb-6">
              <Label className="font-mono text-xs text-muted-foreground">Recipient Address</Label>
              <div className="relative">
                <Input placeholder="0x..." className="bg-secondary border-border font-mono pl-10" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Enter the wallet address of the recipient
              </p>
            </div>

            {/* Token Selection */}
            <div className="space-y-2 mb-6">
              <Label className="font-mono text-xs text-muted-foreground">Token</Label>
              <Select defaultValue="eth">
                <SelectTrigger className="bg-secondary border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20" />
                      <div>
                        <p className="font-mono">ETH</p>
                        <p className="text-xs text-muted-foreground">Ethereum</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdc">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-accent/20" />
                      <div>
                        <p className="font-mono">USDC</p>
                        <p className="text-xs text-muted-foreground">USD Coin</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdt">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-accent/20" />
                      <div>
                        <p className="font-mono">USDT</p>
                        <p className="text-xs text-muted-foreground">Tether</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="dai">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-accent/20" />
                      <div>
                        <p className="font-mono">DAI</p>
                        <p className="text-xs text-muted-foreground">Dai Stablecoin</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <Label className="font-mono text-xs text-muted-foreground">Amount</Label>
                <button className="text-xs font-mono text-primary hover:underline">Max</button>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                className="bg-secondary border-border font-mono text-2xl h-16"
              />
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>$ 0.00</span>
                <span>Available: 0.00 ETH</span>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="space-y-3 mb-6 p-4 rounded-lg bg-secondary/50">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">~$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="text-foreground">~30 seconds</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm font-mono font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">0.00 ETH</span>
              </div>
            </div>

            {/* Send Button */}
            <Button className="w-full h-14 font-mono text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
              <Send className="mr-2 h-5 w-5" />
              Send Tokens
            </Button>

            {/* Info */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground font-mono">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Double-check the recipient address before sending. Transactions cannot be reversed.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Recent Transfers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold font-mono mb-4 text-primary">Recent Transfers</h2>
          <Card className="p-6 bg-card/30 backdrop-blur border-border text-center">
            <p className="text-sm font-mono text-muted-foreground">No recent transfers found</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
