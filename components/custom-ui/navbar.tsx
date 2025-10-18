"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { cn, copyToClipboard, formatAvatarSrc, formatWalletAddress } from "@/lib/utils";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { getEnsAvatar, getEnsName } from "@/lib/ens/client";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { useNydusAuth } from "@/contexts/nydus-auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isFetchingName, setIsFetchingName] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const { open } = useAppKit();
  const { isAuthenticated } = useNydusAuth();

  // Navbar links
  const navLinks = [
    { href: "/bridge", label: "Bridge" },
    { href: "/transfer", label: "Transfer" },
    { href: "/activity", label: "Activity" },
  ];

  // Pathname
  const pathname = usePathname();

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // When the user connects their wallet, set the username
  useEffect(() => {
    // If there is no address, reset the username and avatar
    if (!address) {
      setUsername(null);
      setAvatar(null);
      return;
    }

    // Fetch the username and avatar
    const fetchUsername = async () => {
      setIsFetchingName(true);
      const username = await getEnsName(address);
      setUsername(username || formatWalletAddress(address));
      if (username) {
        const avatar = await getEnsAvatar(username);
        setAvatar(avatar ? formatAvatarSrc(avatar as string) : null);
      }
      setIsFetchingName(false);
    };

    fetchUsername();
  }, [address]);

  return (
    <div className="relative">
      {/* Dimming Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 top-[64px] bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Desktop Logo - Left */}
            <Link href="/" className="hidden md:block cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-2 w-[353px]"
              >
                <div className="relative size-9">
                  <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                    <span className="text-2xl font-bold text-primary glow-text">Ø</span>
                  </div>
                </div>
                <span className="text-3xl font-bold text-primary glow-text">NYDUS</span>
              </motion.div>
            </Link>

            {/* Mobile Logo - Center */}
            <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2 cursor-pointer">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                <div className="relative size-7">
                  <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                    <span className="font-bold text-primary glow-text">Ø</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary glow-text">NYDUS</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={{ pathname: link.href }} className="cursor-pointer">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "text-xl text-muted-foreground hover:text-primary transition-colors",
                      pathname === link.href && "text-primary"
                    )}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Desktop Connect Button */}
            <div className="hidden md:block w-[353px]">
              <AnimatePresence mode="wait">
                {!mounted || isFetchingName ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-end w-full"
                  >
                    <Loader2 className="size-6 animate-spin text-primary mr-4" />
                  </motion.div>
                ) : !address ? (
                  <motion.div
                    key="not-connected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-end w-full"
                  >
                    <Button
                      onClick={() => open({ view: "Connect" })}
                      className="bg-primary text-lg text-primary-foreground hover:bg-primary/90 glow-border"
                    >
                      Connect Wallet
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-end w-full gap-10"
                  >
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                      <div
                        className={`size-2 rounded-full shrink-0 ${isAuthenticated ? "bg-green-400" : "bg-yellow-400"}`}
                      />
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {isAuthenticated ? "Nydus Authenticated" : "Nydus Pending"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-center gap-3 cursor-pointer">
                        <span className="text-lg text-muted-foreground">{username}</span>
                        <img
                          src={avatar || DEFAULT_AVATAR}
                          alt={username || "Default Avatar"}
                          className="size-9 rounded-full"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            copyToClipboard(address, "Address copied", "Failed to copy address")
                          }
                          className="flex items-center justify-start gap-2 cursor-pointer w-full"
                        >
                          Copy Address <Copy />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            onClick={() => open({ view: "Account" })}
                            className="bg-red-500 text-sm text-primary hover:bg-red-500/90 glow-border"
                          >
                            Disconnect Wallet
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-50 p-2 text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-7 px-4 py-6">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={{ pathname: link.href }}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block text-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer",
                          pathname === link.href && "text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  {!address ? (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button
                      onClick={() => open({ view: "Account" })}
                      className="bg-red-500 text-primary hover:bg-red-500/90 glow-border w-full"
                    >
                      Disconnect Wallet
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
