"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletStore } from "../store";
import { useRouter } from "next/navigation";

import { isValidPhoneNumber, isValidPublicKey } from "@/utils/validation";
import { ToStep, SummaryStep } from "@/components/SendSteps";
import { walletSDK } from "../sdk";
import { toast } from "sonner";
import { notifyReceiverTransfer } from "js-sdk/src/spark-client";

export default function SendPage() {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const availableBalance = useWalletStore((state) => state.balance);
  const btcPrice = useWalletStore((state) => state.btcPrice); // Imported btcPrice
  const setBalance = useWalletStore((state) => state.setBalance);
  const router = useRouter();

  const [amountCents, setAmountCents] = useState(0);
  const [step, setStep] = useState<"amount" | "to" | "summary" | "sent">(
    "amount"
  );
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inputType, setInputType] = useState<"phone" | "publicKey">("phone");
  const [, setError] = useState("");

  useEffect(() => {
    if (!mnemonic) {
      router.replace("/");
    }
  }, [mnemonic, router]);

  const handleNumberClick = useCallback(
    (digit: string) => {
      setAmountCents((prevAmount) =>
        Math.min(prevAmount * 10 + parseInt(digit), MAX_AMOUNT_CENTS)
      );
    },
    [availableBalance, btcPrice]
  );

  const handleDelete = useCallback(() => {
    setAmountCents((prevAmount) => Math.floor(prevAmount / 10));
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        handleNumberClick(event.key);
      } else if (event.key === "Backspace") {
        handleDelete();
      }
    },
    [handleNumberClick, handleDelete]
  );

  useEffect(() => {
    if (step === "amount") {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, step]);

  // Dynamically calculate MAX_AMOUNT_CENTS based on available balance and btcPrice
  const balanceInUSDInCents = Math.floor(
    (availableBalance / 100000000) * btcPrice * 100
  );
  const MAX_AMOUNT_CENTS = Math.min(99999999, balanceInUSDInCents);

  const handleUseMax = useCallback(() => {
    setAmountCents(MAX_AMOUNT_CENTS);
  }, [MAX_AMOUNT_CENTS]);

  const toggleInputType = useCallback(() => {
    setInputType((prevType) => (prevType === "phone" ? "publicKey" : "phone"));
    setRecipient("");
  }, []);

  const isSendDisabled = (balance: number, amount: number) =>
    amount === 0 || amount / 100 > balance;

  // Handlers to manage the flow
  const handleContinueToRecipient = () => {
    setStep("to");
  };

  const isValidRecipient = (recipient: string): boolean => {
    return inputType === "phone"
      ? isValidPhoneNumber(recipient)
      : isValidPublicKey(recipient);
  };

  const handleContinueToSummary = () => {
    if (!isValidRecipient(recipient)) {
      setError("Please enter a valid recipient.");
      toast.error("Please enter a valid recipient.");
      return;
    }
    setError("");
    setStep("summary");
  };

  const handleSendMoney = async () => {
    if (availableBalance < amountCents / 100) {
      setError("Insufficient balance.");
      return;
    }
    setIsSending(true);
    try {
      // Create the Spark client
      await walletSDK.createSparkClient(mnemonic!);
      // now get balance
      const balance = await walletSDK.getBalance();
      console.log("Balance:", balance);
      setBalance(Number(balance));

      // Convert USD cents to USD dollars
      const amountInUsd = amountCents / 100;

      // Convert USD to sats (assuming walletSDK.usdToSats returns BigInt)
      // get the usd price of bitcoin from the coingecko api
      let btcPriceFetched;
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await response.json();
        btcPriceFetched = data.bitcoin.usd;
      } catch (error) {
        console.error(
          "Failed to fetch Bitcoin price, using fallback value:",
          error
        );
        btcPriceFetched = 50000;
      }
      const amountInSats = BigInt(
        Math.round((amountInUsd / btcPriceFetched) * 100000000)
      );

      let recipientPubKey: string;

      if (inputType === "publicKey") {
        recipientPubKey = recipient;
      } else {
        // Fetch the public key for the given phone number
        const pubKeyResponse = await fetch(
          "https://spark-demo.dev.dev.sparkinfra.net/spark/user_pubkey",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone_number: recipient }),
          }
        );

        if (!pubKeyResponse.ok) {
          throw new Error(
            "Failed to retrieve public key for the provided phone number."
          );
        }

        const pubKeyData = await pubKeyResponse.json();
        recipientPubKey = pubKeyData.user_pubkey;
      }

      console.log("amountInSats:", amountInSats);
      console.log("recipientPubKey:", recipientPubKey);
      // Perform the transfer
      await walletSDK.transfer(amountInSats, recipientPubKey);

      // Update the balance
      const updatedBalance = await walletSDK.getBalance();
      setBalance(Number(updatedBalance));
      // **Notify Receiver if Recipient is Identified by Phone Number**
      if (inputType === "phone") {
        notifyReceiverTransfer("spark-demo.dev.dev.sparkinfra.net/spark", {
          receiver_phone_number: recipient,
          currency: "USD",
          amount: Number(amountInUsd),
        });
      }
    } catch (error) {
      console.error("Error sending funds:", error);
      // Handle error (e.g., show error message to user)
      setError("Failed to send funds. Please try again.");
      toast.error("Failed to send funds. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSending(false);
        setStep("sent");
      }, 500);
    }
  };

  const handleBack = () => {
    if (step === "to") {
      setStep("amount");
    } else if (step === "summary") {
      setStep("to");
    }
  };

  // Add a utility function to format USD
  const formatUSD = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (!mnemonic) {
    return null; // Optionally, render a loading indicator
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between p-6">
          {step === "amount" || step === "sent" ? (
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
            {step === "amount"
              ? "Send"
              : step === "to"
                ? "To"
                : step === "summary"
                  ? "Summary"
                  : "Sent"}
          </h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Show the progress bar only after the first page */}
        {step !== "amount" && (
          <div className="h-0.5 bg-gray-200 w-full">
            <motion.div
              className="h-0.5 bg-black"
              initial={{ width: "33.33%" }}
              animate={{
                width:
                  step === "to"
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
        {step === "amount" && (
          <div className="flex flex-col h-full">
            {/* Center the amount display */}
            <div className="flex-grow flex flex-col justify-center items-center">
              <p className="text-6xl font-bold mb-4">
                <span className="tabular-nums">
                  {formatUSD(amountCents / 100)}
                </span>
              </p>
              <div className="flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                <p className="text-base font-bold text-gray-700 px-3 py-2">
                  Available:{" "}
                  {formatUSD((availableBalance / 100000000) * btcPrice)}
                </p>
                <Button
                  variant="outline"
                  onClick={handleUseMax}
                  className="text-sm font-bold py-2 px-3 h-full rounded-full border-l border border-gray-300">
                  Use Max
                </Button>
              </div>
            </div>

            <div className="w-full max-w-xs mx-auto">
              <div className="grid grid-cols-3 gap-x-16 gap-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "delete"].map(
                  (item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="aspect-square text-2xl font-bold p-0 h-auto"
                      onClick={() => {
                        if (item === "delete") {
                          handleDelete();
                        } else if (item !== null) {
                          handleNumberClick(item.toString());
                        }
                      }}
                      disabled={item === null}
                      aria-label={
                        item === "delete" ? "Delete" : item?.toString()
                      }>
                      {item === "delete" ? (
                        <ChevronLeft className="h-6 w-6" strokeWidth={4} />
                      ) : (
                        item
                      )}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {step === "to" && (
          <ToStep
            recipient={recipient}
            setRecipient={setRecipient}
            inputType={inputType}
            toggleInputType={toggleInputType}
            setError={setError}
          />
        )}

        {step === "summary" && (
          <SummaryStep amountCents={amountCents} recipient={recipient} />
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
        {/* Adjust footer buttons based on step */}
        {step === "amount" && (
          <div className="flex gap-4">
            <Button
              variant="default"
              className="flex-1 w-full py-6 text-lg rounded-full font-bold shadow-none"
              disabled={isSendDisabled(availableBalance, amountCents)}
              onClick={handleContinueToRecipient}>
              Send
            </Button>
          </div>
        )}

        {step === "to" && (
          <Button
            onClick={handleContinueToSummary}
            className="w-full h-14 text-lg font-bold shadow-none rounded-full"
            disabled={recipient.length < 1}>
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
                Send Money
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
