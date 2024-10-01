"use client";

import Link from "next/link";
import { ChevronLeft, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { walletSDK } from "../sdk";
import { useWalletStore } from "../store";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function CreateWalletPage() {
  const router = useRouter();
  const setMnemonic = useWalletStore((state) => state.setMnemonic);
  const setPubkey = useWalletStore((state) => state.setPubkey);
  const setPhoneState = useWalletStore((state) => state.setPhoneNumber);
  const [mnemonic, setMnemonicState] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "mnemonic">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleCreate = () => {
    try {
      const generatedMnemonic = walletSDK.generateMnemonic();
      setMnemonicState(generatedMnemonic);
    } catch (err) {
      console.log(err);
      setError("An error occurred while generating the mnemonic.");
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateWallet = () => {
    if (mnemonic.split(" ").length === 12) {
      try {
        const { isValid, pubkey } = walletSDK.importWallet(mnemonic);
        if (isValid && pubkey) {
          setMnemonic(mnemonic);
          setPubkey(pubkey);
          setPhoneState(phoneNumber);
          // Store both mnemonic and phone number
          // This is where you'd typically make an API call to your backend
          console.log("Creating wallet with:", { mnemonic, phoneNumber });
          router.push("/wallet");
        } else {
          setError("Failed to import the wallet. Please try again.");
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while importing the wallet.");
      }
    } else {
      setError("Generated mnemonic is invalid. Please regenerate.");
    }
  };

  const handleContinue = () => {
    if (step === "phone") {
      // Validate phone number here
      setStep("otp");
    } else if (step === "otp") {
      // Validate OTP here
      setStep("mnemonic");
      handleCreate();
    } else if (step === "mnemonic") {
      handleCreateWallet();
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "mnemonic") {
      setStep("otp");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center mb-20">
        {step === "phone" ? (
          <Link href="/home" aria-label="Back to wallet">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        ) : (
          <button onClick={handleBack} aria-label="Go back">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
        )}
        <h1 className="text-xl font-bold">Create Wallet</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center space-y-8">
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

        {step === "mnemonic" && mnemonic && (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Recovery Phrase</h2>
            <div className="w-full  mx-auto border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4 w-full items-center justify-center">
                {mnemonic.split(" ").map((word, index) => (
                  <p key={index} className="text-sm flex items-center">
                    <span className="font-semibold mr-1 w-4 inline-block text-right">
                      {index + 1}.
                    </span>
                    {word}
                  </p>
                ))}
              </div>
              <Button
                onClick={handleCopyMnemonic}
                className="py-1.5 font-bold text-xs flex items-center bg-transparent text-gray-700 hover:bg-transparent">
                {copied ? (
                  <>
                    <Check className="mr-2 text-grey-700 w-4 h-4" /> Copied
                    Mnemonic
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 text-gray-700 w-4 h-4" /> Copy
                    Mnemonic
                  </>
                )}
              </Button>
            </div>
            {/* disclaimers */}
            <p className="text-sm text-red-500 mt-4 text-center">
              <span className="font-semibold">Important:</span>
              <br />
              This phrase is your only way to recover your funds. Keep it safe
              and secure.
            </p>
          </>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mb-16">
        <Button
          onClick={handleContinue}
          className="w-full py-6 font-bold text-lg rounded-full"
          disabled={
            (step === "phone" && !phoneNumber) ||
            (step === "otp" && otp.length !== 6) ||
            (step === "mnemonic" && !mnemonic)
          }>
          {step === "mnemonic" ? "Create Wallet" : "Continue"}
        </Button>
      </motion.footer>
    </div>
  );
}
