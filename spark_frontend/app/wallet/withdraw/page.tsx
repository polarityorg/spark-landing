"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Transaction, useWalletStore } from "../store";
import {
  ReceiverStep,
  SummaryStep,
  AmountStep,
} from "@/components/WithdrawSteps"; // Import AmountStep
import { decode } from "@gandlaf21/bolt11-decode";
import { v4 as uuidv4 } from "uuid";
import { walletSDK } from "../sdk";

export default function WithdrawPage() {
  const [step, setStep] = useState<"receiver" | "amount" | "summary" | "sent">(
    "receiver"
  ); // Include "amount" step
  const [receiver, setReceiver] = useState("");
  const [amountCents, setAmountCents] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const availableBalance = useWalletStore((state) => state.balance);
  const setBalance = useWalletStore((state) => state.setBalance);
  const setActivity = useWalletStore((state) => state.setActivity);
  const activity = useWalletStore((state) => state.activity);
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const btcPrice = useWalletStore((state) => state.btcPrice);

  // State for amount input by the user
  const [userInputAmountCents, setUserInputAmountCents] = useState<number>(0); // Default to 0

  const handleContinueFromInvoice = async () => {
    setError("");
    if (receiver.includes("@")) {
      // If UMA address, move to amount step
      setStep("amount");
    } else {
      try {
        const decodedInvoice = decode(receiver);

        const amountSection = decodedInvoice.sections.find(
          (section) => section.name === "amount"
        );

        if (!amountSection || !amountSection.value) {
          setError("Invoice does not specify an amount.");
          return;
        }

        const amountSats = BigInt(amountSection.value / 1000);
        const amountInDollars = (Number(amountSats) / 100_000_000) * btcPrice;
        setAmountCents(Math.round(amountInDollars * 100));
        setStep("summary");
      } catch (error) {
        console.error(error);
        setError("Please enter a valid Lightning invoice.");
      }
    }
  };

  const handleContinueFromAmount = async () => {
    setError("");
    if (userInputAmountCents === null || userInputAmountCents <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    try {
      // Convert cents to satoshis
      const amountSats = BigInt(
        Math.round((userInputAmountCents / 100 / btcPrice) * 100000000)
      );
      const invoice = await walletSDK.decodeUma(receiver, amountSats);
      const decodedInvoice = decode(invoice);
      setReceiver(invoice);

      const amountSection = decodedInvoice.sections.find(
        (section) => section.name === "amount"
      );

      if (!amountSection || !amountSection.value) {
        setError("Invoice does not specify an amount.");
        return;
      }

      const amountSatsDecoded = BigInt(amountSection.value / 1000);
      const amountInDollars =
        (Number(amountSatsDecoded) / 100_000_000) * btcPrice;
      setAmountCents(Math.round(amountInDollars * 100));

      setStep("summary");
    } catch (error) {
      console.error(error);
      setError("Failed to decode UMA.");
    }
  };

  const handleSendMoney = async () => {
    setError("");
    const MIN_DURATION = 500;
    const startTime = Date.now();

    if (availableBalance < amountCents / 100) {
      setError("Insufficient balance.");
      return;
    }
    setIsSending(true);
    try {
      // Create the Spark client
      await walletSDK.createSparkClient(mnemonic!);
      const balance = await walletSDK.getBalance();

      setBalance(Number(balance));
      // Pay the Lightning invoice
      await walletSDK.payLightningInvoice(receiver);
      // Update balance and activity
      const newBalance = availableBalance - amountCents / 100;
      setBalance(newBalance);

      const newTransaction: Transaction = {
        id: uuidv4(),
        type: "withdraw",
        amount: amountCents / 100,
        to: receiver,
        date: new Date(),
      };

      setActivity([newTransaction, ...activity]);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_DURATION - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          setIsSending(false);
          setStep("sent");
        }, remainingTime);
      } else {
        setIsSending(false);
        setStep("sent");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to send payment.");
      setIsSending(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "summary") {
      if (receiver.includes("@")) {
        setStep("amount");
      } else {
        setStep("receiver");
      }
    } else if (step === "amount") {
      setStep("receiver");
    }
  };

  const handleUseMax = () => {
    const balanceInUSDInCents = Math.floor(
      (availableBalance / 100000000) * btcPrice * 100
    );
    const MAX_AMOUNT_CENTS = Math.min(99999999, balanceInUSDInCents);
    setUserInputAmountCents(MAX_AMOUNT_CENTS);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between p-6">
          {step === "receiver" || step === "sent" ? (
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
            {step === "receiver"
              ? "Withdraw"
              : step === "amount"
                ? "Enter Amount"
                : step === "summary"
                  ? "Summary"
                  : "Success"}
          </h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {step !== "receiver" && (
          <div className="h-0.5 bg-gray-200 w-full">
            <motion.div
              className="h-0.5 bg-black"
              initial={{ width: "33%" }}
              animate={{
                width:
                  step === "amount"
                    ? "33%"
                    : step === "summary"
                      ? "66%"
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
        {step === "receiver" && (
          <ReceiverStep
            receiver={receiver}
            setReceiver={setReceiver}
            error={error}
          />
        )}

        {step === "amount" && (
          <AmountStep
            amountCents={userInputAmountCents}
            setAmountCents={setUserInputAmountCents}
            availableBalance={availableBalance}
            btcPrice={btcPrice}
            handleUseMax={handleUseMax}
            handleBack={handleBack}
          />
        )}

        {step === "summary" && (
          <SummaryStep amountCents={amountCents} recipient={receiver} />
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
        {step === "receiver" && (
          <Button
            onClick={handleContinueFromInvoice}
            className="w-full h-14 text-lg font-bold shadow-none rounded-full"
            disabled={!receiver}>
            Continue
          </Button>
        )}

        {step === "amount" && (
          <Button
            onClick={handleContinueFromAmount}
            className="w-full h-14 text-lg font-bold shadow-none rounded-full"
            disabled={!userInputAmountCents || userInputAmountCents <= 0}>
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
