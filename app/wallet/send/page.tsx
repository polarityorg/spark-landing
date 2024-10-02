"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import { Input } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, useWalletStore } from "../store";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const MAX_AMOUNT_CENTS = 99999999; // $999,999.99

const ToStep = memo(
  ({
    recipient,
    setRecipient,
    inputType,
    toggleInputType,
  }: {
    recipient: string;
    setRecipient: (value: string) => void;
    inputType: "phone" | "publicKey";
    toggleInputType: () => void;
  }) => {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6">
          Who will receive
          <br />
          the money?
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.3 }}>
          {inputType === "phone" ? (
            <PhoneInput value={recipient} onChange={setRecipient} />
          ) : (
            <Input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter public key"
              className="w-full px-2 py-6 border rounded-lg shadow-none"
            />
          )}
        </motion.div>
        <Button
          variant="link"
          onClick={toggleInputType}
          className="mt-2 text-sm text-gray-600 self-start p-0">
          {inputType === "phone"
            ? "Or send to a public key"
            : "Or send to a phone number"}
        </Button>
      </div>
    );
  }
);

ToStep.displayName = "ToStep";

export default function SendPage() {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const availableBalance = useWalletStore((state) => state.balance);
  const setBalance = useWalletStore((state) => state.setBalance);
  const setActivity = useWalletStore((state) => state.setActivity);
  const activity = useWalletStore((state) => state.activity);
  const router = useRouter();

  const [amountCents, setAmountCents] = useState(0);
  const [step, setStep] = useState<"amount" | "to" | "summary" | "sent">(
    "amount"
  );
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inputType, setInputType] = useState<"phone" | "publicKey">("phone");

  useEffect(() => {
    if (!mnemonic) {
      router.replace("/");
    }
  }, [mnemonic, router]);

  const handleNumberClick = useCallback((digit: string) => {
    setAmountCents((prevAmount) =>
      Math.min(prevAmount * 10 + parseInt(digit), MAX_AMOUNT_CENTS)
    );
  }, []);

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

  const handleUseMax = useCallback(() => {
    setAmountCents(
      Math.min(Math.round(availableBalance * 100), MAX_AMOUNT_CENTS)
    );
  }, [availableBalance]);

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

  const handleContinueToSummary = () => {
    setStep("summary");
  };

  const handleSendMoney = () => {
    setIsSending(true);
    // Simulate sending money
    setTimeout(() => {
      const newBalance = availableBalance - amountCents / 100;
      setBalance(newBalance);

      const newTransaction: Transaction = {
        id: uuidv4(),
        type: "sent",
        amount: amountCents / 100,
        from: recipient,
        date: new Date(),
      };

      // Update the activity list with the new transaction
      setActivity([newTransaction, ...activity]);

      setIsSending(false);
      setStep("sent");
    }, 1000);
  };

  const handleBack = () => {
    if (step === "to") {
      setStep("amount");
    } else if (step === "summary") {
      setStep("to");
    }
  };

  // Confirmation step components
  const SummaryStep = ({
    amountCents,
    recipient,
  }: {
    amountCents: number;
    recipient: string;
  }) => {
    const formatRecipient = (value: string) => {
      const phonePattern = /^\+\d{10,}$/;
      if (phonePattern.test(value)) {
        return value.replace(/^(\+\d)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4");
      }
      return value;
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow flex flex-col justify-center items-center mb-8">
          <p className="text-xl font-bold mb-2">You are Sending</p>
          <p className="text-6xl font-bold mb-4">
            <span className="tabular-nums">
              $
              {(amountCents / 100).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">To</p>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-lg font-bold">{formatRecipient(recipient)}</p>
          </div>
        </div>
        <div className="border border-gray-300 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-500 font-bold">
            *Transfers cannot be reversed
          </p>
        </div>
      </div>
    );
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
        className="flex-grow flex flex-col justify-between px-6 pt-8">
        {step === "amount" && (
          <div className="flex flex-col h-full">
            {/* Center the amount display */}
            <div className="flex-grow flex flex-col justify-center items-center">
              <p className="text-6xl font-bold mb-4">
                <span className="tabular-nums">
                  $
                  {(amountCents / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
              <div className="flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                <p className="text-base font-bold text-gray-700 px-3 py-2">
                  Available: ${availableBalance.toFixed(2)}
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
          // {{ edit_3: Use the external memoized ToStep component }}
          <ToStep
            recipient={recipient}
            setRecipient={setRecipient}
            inputType={inputType}
            toggleInputType={toggleInputType}
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
        className="p-6 mb-16">
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
