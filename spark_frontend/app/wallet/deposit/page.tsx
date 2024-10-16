"use client";

import Link from "next/link";
import { X, Copy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { walletSDK } from "../sdk";
import { useWalletStore } from "../store";

export default function DepositPage() {
  const [copyStatus, setCopyStatus] = useState("");
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"amount" | "invoice">("amount");
  const [amountSats, setAmountSats] = useState("");
  const [error, setError] = useState("");

  const mnemonic = useWalletStore((state) => state.mnemonic);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    });
  };

  const handleContinueFromAmount = async () => {
    if (!amountSats || isNaN(Number(amountSats)) || Number(amountSats) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create the Spark client
      await walletSDK.createSparkClient(mnemonic!);

      // Create the Lightning invoice
      const newInvoice = await walletSDK.createLightningInvoice(
        BigInt(Number(amountSats)),
        3,
        5
      );
      setInvoice(newInvoice);
      setStep("invoice");
    } catch (error) {
      console.error(error);
      setError("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const qrData = `lightning:${invoice}`;

  if (loading) {
    // Return loading state
    return (
      <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between p-6">
          <Link href="/wallet" aria-label="Back to wallet">
            <X className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl font-bold">Deposit</h1>
          <div className="w-6 h-6" aria-hidden="true" />
        </motion.header>
        {/* Loading Indicator */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-grow flex flex-col justify-center items-center px-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-center text-gray-600 font-bold text-lg">
              Loading invoice...
            </p>
          </div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between p-6">
        <Link href="/wallet" aria-label="Back to wallet">
          <X className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold">Deposit</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow flex flex-col justify-center items-center px-6">
        {step === "amount" ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Enter Deposit Amount</h2>
            <Input
              type="number"
              placeholder="Amount in sats"
              value={amountSats}
              onChange={(e) => setAmountSats(e.target.value)}
              className="mt-4 rounded-lg shadow-none px-4 py-6 font-bold"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <Button
              onClick={handleContinueFromAmount}
              className="mt-6 w-full h-14 text-lg font-bold shadow-none rounded-full"
              disabled={loading}>
              {loading ? "Creating Invoice..." : "Continue"}
            </Button>
          </>
        ) : (
          <>
            <p className="mb-6 text-center text-gray-600 font-bold">
              Scan this QR code to deposit funds
            </p>
            <div className="bg-white p-4 rounded-3xl border border-gray-200">
              <QRCode
                value={qrData}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div className="mt-4 w-full">
              <Button
                onClick={() => copyToClipboard(invoice)}
                className="flex items-center px-3 py-2 w-full">
                <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate font-bold">
                  {copyStatus || "Copy Invoice"}
                </span>
              </Button>
            </div>
          </>
        )}
      </motion.main>
    </div>
  );
}
