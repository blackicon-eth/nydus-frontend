import { Button } from "@/components/shadcn-ui/button";
import { useAppKit } from "@reown/appkit/react";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Address } from "viem";

interface TransferMainButtonProps {
  mounted: boolean;
  address: Address | undefined;
  inputAmount: string;
  isInputAmountValid: boolean;
  isLoadingWalletBalances: boolean;
  isLoadingEthPrice: boolean;
}

export function TransferMainButton({
  mounted,
  address,
  inputAmount,
  isInputAmountValid,
  isLoadingWalletBalances,
  isLoadingEthPrice,
}: TransferMainButtonProps) {
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
            key="send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Send className="size-5" />
            Send Tokens
          </motion.p>
        ) : (
          <motion.p
            key="connect-wallet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Connect Wallet
          </motion.p>
        )}
      </AnimatePresence>
    </Button>
  );
}
