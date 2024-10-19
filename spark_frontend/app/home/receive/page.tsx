"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/app/wallet/store";
import SparkButton from "@/components/SparkButton";
import { PhoneInput } from "@/components/phone-input";
import { isValidPhoneNumber } from "@/utils/validation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { walletSDK } from "@/app/wallet/sdk";

export default function Receive() {
  const router = useRouter();
  const {
    mnemonic,
    setPhoneNumber: setPhoneState,
    importWallet,
    fetchBalance,
  } = useWalletStore();
  const [mounted, setMounted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isFetchingOTP, setIsFetchingOTP] = useState(false);
  const [isOtpSheetOpen, setIsOtpSheetOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [fetchedOtp, setFetchedOtp] = useState("");
  const [error, setError] = useState("");
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  useEffect(() => {
    setIsPhoneNumberValid(isValidPhoneNumber(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    if (mounted && mnemonic) {
      router.replace("/wallet");
    }
  }, [mnemonic, router, mounted]);

  if (!mounted) {
    return null;
  }

  const handleContinue = async () => {
    if (isValidPhoneNumber(phoneNumber)) {
      try {
        setIsFetchingOTP(true);
        setError("");
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
        setIsOtpSheetOpen(true);
      } catch (err) {
        console.error(err);
        setError("Failed to send OTP. Please try again.");
      } finally {
        setIsFetchingOTP(false);
      }
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp === fetchedOtp) {
      try {
        setIsCreatingWallet(true);
        setError("");
        const generatedMnemonic = walletSDK.generateMnemonic();

        const { isValid, pubkey } = await importWallet(
          generatedMnemonic,
          phoneNumber
        );
        if (isValid && pubkey) {
          setPhoneState(phoneNumber);
          await fetchBalance();
          router.push("/wallet");
        } else {
          setError("Failed to create the wallet. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while creating the wallet.");
      } finally {
        setIsCreatingWallet(false);
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#10151C] flex flex-col p-12 font-[family-name:var(--font-decimal)] w-full">
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center">
        <div className="flex items-center">
          <Image
            className="mr-2"
            src="/wallet.svg"
            alt="Spark Logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-white text-4xl font-bold">Wallet</h1>
        </div>
        <p className="text-gray-300 text-md text-center my-6">
          A Spark-enabled, self-custody
          <br />
          Bitcoin wallet
        </p>

        <div className="flex flex-col gap-2 mb-20 w-full max-w-md">
          <p className="text-muted-foreground text-md text-center my-6">
            Get started with your phone number
          </p>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <SparkButton
            onClick={handleContinue}
            disabled={!isPhoneNumberValid || isFetchingOTP}
            className="h-[40px] flex items-center justify-center">
            {isFetchingOTP ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <span>CONTINUE</span>
            )}
          </SparkButton>
        </div>
      </motion.main>

      <Sheet open={isOtpSheetOpen} onOpenChange={setIsOtpSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[50vh] bg-[#141A22] text-white">
          <SheetHeader>
            <SheetTitle>Verify your phone number</SheetTitle>
            <SheetDescription>
              Enter the 6-digit code sent to your phone
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
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
          <SparkButton
            onClick={handleVerifyOTP}
            className="w-full h-14 text-lg font-bold"
            disabled={otp.length !== 6 || isCreatingWallet}>
            {isCreatingWallet ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Creating Wallet...
              </>
            ) : (
              "Verify OTP"
            )}
          </SparkButton>
        </SheetContent>
      </Sheet>
    </div>
  );
}
