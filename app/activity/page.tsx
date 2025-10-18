"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
} from "lucide-react";
import { Card } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { copyToClipboard } from "@/lib/utils";

// Mock transaction data
const mockTransactions = Array.from({ length: 25 }, (_, i) => {
  const directions = ["incoming", "outgoing", "deposit", "withdraw"];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const needsAddresses = direction === "incoming" || direction === "outgoing";

  const generateAddress = () => {
    const fullAddress = `0x${Math.random().toString(16).substring(2, 42).padEnd(40, "0")}`;
    return fullAddress;
  };

  const senderFull = needsAddresses ? generateAddress() : undefined;
  const recipientFull = needsAddresses ? generateAddress() : undefined;

  return {
    id: i + 1,
    sender: senderFull ? `${senderFull.substring(0, 10)}...${senderFull.substring(38)}` : undefined,
    senderFull,
    recipient: recipientFull
      ? `${recipientFull.substring(0, 10)}...${recipientFull.substring(38)}`
      : undefined,
    recipientFull,
    token: Math.random() > 0.5 ? "ETH" : "USDC",
    amount: (Math.random() * 10).toFixed(4),
    direction,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

export default function ActivityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 9;

  // Calculate pagination
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = mockTransactions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <div className="h-full py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Activity</h1>
            <p className="text-muted-foreground">View your transaction history</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border glow-border">
              {/* Custom Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="block w-full">
                    <tr className="border-b border-border flex w-full">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground w-[20%]">
                        Direction
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground w-[25%]">
                        Sender
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground w-[25%]">
                        Recipient
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground w-[15%]">
                        Token
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground w-[15%]">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="block w-full" style={{ minHeight: "560px" }}>
                    {currentTransactions.map((tx, index) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors flex w-full"
                      >
                        <td className="py-4 px-4 w-[20%]">
                          <div className="flex items-center gap-2">
                            {tx.direction === "incoming" ? (
                              <>
                                <div className="p-1.5 rounded-full bg-green-500/10">
                                  <ArrowDownLeft className="size-4 text-green-500" />
                                </div>
                                <span className="text-sm text-green-500 font-medium">Incoming</span>
                              </>
                            ) : tx.direction === "outgoing" ? (
                              <>
                                <div className="p-1.5 rounded-full bg-orange-500/10">
                                  <ArrowUpRight className="size-4 text-orange-500" />
                                </div>
                                <span className="text-sm text-orange-500 font-medium">
                                  Outgoing
                                </span>
                              </>
                            ) : tx.direction === "deposit" ? (
                              <>
                                <div className="p-1.5 rounded-full bg-purple-500/10">
                                  <Download className="size-4 text-purple-500" />
                                </div>
                                <span className="text-sm text-purple-500 font-medium">Deposit</span>
                              </>
                            ) : (
                              <>
                                <div className="p-1.5 rounded-full bg-cyan-500/10">
                                  <Upload className="size-4 text-cyan-500" />
                                </div>
                                <span className="text-sm text-cyan-500 font-medium">Withdraw</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 w-[25%]">
                          {tx.sender && tx.senderFull ? (
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <span
                                  className="text-sm text-foreground font-mono cursor-pointer hover:text-primary transition-colors"
                                  onClick={() =>
                                    copyToClipboard(
                                      tx.senderFull,
                                      "Address copied to clipboard",
                                      "Failed to copy address"
                                    )
                                  }
                                >
                                  {tx.sender}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="mb-2">
                                <p className="font-mono">{tx.senderFull}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 w-[25%]">
                          {tx.recipient && tx.recipientFull ? (
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <span
                                  className="text-sm text-foreground font-mono cursor-pointer hover:text-primary transition-colors"
                                  onClick={() =>
                                    copyToClipboard(
                                      tx.recipientFull,
                                      "Address copied to clipboard",
                                      "Failed to copy address"
                                    )
                                  }
                                >
                                  {tx.recipient}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="mb-2">
                                <p className="font-mono">{tx.recipientFull}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 w-[15%]">
                          <span className="text-sm text-foreground font-semibold">{tx.token}</span>
                        </td>
                        <td className="py-4 px-4 text-right w-[15%]">
                          <span className="text-sm text-foreground font-semibold">
                            {tx.amount} {tx.token}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, mockTransactions.length)} of{" "}
                  {mockTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
