"use client";

import Link from "next/link";
import { ChevronLeft, Copy, Check, Loader2 } from "lucide-react"; // Updated import
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "../store";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { isValidPhoneNumber } from "@/utils/validation";
import { walletSDK } from "../sdk";
import SparkButton from "@/components/SparkButton";
import { copy } from "@/lib/utils";

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
  const [fetchedOtp, setFetchedOtp] = useState("");
  const fetchBalance = useWalletStore((state) => state.fetchBalance);
  const importWallet = useWalletStore((state) => state.importWallet);
  const [isFetchingOTP, setIsFetchingOTP] = useState(false); // New state
  const [isCreatingWallet, setIsCreatingWallet] = useState(false); // New state
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  useEffect(() => {
    setIsPhoneNumberValid(validatePhoneNumber(phoneNumber));
  }, [phoneNumber]);

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\+\d{10,15}$/; // Allows '+' followed by 10 to 15 digits
    return phoneRegex.test(number);
  };

  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp]);

  const verifyOTP = () => {
    if (otp === fetchedOtp.toString()) {
      setStep("mnemonic");
      handleCreate();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleCreate = () => {
    try {
      const generatedMnemonic = walletSDK.generateMnemonic();
      setMnemonicState(generatedMnemonic);
    } catch (err) {
      console.log(err);
      setError("An error occurred while generating the mnemonic.");
    }
  };

  const handleCopyMnemonic = async () => {
    await copy(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateWallet = async () => {
    if (mnemonic.split(" ").length === 12) {
      try {
        setIsCreatingWallet(true); // Start loader
        const { isValid, pubkey } = await importWallet(mnemonic, phoneNumber);
        if (isValid && pubkey) {
          setMnemonic(mnemonic);
          setPubkey(pubkey);
          setPhoneState(phoneNumber);
          await fetchBalance(); // Fetch and set the balance
          router.push("/wallet");
        } else {
          setError("Failed to import the wallet. Please try again.");
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while importing the wallet.");
      } finally {
        setIsCreatingWallet(false); // Stop loader
      }
    } else {
      setError("Generated mnemonic is invalid. Please regenerate.");
    }
  };

  const handleContinue = async () => {
    if (step === "phone") {
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          setIsFetchingOTP(true); // Start loader
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
        } finally {
          setIsFetchingOTP(false); // Stop loader
        }
      } else {
        setError("Please enter a valid phone number.");
      }
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
    <div className="min-h-screen bg-[#10151C] flex flex-col p-6 font-[family-name:var(--font-decimal)] text-white">
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
        <h1 className="text-md font-md">Create Wallet</h1>
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
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              className="w-full"
            />
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
                className="py-1.5 font-bold text-xs flex items-center bg-transparent text-gray-500 hover:bg-transparent">
                {copied ? (
                  <>
                    <Check className="mr-2 text-grey-500 w-4 h-4" /> Copied
                    Mnemonic
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 text-gray-500 w-4 h-4" /> Copy
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
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        <SparkButton
          onClick={handleContinue}
          disabled={
            (step === "phone" && (!phoneNumber || !isPhoneNumberValid)) ||
            (step === "otp" && otp.length !== 6) ||
            (step === "mnemonic" && !mnemonic) ||
            isFetchingOTP ||
            isCreatingWallet
          }>
          {isFetchingOTP ? (
            <>
              <Loader2 className="mr-2 animate-spin" /> Sending OTP...
            </>
          ) : isCreatingWallet ? (
            <>
              <Loader2 className="mr-2 animate-spin" /> Creating Wallet...
            </>
          ) : step === "mnemonic" ? (
            "Create Wallet"
          ) : (
            "Continue"
          )}
        </SparkButton>
      </motion.footer>
    </div>
  );
}
