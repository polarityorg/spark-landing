"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_AMOUNT_CENTS = 99999999; // $999,999.99

export default function SendRequestPage() {
  const [amountCents, setAmountCents] = useState(0);
  const availableBalance = 0.1;

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
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleUseMax = useCallback(() => {
    setAmountCents(
      Math.min(Math.round(availableBalance * 100), MAX_AMOUNT_CENTS)
    );
  }, [availableBalance]);

  const isRequestDisabled = (balance: number, amount: number) =>
    balance === 0 || amount === 0;
  const isSendDisabled = (balance: number, amount: number) =>
    isRequestDisabled(balance, amount) || amount / 100 > balance;

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-6">
        <Link href="/wallet" aria-label="Back to wallet">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" strokeWidth={4} />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Send / Request</h1>
        <div className="w-10" aria-hidden="true" />
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col justify-between px-6 py-8">
        <div className="flex-grow flex flex-col justify-center items-center mb-8">
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
                  aria-label={item === "delete" ? "Delete" : item?.toString()}>
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
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 mb-12">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-6 text-lg rounded-3xl font-bold"
            disabled={isRequestDisabled(availableBalance, amountCents)}>
            Request
          </Button>
          <Button
            variant="default"
            className="flex-1 py-6 text-lg rounded-3xl font-bold"
            disabled={isSendDisabled(availableBalance, amountCents)}>
            Send
          </Button>
        </div>
      </motion.footer>
    </div>
  );
}
