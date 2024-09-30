"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/phone-input";
import { cn } from "@/lib/utils"; // Make sure you have this utility function

const ToStep = ({
  phoneNumber,
  setPhoneNumber,
}: {
  onContinue: (phoneNumber: string) => void;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-6">
        Who will receive
        <br />
        the money?
      </h2>
      <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
    </div>
  );
};

const SummaryStep = ({
  amountCents,
  phoneNumber,
}: {
  amountCents: number;
  phoneNumber: string;
}) => {
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
          <p className="text-lg font-bold">
            {phoneNumber.replace(
              /^(\+\d)(\d{3})(\d{3})(\d{4})$/,
              "$1 ($2) $3-$4"
            )}
          </p>
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

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const [amountCents, setAmountCents] = useState(0);
  const [step, setStep] = useState<"to" | "summary" | "sent">("to");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const amount = searchParams.get("amount");
    if (amount) {
      setAmountCents(parseInt(amount, 10));
    }
  }, [searchParams]);

  const handleContinue = (number: string) => {
    setPhoneNumber(number);
    setStep("summary");
  };

  const handleBack = () => {
    if (step === "summary") {
      setStep("to");
    }
  };

  const handleSendMoney = () => {
    setIsSending(true);
    // Simulate sending money
    setTimeout(() => {
      setIsSending(false);
      setStep("sent");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          {step === "to" || step === "sent" ? (
            <Link href="/wallet/send" aria-label="Back to send">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" strokeWidth={4} />
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Back to To step">
              <ChevronLeft className="h-6 w-6" strokeWidth={4} />
            </Button>
          )}
          <h1 className="text-xl font-bold">
            {step === "to" ? "To" : step === "summary" ? "Summary" : "Sent"}
          </h1>
          <div className="w-10" aria-hidden="true" />
        </div>
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
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-grow flex flex-col px-6 pt-8">
        {step === "to" ? (
          <ToStep
            onContinue={handleContinue}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        ) : step === "summary" ? (
          <SummaryStep amountCents={amountCents} phoneNumber={phoneNumber} />
        ) : (
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 mb-16">
        <motion.div
          className="relative overflow-hidden mx-auto"
          initial={{ width: "100%" }}
          animate={{
            width: isSending ? 56 : "100%",
            borderRadius: isSending ? 28 : 24,
          }}
          transition={{ duration: 0.3 }}>
          {step === "sent" ? (
            <Link href="/wallet" className="block w-full">
              <Button className="w-full h-14 text-lg font-bold shadow-none">
                Go Home
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() =>
                step === "to" ? handleContinue(phoneNumber) : handleSendMoney()
              }
              className={cn(
                "w-full h-14 text-lg font-bold shadow-none",
                isSending && "pointer-events-none"
              )}
              disabled={step === "to" && phoneNumber.length < 10}>
              <span
                className={cn("transition-opacity", isSending && "opacity-0")}>
                {step === "to" ? "Continue" : "Send Money"}
              </span>
              {isSending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </Button>
          )}
        </motion.div>
      </motion.footer>
    </div>
  );
}
