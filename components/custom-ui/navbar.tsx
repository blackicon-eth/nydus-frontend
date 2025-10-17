"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/shadcn-ui/button"
import { motion, AnimatePresence } from "motion/react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/bridge", label: "Bridge" },
    { href: "/transfer", label: "Transfer" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Logo - Left */}
          <Link href="/" className="hidden md:block cursor-pointer">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                  <span className="font-mono text-sm font-bold text-primary glow-text">Ø</span>
                </div>
              </div>
              <span className="font-mono text-lg font-bold text-primary glow-text">CYPHER</span>
            </motion.div>
          </Link>

          {/* Mobile Logo - Center */}
          <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2 cursor-pointer">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
                  <span className="font-mono text-sm font-bold text-primary glow-text">Ø</span>
                </div>
              </div>
              <span className="font-mono text-lg font-bold text-primary glow-text">CYPHER</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={{pathname: link.href}} className="cursor-pointer">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Desktop Connect Button */}
          <div className="hidden md:block">
            <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
              Connect Wallet
            </Button>
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
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={{pathname: link.href}}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 font-mono text-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
                  Connect Wallet
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
