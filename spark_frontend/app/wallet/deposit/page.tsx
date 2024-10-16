"use client";

import Link from "next/link";
import { X, Copy } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { walletSDK } from "../sdk";
import { useWalletStore } from "../store";
import { AmountInput } from "@/components/AmountInput";

export default function DepositPage() {
  const [copyStatus, setCopyStatus] = useState("");
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"amount" | "invoice">("amount");
  const [amountCents, setAmountCents] = useState(0);
  const [error, setError] = useState("");

  const mnemonic = useWalletStore((state) => state.mnemonic);
  const btcPrice = useWalletStore((state) => state.btcPrice);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    });
  };

  const handleContinueFromAmount = async () => {
    if (amountCents <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create the Spark client
      await walletSDK.createSparkClient(mnemonic!);

      // Convert USD amount to sats
      const amountSats = BigInt(
        Math.floor((amountCents / 100 / btcPrice) * 1e8)
      );

      // Create the Lightning invoice
      const newInvoice = await walletSDK.createLightningInvoice(
        amountSats,
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
      <div className="min-h-screen bg-white flex flex-col font-sans">
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
            <div className="loader"></div>
            <p className="text-center text-gray-600 font-bold text-lg">
              Loading invoice...
            </p>
          </div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center mb-20">
        <Link href="/wallet" aria-label="Back to wallet">
          <X className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold">Deposit</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center">
        {step === "amount" ? (
          <>
            <AmountInput
              amountCents={amountCents}
              setAmountCents={setAmountCents}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
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

      {/* Footer */}
      {step === "amount" && (
        <motion.footer
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
          <Button
            onClick={handleContinueFromAmount}
            className="w-full py-6 font-bold text-lg rounded-full"
            disabled={loading}>
            {loading ? "Creating Invoice..." : "Continue"}
          </Button>
        </motion.footer>
      )}
    </div>
  );
}
