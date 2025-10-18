import { AnimatePresence, motion } from "motion/react";
import { Label } from "@/components/shadcn-ui/label";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { BridgeTab } from "@/lib/types/enums";

interface FromToSectionProps {
  activeTab: BridgeTab;
}

export function FromToSection({ activeTab }: FromToSectionProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col justify-center items-start gap-2 w-[30%] shrink-0">
          <Label className="text-sm text-muted-foreground">From</Label>
          <div className="border border-border rounded-lg p-3 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === BridgeTab.DEPOSIT ? (
                <motion.div
                  key="base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2"
                >
                  <Image src="/chains/base-logo.svg" alt="Arbitrum" width={24} height={24} />
                  <span className="text-base font-medium">Base</span>
                </motion.div>
              ) : (
                <motion.div
                  key="nydus"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2"
                >
                  <div className="relative size-6 shrink-0">
                    <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                      <span className="text-sm font-bold text-primary glow-text">Ø</span>
                    </div>
                  </div>
                  <span className="text-base font-medium text-primary glow-text">NYDUS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center items-end h-full">
          <div className="p-2 rounded-lg bg-secondary border border-border">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="space-y-2 w-[30%] shrink-0">
          <Label className="text-sm text-muted-foreground">To</Label>
          <div className="border border-border rounded-lg p-3 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === BridgeTab.WITHDRAW ? (
                <motion.div
                  key="base"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center gap-2"
                >
                  <Image src="/chains/base-logo.svg" alt="Arbitrum" width={24} height={24} />
                  <span className="text-base font-medium">Base</span>
                </motion.div>
              ) : (
                <motion.div
                  key="nydus"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center gap-2"
                >
                  <div className="relative size-6 shrink-0">
                    <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                      <span className="text-sm font-bold text-primary glow-text">Ø</span>
                    </div>
                  </div>
                  <span className="text-base font-medium text-primary glow-text">NYDUS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
