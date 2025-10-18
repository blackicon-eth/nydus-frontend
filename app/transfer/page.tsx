"use client";

import { motion } from "motion/react";
import { Info, User } from "lucide-react";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Card } from "@/components/shadcn-ui/card";
import { InputAmount } from "@/components/custom-ui/bridge/input-amout";
import { useEffect, useMemo, useState } from "react";
import { useETHPrice } from "@/hooks/use-eth-price";
import { useAccount } from "wagmi";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { TransferMainButton } from "@/components/custom-ui/transfer/transfer-main-button";

export default function TransferPage() {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("eth");
  const [mounted, setMounted] = useState(false);

  // hooks
  const { address } = useAccount();
  const { data: ethPrice, isLoading: isLoadingEthPrice } = useETHPrice();
  const { ethBalance, usdcBalance, isLoading: isLoadingWalletBalances } = useWalletBalance();

  // Whether the input amount is valid
  const isInputAmountValid = Boolean(
    useMemo(() => {
      if (selectedToken === "eth") {
        return (
          Number(inputAmount) > 0 &&
          ethBalance?.formatted &&
          Number(inputAmount) <= Number(ethBalance.formatted)
        );
      }
      return (
        Number(inputAmount) > 0 &&
        usdcBalance?.formatted &&
        Number(inputAmount) <= Number(usdcBalance.formatted)
      );
    }, [selectedToken, inputAmount, ethBalance, usdcBalance])
  );

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Transfer</h1>
          <p className="text-muted-foreground">Send tokens to another address</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="flex flex-col gap-10 p-6 bg-card/50 backdrop-blur border-border glow-border">
            {/* Recipient Address */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Recipient Address</Label>
              <div className="relative">
                <Input placeholder="0x..." className="bg-secondary border-border pl-10" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the <b>Nydus address</b> of the recipient
              </p>
            </div>

            {/* Input Amount */}
            <InputAmount
              inputAmount={inputAmount}
              setInputAmount={setInputAmount}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              address={address}
              ethPrice={ethPrice || 0}
              isLoadingEthPrice={isLoadingEthPrice}
              usdcBalance={usdcBalance?.formatted || "0"}
              ethBalance={ethBalance?.formatted || "0"}
              isLoadingWalletBalances={isLoadingWalletBalances}
            />

            {/* Transaction Summary */}
            <div className="space-y-3 p-4 rounded-lg bg-secondary/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">~$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="text-foreground">~30 seconds</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">0.00 ETH</span>
              </div>
            </div>

            {/* Send Button */}
            <TransferMainButton
              mounted={mounted}
              address={address}
              inputAmount={inputAmount}
              isInputAmountValid={isInputAmountValid}
              isLoadingWalletBalances={isLoadingWalletBalances}
              isLoadingEthPrice={isLoadingEthPrice}
            />

            {/* Info */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="size-4 shrink-0" />
              <p>
                Double-check the recipient address before sending. Transactions cannot be reversed.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
