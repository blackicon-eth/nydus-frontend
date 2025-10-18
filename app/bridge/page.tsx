"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { Card } from "@/components/shadcn-ui/card";
import { NydusTabs } from "@/components/custom-ui/nydus-tabs";
import { Separator } from "@/components/shadcn-ui/separator";
import { useAccount } from "wagmi";
import { useETHPrice } from "@/hooks/use-eth-price";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { BridgeTab } from "@/lib/types/enums";
import { FromToSection } from "@/components/custom-ui/bridge/from-to-section";
import { InputAmount } from "@/components/custom-ui/bridge/input-amout";
import { BridgeMainButton } from "@/components/custom-ui/bridge/bridge-main-button";

export default function BridgePage() {
  const [activeTab, setActiveTab] = useState<BridgeTab>(BridgeTab.DEPOSIT);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // hooks
  const [selectedToken, setSelectedToken] = useState<string>("eth");
  const { data: ethPrice, isLoading: isLoadingEthPrice } = useETHPrice();
  const { ethBalance, usdcBalance, isLoading: isLoadingWalletBalances } = useWalletBalance();
  const { address } = useAccount();

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // When the input token changes, set the input amount to empty string
  useEffect(() => {
    setInputAmount("");
  }, [selectedToken, address, activeTab]);

  // Whether the wallet is connected

  return (
    <div className="h-full py-12 px-4">
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
            <FromToSection activeTab={activeTab} />

            <Separator />

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

            {/* Connect Wallet Button */}
            <BridgeMainButton
              mounted={mounted}
              address={address}
              inputAmount={inputAmount}
              isInputAmountValid={isInputAmountValid}
              isLoadingWalletBalances={isLoadingWalletBalances}
              isLoadingEthPrice={isLoadingEthPrice}
            />

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
