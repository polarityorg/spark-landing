"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { walletSDK } from "../sdk";
import { useWalletStore } from "../store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function ImportWalletPage() {
  const router = useRouter();
  const setMnemonic = useWalletStore((state) => state.setMnemonic);
  const setPubkey = useWalletStore((state) => state.setPubkey);
  const setPhoneState = useWalletStore((state) => state.setPhoneNumber);
  const [mnemonic, setMnemonicInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"mnemonic" | "phone" | "otp">("mnemonic");
  const [otp, setOtp] = useState("");

  const handleContinue = () => {
    if (step === "mnemonic") {
      const { isValid, pubkey } = walletSDK.importWallet(mnemonic);
      if (isValid && pubkey) {
        setStep("phone");
      } else {
        setError("Invalid mnemonic. Please ensure it has 12 words.");
      }
    } else if (step === "phone") {
      // Validate phone number here
      setStep("otp");
    } else if (step === "otp") {
      // Validate OTP here
      handleImport();
    }
  };

  const handleImport = () => {
    const { isValid, pubkey } = walletSDK.importWallet(mnemonic);
    if (isValid && pubkey) {
      setMnemonic(mnemonic);
      setPubkey(pubkey);
      setPhoneState(phoneNumber);
      // Store both mnemonic and phone number
      // This is where you'd typically make an API call to your backend
      console.log("Importing wallet with:", { mnemonic, phoneNumber });
      router.push("/wallet");
    } else {
      setError("Failed to import the wallet. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "phone") {
      setStep("mnemonic");
    } else if (step === "otp") {
      setStep("phone");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center mb-20">
        {step === "mnemonic" ? (
          <Link href="/home" aria-label="Back to wallet">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        ) : (
          <button onClick={handleBack} aria-label="Go back">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
        )}
        <h1 className="text-xl font-bold">Import Wallet</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center space-y-8">
        {step === "mnemonic" && (
          <div className="w-full">
            <label htmlFor="mnemonic" className="block text-sm font-bold mb-1">
              Mnemonic:
            </label>
            <Textarea
              id="mnemonic"
              value={mnemonic}
              onChange={(e) => setMnemonicInput(e.target.value)}
              placeholder="Enter 12-word mnemonic"
              className="w-full px-2 py-2 border rounded-lg shadow-none h-40"
            />
          </div>
        )}

        {step === "phone" && (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Enter your phone number</h2>
            <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
          </div>
        )}

        {step === "otp" && (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">
              Verify your phone number
            </h2>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="w-full justify-center shadow-none">
              <InputOTPGroup className="gap-2 sm:gap-4 shadow-none">
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 shadow-none rounded-md"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 shadow-none rounded-md"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 shadow-none rounded-md"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2 sm:mx-4" />
              <InputOTPGroup className="gap-2 sm:gap-4">
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 shadow-none rounded-md"
                />
                <InputOTPSlot
                  index={4}
                  className="w-12 h-12 shadow-none rounded-md"
                />
                <InputOTPSlot
                  index={5}
                  className="w-12 h-12 shadow-none rounded-md"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mb-16">
        <Button
          onClick={handleContinue}
          disabled={
            (step === "mnemonic" && mnemonic.split(" ").length !== 12) ||
            (step === "phone" && !phoneNumber) ||
            (step === "otp" && otp.length !== 6)
          }
          className="w-full py-6 font-bold text-lg rounded-3xl shadow-none">
          {step === "otp" ? "Sign In" : "Continue"}
        </Button>
      </motion.footer>
    </div>
  );
}
