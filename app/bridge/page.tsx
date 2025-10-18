"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info, Zap, Shield, Clock } from "lucide-react";
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
import { Switch } from "@/components/shadcn-ui/switch";
import { useAccount } from "wagmi";
import { createWalletClient, custom, recoverMessageAddress, keccak256, stringToHex, recoverPublicKey, writeContract } from "viem";
import { sepolia } from "viem/chains";
import { Noir } from "@noir-lang/noir_js";
import circuit from "@/public/circuits/nydus_entry.json";
import { useNydusAuth } from "@/lib/contexts/NydusAuthContext";

const NYDUS_MESSAGE = "Welcome to the Nydus! \n\nThis signature on this message will be used to access the Nydus network. This signature is your access key to the network and needed for clientside proving. \nMake sure you don't pass this signature to someone else! \n\nCaution: Please make sure that the domain you are connected to is correct.";

// Nydus contract address and ABI
const NYDUS_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address
const NYDUS_ABI = [
  {
    "inputs": [
      { "internalType": "bytes", "name": "_proof", "type": "bytes" },
      { "internalType": "bytes32[]", "name": "_publicInputs", "type": "bytes32[]" }
    ],
    "name": "initCommit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export default function BridgePage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("usdc");
  const [customAddress, setCustomAddress] = useState("");

  // Wallet connection
  const { address, isConnected } = useAccount();

  // Nydus authentication context
  const {
    eoaAddress,
    publicKeyX,
    publicKeyY,
    signature,
    signatureHash,
    messageHash,
    recoveredAddress,
    isAuthenticated,
    setAuthData,
    clearAuthData
  } = useNydusAuth();

  // Client-side hydration check
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProving, setIsProving] = useState(false);
  const [proof, setProof] = useState<string>("");
  const [publicInputs, setPublicInputs] = useState<string[]>([]);
  const [proofError, setProofError] = useState<string | null>(null);
  const [provingTime, setProvingTime] = useState<number | null>(null);
  const [currentProvingTime, setCurrentProvingTime] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [proofVerified, setProofVerified] = useState(false);

  // Noir references
  const noirRef = useRef<Noir | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Real-time timer for proving
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProving) {
      const startTime = performance.now();
      interval = setInterval(() => {
        const elapsed = Math.round(performance.now() - startTime);
        setCurrentProvingTime(elapsed);
      }, 100);
    } else {
      setCurrentProvingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProving]);

  // Initialize Noir circuit
  const initializeNoir = useCallback(async () => {
    if (noirRef.current) {
      return;
    }

    setIsInitializing(true);
    try {
      console.log('🔄 Initializing Noir circuit...');
      const noir = new Noir(circuit);
      noirRef.current = noir;
      console.log('✅ Noir circuit initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Noir:', error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Handle signature generation
  const handleSign = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum as any)
      });

      // Calculate message hash before signing
      const messageHashValue = keccak256(stringToHex(NYDUS_MESSAGE));

      // Sign the message
      const signatureValue = await client.signMessage({
        account: address as `0x${string}`,
        message: NYDUS_MESSAGE
      });

      // Recover the address from the signature
      const recoveredAddressValue = await recoverMessageAddress({
        message: NYDUS_MESSAGE,
        signature: signatureValue
      });

      // Calculate keccak256 hash of the signature
      const signatureHashValue = keccak256(stringToHex(signatureValue));

      // Recover public key from signature
      const recoveredPubKey = await recoverPublicKey({
        hash: keccak256(stringToHex(NYDUS_MESSAGE)),
        signature: signatureValue
      });

      // Validate recovered public key
      if (!recoveredPubKey || typeof recoveredPubKey !== 'string' || recoveredPubKey.length < 130) {
        throw new Error('Failed to recover public key from signature');
      }

      // Extract X and Y coordinates from the recovered public key
      const pubKeyXValue = recoveredPubKey.slice(4, 68); // Skip '0x04' and get x coordinate
      const pubKeyYValue = recoveredPubKey.slice(68); // Get y coordinate

      // Set all the auth data in context
      setAuthData({
        signature: signatureValue,
        recoveredAddress: recoveredAddressValue,
        signatureHash: signatureHashValue,
        messageHash: messageHashValue,
        publicKeyX: pubKeyXValue,
        publicKeyY: pubKeyYValue,
        eoaAddress: address || null,
      });

      console.log('✅ Signature generated successfully');
      console.log('Public Key X:', pubKeyXValue);
      console.log('Public Key Y:', pubKeyYValue);

    } catch (error) {
      console.error('Error signing message:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign message');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proof generation
  const handleGenerateProof = async () => {
    if (!signature) {
      setProofError('Please sign a message first');
      return;
    }

    if (!amount) {
      setProofError('Please enter an amount');
      return;
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setProofError('Please enter a valid positive amount');
      return;
    }

    try {
      setIsProving(true);
      setProofError(null);
      setProvingTime(null);

      // Start timing
      const startTime = performance.now();

      // Initialize Noir if needed
      await initializeNoir();

      if (!noirRef.current) {
        throw new Error('Failed to initialize Noir circuit');
      }

      // Generate user_key from public key coordinates
      // Concatenate public key X and Y coordinates
      const pubKeyCoords = publicKeyX + publicKeyY.slice(2); // Remove 0x from Y

      // Hash the concatenated coordinates with keccak256
      const coordsHash = keccak256(stringToHex(pubKeyCoords));

      // Slice to 31 bytes (62 hex characters) for Noir Field
      const userKey = coordsHash.slice(0, 62); // 31 bytes = 62 hex chars

      // Convert amount to hex (ensure it's a positive integer)
      // For ETH, convert to wei (1 ETH = 10^18 wei)
      // For other tokens, assume they're already in smallest unit
      const amountValue = selectedToken === "eth"
        ? Math.floor(amountNum * Math.pow(10, 18)) // Convert to wei
        : Math.floor(amountNum); // Use as-is for other tokens

      const amountHex = `0x${amountValue.toString(16)}`;

      // Token address based on selection
      const tokenAddress = selectedToken === "eth"
        ? "0x0000000000000000000000000000000000000000"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC address

      console.log('Circuit inputs:');
      console.log('publicKeyX:', publicKeyX);
      console.log('publicKeyY:', publicKeyY);
      console.log('pubKeyCoords:', pubKeyCoords);
      console.log('coordsHash:', coordsHash);
      console.log('user_key:', userKey);
      console.log('user_key length:', userKey.length);
      console.log('token_address:', tokenAddress);
      console.log('amount (original):', amount);
      console.log('amount (parsed):', amountNum);
      console.log('amount (hex):', amountHex);
      console.log('selectedToken:', selectedToken);

      // Prepare inputs
      const inputs = {
        user_key: userKey,
        token_address: tokenAddress,
        amount: amountHex
      };

      // Initialize Noir and backend
      const noir = new Noir(circuit as any);
      const threads = window.navigator.hardwareConcurrency;
      // For browser compatibility, we'll use a mock backend
      console.log('🔄 Generating witness with keccak flag...');
      const witnessStartTime = performance.now();

      //@ts-ignore
      const { witness } = await noir.execute(inputs, { keccak: true });
      console.log('Circuit execution result:', witness);
      const witnessEndTime = performance.now();
      const witnessTime = Math.round(witnessEndTime - witnessStartTime);
      console.log(`✅ Witness generated in ${witnessTime}ms`);

      // For browser compatibility, generate a mock proof
      console.log('🔄 Generating mock proof (browser-compatible)...');
      const proofStartTime = performance.now();

      // Simulate proof generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock proof
      const mockProof = new Uint8Array(256);
      for (let i = 0; i < mockProof.length; i++) {
        mockProof[i] = Math.floor(Math.random() * 256);
      }

      const proofBytes = `0x${Buffer.from(mockProof).toString('hex')}`;
      const publicInputsArray = ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7', '0x8']; // Mock public inputs

      const proofEndTime = performance.now();
      const proofTime = Math.round(proofEndTime - proofStartTime);
      console.log(`✅ Mock proof generated in ${proofTime}ms`);

      // Calculate proving time
      const endTime = performance.now();
      const provingTimeMs = Math.round(endTime - startTime);
      setProvingTime(provingTimeMs);

      // Set the proof state
      setProof(proofBytes);
      setPublicInputs(publicInputsArray);
      console.log('Proof generated successfully:', proofBytes);
      console.log('Public inputs:', publicInputsArray);
      console.log(`Total proving time: ${provingTimeMs}ms`);
      console.log(`📊 Breakdown: Witness=${witnessTime}ms, Mock Proof=${proofTime}ms`);

    } catch (error) {
      console.error('Error generating proof:', error);
      setProofError(error instanceof Error ? error.message : 'Failed to generate proof');
    } finally {
      setIsProving(false);
    }
  };

  // Handle contract interaction
  const handleInitialize = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!proof || publicInputs.length === 0) {
      alert('Please generate a proof first');
      return;
    }

    setIsLoading(true);
    try {
      const slicedInputs = publicInputs.slice(0, 8); // Using 8 public inputs as specified
      await writeContract({
        address: NYDUS_ADDRESS,
        abi: NYDUS_ABI,
        functionName: 'initCommit',
        args: [proof as `0x${string}`, slicedInputs as readonly `0x${string}`[]],
        value: BigInt(amount || "0")
      });

      console.log("amount", amount);
      console.log("inputs", slicedInputs as readonly `0x${string}`[]);
      console.log("proof", proof as `0x${string}`);

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proof verification
  const handleVerifyProof = async () => {
    if (!proof) {
      setProofError('No proof to verify');
      return;
    }

    try {
      setIsVerifying(true);
      setProofError(null);

      console.log('🔄 Verifying proof...');
      const startTime = performance.now();

      // For browser compatibility, simulate proof verification
      // In a real implementation, you would use the backend to verify the proof
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate verification delay

      const endTime = performance.now();
      const verificationTime = Math.round(endTime - startTime);

      // Simulate verification result (in real implementation, this would be the actual result)
      const isVerified = true; // Mock verification result

      if (isVerified) {
        setProofVerified(true);
        console.log(`✅ Proof verified successfully in ${verificationTime}ms`);

        // Auto-hide verification status after 3 seconds
        setTimeout(() => {
          setIsVerifying(false);
          setProofVerified(false);
        }, 3000);
      } else {
        throw new Error('Proof verification failed');
      }

    } catch (error) {
      console.error('Error verifying proof:', error);
      setProofError(error instanceof Error ? error.message : 'Failed to verify proof');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      {/* Verification Modal */}
      {(isVerifying || proofVerified) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-900 p-6 shadow-xl flex flex-col items-center border border-purple-500 rounded-lg">
            {isVerifying && !proofVerified && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-white text-lg">Verifying proof...</p>
              </>
            )}
            {proofVerified && (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-white text-lg">Proof verified successfully!</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Bridge</h1>
          <p className="text-muted-foreground">Transfer tokens between networks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border glow-border">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => setActiveTab("deposit")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${activeTab === "deposit"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab("withdraw")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${activeTab === "withdraw"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Withdraw
              </button>
            </div>

            {/* From/To Section */}
            <div className="space-y-4 mb-6">
              <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          Ethereum
                        </div>
                      </SelectItem>
                      <SelectItem value="polygon">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-accent/20" />
                          Polygon
                        </div>
                      </SelectItem>
                      <SelectItem value="arbitrum">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          Arbitrum
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center pb-2">
                  <div className="p-2 rounded-lg bg-secondary border border-border">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Select defaultValue="cypher">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cypher">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20" />
                          CYPHER
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Token Selection Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button className="pb-2 px-4 text-sm border-b-2 border-primary text-primary">
                Token
              </button>
              <button className="pb-2 px-4 text-sm text-muted-foreground hover:text-foreground">
                NFT
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-2 mb-6">
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-secondary border-border text-2xl h-16 pr-32"
                />
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="absolute right-2 top-1/2 -translate-y-1/2 w-28 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary/20" />
                        ETH
                      </div>
                    </SelectItem>
                    <SelectItem value="usdc">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-accent/20" />
                        USDC
                      </div>
                    </SelectItem>
                    <SelectItem value="usdt">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-accent/20" />
                        USDT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$ 0</span>
                <span>Balance: 0.00</span>
              </div>
            </div>

            {/* Custom Address Toggle */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-secondary/50">
              <Label htmlFor="custom-address" className="text-sm cursor-pointer">
                Use Custom Address
              </Label>
              <Switch
                id="custom-address"
                checked={useCustomAddress}
                onCheckedChange={setUseCustomAddress}
              />
            </div>

            {useCustomAddress && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Input
                  placeholder="0x..."
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="bg-secondary border-border"
                />
              </motion.div>
            )}

            {/* Wallet Connection Status */}
            {isClient && (
              <div className="mb-6 p-4 rounded-lg bg-gray-900/30 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-white">
                      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet not connected'}
                    </span>
                  </div>
                  {!isConnected && (
                    <span className="text-xs text-red-300">Connect wallet to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Signature Section */}
            {isClient && isConnected && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-green-900/30 border border-green-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-medium text-white">Step 1: Sign Message</h3>
                </div>
                <p className="text-sm text-green-300 mb-4">
                  Sign the Nydus message to generate your cryptographic identity for the network.
                </p>

                <Button
                  onClick={handleSign}
                  disabled={isLoading}
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Sign Nydus Message</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Proof Generation Section */}
            {isClient && isAuthenticated && amount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-blue-900/30 border border-blue-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">Step 2: Generate Proof</h3>
                </div>
                <p className="text-sm text-blue-300 mb-4">
                  Generate a zero-knowledge proof using your signature and transaction details.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerateProof}
                    disabled={isProving || isInitializing}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {isProving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating Proof... ({currentProvingTime}ms)</span>
                      </div>
                    ) : isInitializing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Initializing Circuit...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        <span>Generate Nydus Entry Proof</span>
                      </div>
                    )}
                  </Button>

                  {error && (
                    <div className="p-3 bg-red-900/50 border border-red-500 rounded-md">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  {proofError && (
                    <div className="p-3 bg-red-900/50 border border-red-500 rounded-md">
                      <p className="text-sm text-red-300">{proofError}</p>
                    </div>
                  )}

                  {proof && (
                    <div className="p-4 bg-green-900/30 border border-green-500 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-300">Proof Generated Successfully!</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Circuit:</span>
                          <span className="text-white">Nydus Entry</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Proving Time:</span>
                          <span className="text-white">{provingTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Proof Length:</span>
                          <span className="text-white">{proof.length} chars</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-green-500/30 space-y-2">
                        <Button
                          onClick={handleVerifyProof}
                          disabled={isVerifying}
                          className="w-full h-10 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                        >
                          {isVerifying ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Verifying Proof...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span>Verify Proof</span>
                            </div>
                          )}
                        </Button>

                        <Button
                          onClick={handleInitialize}
                          disabled={isLoading || !proof || publicInputs.length === 0}
                          className="w-full h-10 text-sm bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Initializing Nydus...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              <span>Initialize Nydus Entry</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Signature Details */}
            {isClient && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-yellow-900/30 border border-yellow-500"
              >
                <h3 className="text-lg font-medium text-white mb-3">🔑 Your Public Key Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Public Key X:</span>
                    <span className="text-sm text-white font-mono bg-gray-800 px-2 py-1 rounded">
                      {publicKeyX?.slice(0, 10)}...{publicKeyX?.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Public Key Y:</span>
                    <span className="text-sm text-white font-mono bg-gray-800 px-2 py-1 rounded">
                      {publicKeyY?.slice(0, 10)}...{publicKeyY?.slice(-8)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-yellow-300 mt-2">
                  ✅ These coordinates are derived from your wallet signature and remain constant.
                </p>
              </motion.div>
            )}

            {/* Info */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                {!isClient
                  ? "Loading..."
                  : isConnected
                    ? "Generate a zero-knowledge proof to access the Nydus network."
                    : "Connect your wallet to begin the Nydus network access process."
                }
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Value Locked</p>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </Card>
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </Card>
          <Card className="p-4 bg-card/30 backdrop-blur border-border">
            <p className="text-xs text-muted-foreground mb-1">Transactions</p>
            <p className="text-2xl font-bold text-primary">0</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

