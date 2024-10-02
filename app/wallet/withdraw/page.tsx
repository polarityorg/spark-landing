"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, useWalletStore } from "../store";
import {
  AddressStep,
  AmountStep,
  SummaryStep,
} from "@/components/WithdrawSteps"; // Create this new component
import { decodeLightningInvoice } from "@/utils/lightning"; // Dummy decoder
import { isValidBitcoinAddress } from "@/utils/validation"; // Address validator
import { v4 as uuidv4 } from "uuid";

export default function WithdrawPage() {
  const [step, setStep] = useState<"address" | "amount" | "summary" | "sent">(
    "address"
  );
  const [address, setAddress] = useState("");
  const [amountCents, setAmountCents] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const availableBalance = useWalletStore((state) => state.balance);
  const setBalance = useWalletStore((state) => state.setBalance);
  const setActivity = useWalletStore((state) => state.setActivity);
  const activity = useWalletStore((state) => state.activity);

  const handleContinueFromAddress = () => {
    if (address.startsWith("lnbc") || address.startsWith("LNBC")) {
      // Decode the Lightning invoice (dummy decoding for now)
      const decodedInvoice = decodeLightningInvoice(address);
      if (decodedInvoice.amount === 0) {
        setStep("amount");
      } else {
        setAmountCents(decodedInvoice.amount * 100); // Assuming amount is in dollars
        setStep("summary");
      }
    } else if (isValidBitcoinAddress(address)) {
      setStep("amount");
    } else {
      setError("Please enter a valid Bitcoin address or LN invoice.");
    }
  };

  const handleSendMoney = () => {
    if (availableBalance < amountCents / 100) {
      setError("Insufficient balance.");
      return;
    }
    setIsSending(true);
    // Simulate sending money
    setTimeout(() => {
      const newBalance = availableBalance - amountCents / 100;
      setBalance(newBalance);

      const newTransaction: Transaction = {
        id: uuidv4(),
        type: "withdraw",
        amount: amountCents / 100,
        to: address,
        date: new Date(Date.now()),
      };

      // Update the activity list with the new transaction
      setActivity([newTransaction, ...activity]);

      setIsSending(false);
      setStep("sent");
    }, 1000);
  };

  const handleBack = () => {
    if (step === "amount") {
      setStep("address");
    } else if (step === "summary") {
      if (address.startsWith("lnbc") || address.startsWith("LNBC")) {
        const decodedInvoice = decodeLightningInvoice(address);
        if (decodedInvoice.amount === 0) {
          setStep("amount");
        } else {
          setStep("address");
        }
      } else {
        setStep("amount");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between p-6">
          {step === "address" || step === "sent" ? (
            <Link href="/wallet" aria-label="Back to wallet">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" strokeWidth={4} />
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Go back">
              <ChevronLeft className="h-6 w-6" strokeWidth={4} />
            </Button>
          )}
          <h1 className="text-xl font-bold">
            {step === "address"
              ? "Withdraw"
              : step === "amount"
              ? "Amount"
              : step === "summary"
              ? "Summary"
              : "Success"}
          </h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Progress bar */}
        {step !== "address" && (
          <div className="h-0.5 bg-gray-200 w-full">
            <motion.div
              className="h-0.5 bg-black"
              initial={{ width: "33.33%" }}
              animate={{
                width:
                  step === "amount"
                    ? "33.33%"
                    : step === "summary"
                    ? "66.66%"
                    : "100%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow flex flex-col justify-between px-6 py-8">
        {step === "address" && (
          <AddressStep
            address={address}
            setAddress={setAddress}
            error={error}
          />
        )}

        {step === "amount" && (
          <AmountStep
            amountCents={amountCents}
            setAmountCents={setAmountCents}
            availableBalance={availableBalance}
          />
        )}

        {step === "summary" && (
          <SummaryStep amountCents={amountCents} recipient={address} />
        )}

        {step === "sent" && (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="rounded-full bg-black p-3 mb-4">
                <Check className="h-8 w-8 text-white" strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-bold text-center">
                Sent ${(amountCents / 100).toFixed(2)}
              </h2>
            </div>
          </div>
        )}
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 mb-8 pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        {/* Footer buttons based on step */}
        {step === "address" && (
          <Button
            onClick={handleContinueFromAddress}
            className="w-full h-14 text-lg font-bold shadow-none rounded-full"
            disabled={!address}>
            Continue
          </Button>
        )}

        {step === "amount" && (
          <Button
            onClick={() => setStep("summary")}
            className="w-full h-14 text-lg font-bold shadow-none rounded-full"
            disabled={
              amountCents === 0 || amountCents / 100 > availableBalance
            }>
            Continue
          </Button>
        )}

        {step === "summary" && (
          <motion.div
            className="relative overflow-hidden mx-auto"
            initial={{ width: "100%" }}
            animate={{
              width: isSending ? 56 : "100%",
              borderRadius: isSending ? 28 : 24,
            }}
            transition={{ duration: 0.3 }}>
            <Button
              onClick={handleSendMoney}
              className={cn(
                "w-full h-14 text-lg font-bold shadow-none rounded-full",
                isSending && "pointer-events-none"
              )}>
              <span
                className={cn("transition-opacity", isSending && "opacity-0")}>
                Withdraw
              </span>
              {isSending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </Button>
          </motion.div>
        )}

        {step === "sent" && (
          <Link href="/wallet" className="block w-full">
            <Button className="w-full h-14 text-lg font-bold shadow-none rounded-full">
              Go Home
            </Button>
          </Link>
        )}
      </motion.footer>
    </div>
  );
}
