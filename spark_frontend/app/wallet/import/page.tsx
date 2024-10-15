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
  const fetchBalance = useWalletStore((state) => state.fetchBalance);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [mnemonic, setMnemonicInput] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "mnemonic">("phone");
  const [fetchedOtp, setFetchedOtp] = useState("");

  const handleContinue = async () => {
    if (step === "phone") {
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          // Send OTP request
          const response = await fetch(
            "https://spark-demo.dev.dev.sparkinfra.net/spark/send_otp",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ phone_number: phoneNumber }),
            }
          );

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || "Failed to send OTP.");
          }

          const data = await response.json();
          setFetchedOtp(data.otp.toString());

          setStep("otp");
          setError("");
        } catch (err) {
          console.error(err);
          setError("Failed to send OTP. Please try again.");
        }
      } else {
        setError("Please enter a valid phone number.");
      }
    } else if (step === "otp") {
      // Validate OTP here
      if (otp === fetchedOtp.toString()) {
        setStep("mnemonic");
        setError("");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } else if (step === "mnemonic") {
      try {
        handleImport();
      } catch (err) {
        console.log(err);
        setError("An error occurred while importing the wallet.");
      }
    }
  };

  const handleImport = async () => {
    try {
      const { isValid, pubkey } = await walletSDK.importWallet(
        mnemonic.trim(),
        phoneNumber
      );
      if (isValid && pubkey) {
        setMnemonic(mnemonic.trim());
        setPubkey(pubkey);
        setPhoneState(phoneNumber);
        await fetchBalance();
        console.log("Importing wallet with:", { mnemonic, phoneNumber });
        router.push("/wallet");
      } else {
        setError("Failed to import the wallet. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while importing the wallet.");
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
      setFetchedOtp(""); // Clear fetched OTP when going back
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
        <h1 className="text-xl font-bold">Import Wallet</h1>
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
            (step === "phone" && !isValidPhoneNumber(phoneNumber)) ||
            (step === "otp" && otp !== fetchedOtp.toString()) ||
            (step === "mnemonic" && mnemonic.trim().split(" ").length !== 12)
          }
          className="w-full py-6 font-bold text-lg rounded-full shadow-none">
          {step === "mnemonic" ? "Import Wallet" : "Continue"}
        </Button>
      </motion.footer>
    </div>
  );
}
