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
import { isValidPhoneNumber } from "@/utils/validation";

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
      const { isValid, pubkey } = walletSDK.importWallet(mnemonic.trim());
      if (isValid && pubkey) {
        setStep("phone");
        setError(""); // Clear any previous errors
      } else {
        setError("Invalid mnemonic. Please ensure it has 12 valid words.");
      }
    } else if (step === "phone") {
      if (isValidPhoneNumber(phoneNumber)) {
        setStep("otp");
        setError("");
      } else {
        setError("Please enter a valid phone number.");
      }
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
      // This is where you&apos;d typically make an API call to your backend
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
              className="w-full h-full justify-center shadow-none">
              <InputOTPGroup className="gap-2 sm:gap-4 shadow-none w-full h-full">
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-full h-full aspect-square shadow-none rounded-md"
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 sm:gap-4 w-full h-full">
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-full h-full aspect-square shadow-none rounded-md"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        <Button
          onClick={handleContinue}
          disabled={
            (step === "mnemonic" && mnemonic.trim().split(" ").length !== 12) ||
            (step === "phone" && !isValidPhoneNumber(phoneNumber)) ||
            (step === "otp" && otp.length !== 6)
          }
          className="w-full py-6 font-bold text-lg rounded-full shadow-none">
          {step === "otp" ? "Sign In" : "Continue"}
        </Button>
      </motion.footer>
    </div>
  );
}
