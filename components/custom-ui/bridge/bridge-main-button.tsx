import { Button } from "@/components/shadcn-ui/button";
import { useAppKit } from "@reown/appkit/react";
import { AnimatePresence, motion } from "motion/react";
import { Address } from "viem";

interface BridgeMainButtonProps {
  mounted: boolean;
  address: Address | undefined;
  inputAmount: string;
  isInputAmountValid: boolean;
  isLoadingWalletBalances: boolean;
  isLoadingEthPrice: boolean;
}

export function BridgeMainButton({
  mounted,
  address,
  inputAmount,
  isInputAmountValid,
  isLoadingWalletBalances,
  isLoadingEthPrice,
}: BridgeMainButtonProps) {
  const { open } = useAppKit();

  return (
    <Button
      disabled={
        !mounted ||
        isLoadingWalletBalances ||
        isLoadingEthPrice ||
        (address && (!inputAmount || Number(inputAmount) === 0 || !isInputAmountValid))
      }
      onClick={() => {
        if (address) {
          // TODO: Implement bridge logic
          console.log("Bridge logic");
        }
        if (!address) {
          open({ view: "Connect" });
        }
      }}
      className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-border"
    >
      <AnimatePresence mode="wait">
        {!mounted || address ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="bridge"
          >
            Bridge
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="connect-wallet"
          >
            Connect Wallet
          </motion.p>
        )}
      </AnimatePresence>
    </Button>
  );
}
