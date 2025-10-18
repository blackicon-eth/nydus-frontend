import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import Image from "next/image";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address } from "viem";

interface InputAmountProps {
  inputAmount: string;
  setInputAmount: Dispatch<SetStateAction<string>>;
  selectedToken: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
  address: Address | undefined;
  usdcBalance: string;
  ethBalance: string;
  isLoadingWalletBalances: boolean;
  ethPrice: number;
  isLoadingEthPrice: boolean;
}

export function InputAmount({
  inputAmount,
  setInputAmount,
  selectedToken,
  setSelectedToken,
  address,
  ethPrice,
  isLoadingEthPrice,
  usdcBalance,
  ethBalance,
  isLoadingWalletBalances,
}: InputAmountProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-2 mb-6">
      <Label className="text-sm text-muted-foreground">Amount</Label>
      <div className="relative">
        <Input
          type="number"
          placeholder="Enter amount"
          className="bg-secondary border-border text-3xl h-[70px] pr-36"
          value={inputAmount}
          disabled={!mounted || !address}
          min={0}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || Number(value) >= 0) {
              setInputAmount(value);
            } else {
              setInputAmount("0");
            }
          }}
        />
        <Select
          disabled={!mounted || !address}
          defaultValue={selectedToken}
          onValueChange={setSelectedToken}
        >
          <SelectTrigger className="absolute right-2 top-1/2 -translate-y-1/2 w-32 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eth">
              <div className="flex items-center gap-2">
                <div className="relative size-6 rounded-full bg-white">
                  <Image
                    src="/tokens/eth-logo.svg"
                    alt="ETH Logo"
                    width={12}
                    height={12}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  />
                </div>
                <span className="text-base">ETH</span>
              </div>
            </SelectItem>
            <SelectItem value="usdc">
              <div className="flex items-center gap-2">
                <Image src="/tokens/usdc-logo.svg" alt="USDC Logo" width={24} height={24} />
                <span className="text-base">USDC</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        {/* USD Price */}
        <AnimatePresence mode="wait">
          {!mounted || !address ? null : isLoadingEthPrice ? (
            <motion.div
              key="loading-eth-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Skeleton className="w-16 h-4" />
            </motion.div>
          ) : selectedToken === "eth" ? (
            <motion.div
              key="eth-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              ${inputAmount ? (Number(inputAmount) * (ethPrice || 0)).toFixed(2) : "0.00"}
            </motion.div>
          ) : (
            <motion.div
              key="usdc-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              ${inputAmount ? Number(inputAmount).toFixed(2) : "0.00"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available amount */}
        <AnimatePresence mode="wait">
          {!mounted || !address ? null : isLoadingWalletBalances ? (
            <motion.div
              key="loading-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Skeleton className="w-16 h-4" />
            </motion.div>
          ) : selectedToken === "eth" ? (
            <motion.div
              key="eth-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <button
                className="underline cursor-pointer"
                onClick={() => setInputAmount(ethBalance || "0")}
              >
                Max
              </button>
              Balance: {ethBalance.slice(0, 6) || "0.00"}
            </motion.div>
          ) : (
            <motion.div
              key="usdc-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <button
                className="underline cursor-pointer"
                onClick={() => setInputAmount(usdcBalance || "0")}
              >
                Max
              </button>
              Balance: {usdcBalance.slice(0, 6) || "0.00"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
