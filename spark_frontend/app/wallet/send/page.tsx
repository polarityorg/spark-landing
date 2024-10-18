"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn, truncatePubkey } from "@/lib/utils";
import { useWalletStore } from "../store";
import { useRouter } from "next/navigation";

import { isValidPublicKey } from "@/utils/validation";
import { toast } from "sonner";
import { notifyReceiverTransfer } from "js-sdk/src/spark-client";
import SparkButton from "@/components/SparkButton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import React from "react";
import { AssetSelector } from "@/components/AssetSelector";
import { Input } from "@/components/ui/input";
import { decode as decodeInvoice } from "@gandlaf21/bolt11-decode";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { walletSDK } from "../sdk"; // Ensure these are correctly imported

const MINIMUM_SATS = 10000;

const isValidEmail = (email: string): boolean => {
  // Simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const formatRecipient = (
  value: string,
  recipientType: "phone" | "publicKey" | "uma" | "invoice" | null
) => {
  if (recipientType === "phone") {
    const phoneNumber = parsePhoneNumberFromString(value, "US");
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    } else {
      return value;
    }
  } else if (recipientType === "invoice") {
    // Truncate the invoice to first 12 and last 12 characters
    const start = value.substring(0, 12);
    const end = value.substring(value.length - 12);
    return `${start}...${end}`;
  } else if (recipientType === "uma") {
    // Display UMA address as is
    return value;
  } else if (recipientType === "publicKey") {
    // Truncate public key for brevity
    return truncatePubkey(value, 12);
  } else {
    return value;
  }
};

export default function SendPage() {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const availableBtcBalance = useWalletStore((state) => state.btcBalance);
  const availableStablecoinBalance = useWalletStore(
    (state) => state.stablecoinBalance
  );
  const btcPrice = useWalletStore((state) => state.btcPrice);
  const transferBtc = useWalletStore((state) => state.transferBtc);
  const payLightningInvoice = useWalletStore(
    (state) => state.payLightningInvoice
  );
  const transferStablecoins = useWalletStore(
    (state) => state.transferStablecoins
  );
  const router = useRouter();

  const [amountCents, setAmountCents] = useState(0);
  const [step, setStep] = useState<"amount" | "to" | "summary" | "sent">("to");
  const [recipient, setRecipient] = useState("");
  const [originalRecipient, setOriginalRecipient] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<"BTC" | "USDB">(
    "BTC"
  );
  const [selectedAsset, setSelectedAsset] = useState({
    imageSrc: "/bitcoin.svg",
    altText: "Bitcoin",
    payWithText: "BTC",
    balanceUSD: "",
    balanceCrypto: "",
  });
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const [recipientType, setRecipientType] = useState<
    "phone" | "publicKey" | "uma" | "invoice" | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleRecipientChange = (value: string) => {
    const normalizedValue = value.trim();

    // Attempt to parse the phone number
    const phoneNumber = parsePhoneNumberFromString(normalizedValue, "US");

    if (phoneNumber && phoneNumber.isValid()) {
      const formattedNumber = phoneNumber.number; // E.164 format, includes '+1'
      setRecipient(formattedNumber);
      setRecipientType("phone");
      setOriginalRecipient(""); // Clear any previous UMA address
      return;
    }

    try {
      decodeInvoice(normalizedValue);
      setRecipient(normalizedValue);
      setRecipientType("invoice");
      setOriginalRecipient("");
    } catch {
      if (isValidEmail(normalizedValue)) {
        setRecipient(normalizedValue);
        setRecipientType("uma");
        setOriginalRecipient(normalizedValue); // Store UMA address
      } else if (isValidPublicKey(normalizedValue)) {
        setRecipient(normalizedValue);
        setRecipientType("publicKey");
        setOriginalRecipient("");
      } else {
        setRecipient(normalizedValue);
        setRecipientType(null);
        setOriginalRecipient("");
      }
    }
  };

  useEffect(() => {
    if (!mnemonic) {
      router.replace("/");
    }
  }, [mnemonic, router]);

  const getBalanceCurrentMode = useCallback(() => {
    if (selectedCurrency === "BTC") {
      return availableBtcBalance;
    } else {
      return availableStablecoinBalance;
    }
  }, [selectedCurrency, availableBtcBalance, availableStablecoinBalance]);

  const calculateBalanceInUSDCents = useMemo(() => {
    const balance = getBalanceCurrentMode();
    if (selectedCurrency === "BTC") {
      return Math.floor((balance / 100_000_000) * btcPrice * 100); // BTC balance in USD cents
    } else {
      return Math.floor(balance); // For stablecoins, balance is already in cents
    }
  }, [getBalanceCurrentMode, btcPrice]);

  // Use the new function to calculate MAX_AMOUNT_CENTS
  const MAX_AMOUNT_CENTS = Math.min(99999999, calculateBalanceInUSDCents);

  const handleNumberClick = useCallback(
    (digit: string) => {
      setAmountCents((prevAmount) =>
        Math.min(prevAmount * 10 + parseInt(digit), MAX_AMOUNT_CENTS)
      );
    },
    [MAX_AMOUNT_CENTS]
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

  const isSendDisabled = (balance: number, amount: number) =>
    amount === 0 || amount / 100 > balance;

  const handleSendMoney = async () => {
    console.log("Sending money with currency type " + selectedCurrency);
    const MIN_DURATION = 500; // Minimum duration in milliseconds
    const startTime = Date.now();

    if (getBalanceCurrentMode() < amountCents / 100) {
      setError("Insufficient balance.");
      return;
    }
    setIsSending(true);
    try {
      if (recipientType === "invoice" || recipientType === "uma") {
        // Use payLightningInvoice for UMA and Lightning invoices
        await payLightningInvoice(recipient);
      } else if (recipientType === "phone" || recipientType === "publicKey") {
        // Use transfer for Spark recipients
        const amountInUsd = amountCents / 100;

        let recipientPubKey = recipient;

        if (recipientType === "phone") {
          // Fetch the public key for the phone number
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

        if (selectedCurrency === "BTC") {
          const amountInSats = Math.round(
            (amountInUsd / btcPrice) * 100_000_000
          );
          await transferBtc(amountInSats, recipientPubKey);
        } else {
          if (availableBtcBalance <= MINIMUM_SATS) {
            throw new Error(
              `Insufficient BTC to send Stablecoins. Minimum required: ${MINIMUM_SATS} sats.`
            );
          }
          await transferStablecoins(
            MINIMUM_SATS,
            recipientPubKey,
            String(amountCents),
            "a81a20fdcf392b9e4434a40cf53ee29c63451891cbfcac1a4d3915df058a15ca"
          );
        }

        // Notify Receiver if Recipient is Identified by Phone Number
        if (recipientType === "phone") {
          notifyReceiverTransfer("spark-demo.dev.dev.sparkinfra.net", {
            receiver_phone_number: recipient,
            currency: "USD",
            amount: amountInUsd,
          });
        }
      }
    } catch (error) {
      console.error("Error sending funds:", error);
      setError("Failed to send funds. Please try again.");
      toast.error("Failed to send funds. Please try again.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_DURATION - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          setIsSending(false);
          setStep("sent");
        }, remainingTime);
      } else {
        setIsSending(false);
        setStep("sent");
      }
    }
  };

  const handleUseMax = () => {
    setAmountCents(MAX_AMOUNT_CENTS);
  };

  // Utility functions to format USD and balances
  const formatUSD = (amountCents: number) => {
    const amountDollars = amountCents / 100;
    return amountDollars.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatWithCents = (amountCents: number) => {
    const amountDollars = amountCents / 100;
    const formatted = amountDollars.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const [dollars, cents] = formatted.split(".");
    return (
      <>
        {dollars}
        {cents && <span className="text-3xl">.{cents}</span>}
      </>
    );
  };

  const handleAssetSelect = (asset: {
    imageSrc: string;
    altText: string;
    payWithText: string;
    balanceUSD: string;
    balanceCrypto: string;
  }) => {
    // Update the selected currency
    setSelectedCurrency(asset.payWithText as "BTC" | "USDB"); // Adjust as necessary

    // Update selectedAsset
    setSelectedAsset({
      ...asset,
    });

    sheetCloseRef.current?.click(); // Close the sheet
  };

  useEffect(() => {
    let balanceCrypto = "";
    let balanceUSD = "";

    if (selectedCurrency === "BTC") {
      const btcBalance = availableBtcBalance / 100_000_000; // Convert satoshis to BTC
      balanceCrypto = `${btcBalance.toFixed(5)} BTC`;
      balanceUSD = `$${(btcBalance * btcPrice).toFixed(2)}`;
    } else if (selectedCurrency === "USDB") {
      const stablecoinBalance = availableStablecoinBalance / 100; // Convert cents to dollars
      balanceCrypto = `${stablecoinBalance.toFixed(2)} USDB`;
      balanceUSD = `$${stablecoinBalance.toFixed(2)}`;
    }

    setSelectedAsset((prevAsset) => ({
      ...prevAsset,
      balanceUSD,
      balanceCrypto,
    }));
  }, [
    selectedCurrency,
    availableBtcBalance,
    availableStablecoinBalance,
    btcPrice,
  ]);

  const handleContinue = async () => {
    if (step === "to") {
      if (recipientType === "invoice") {
        try {
          const decodedInvoice = decodeInvoice(recipient);
          // Extract amount from the invoice
          const amountSection = decodedInvoice.sections.find(
            (section) => section.name === "amount"
          );

          if (!amountSection || !amountSection.value) {
            toast.error("Invoice does not specify an amount.");
            return;
          }

          const amountSats = Number(BigInt(amountSection.value) / BigInt(1000));
          const amountInUsd = (amountSats / 100_000_000) * btcPrice;
          setAmountCents(Math.round(amountInUsd * 100));

          // Proceed directly to the summary step
          setStep("summary");
        } catch (error) {
          console.error("Failed to decode invoice:", error);
          toast.error("Invalid Lightning invoice.");
        }
      } else if (recipientType === "uma") {
        // Force currency to BTC and proceed to amount step
        setSelectedCurrency("BTC");
        setStep("amount");
      } else {
        // For 'phone' or 'publicKey', proceed to amount step
        setStep("amount");
      }
    } else if (step === "amount") {
      if (recipientType === "uma") {
        // Decode UMA into a Lightning invoice with the specified amount
        try {
          setIsLoading(true);
          const amountSats = Math.round(
            (amountCents / 100 / btcPrice) * 100_000_000
          );

          // Decode UMA address into a Lightning invoice with the specified amount
          const invoice = await walletSDK.decodeUma(
            recipient,
            BigInt(amountSats)
          );
          setRecipient(invoice);
          setRecipientType("invoice");

          // Proceed to summary step
          setStep("summary");
        } catch (error) {
          console.error("Failed to decode UMA:", error);
          toast.error("Invalid UMA address.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Proceed to summary step
        setStep("summary");
      }
    }
  };

  const formatSats = (amountCents: number): string => {
    const amountInUSD = amountCents / 100;
    const amountInBTC = amountInUSD / btcPrice;
    const amountInSats = Math.round(amountInBTC * 100_000_000);
    return amountInSats.toLocaleString();
  };

  if (!mnemonic) {
    return null; // Optionally, render a loading indicator
  }

  return (
    <div className="font-[family-name:var(--font-decimal)] w-full h-full max-w-md p-4 mb-4 shadow-lg flex flex-col justify-between items-center min-h-[200px] overflow-hidden">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full font-[family-name:var(--font-decimal)]">
        <div className="relative w-full h-14 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === "to") {
                router.back();
              } else if (step === "amount") {
                setStep("to");
              } else if (step === "summary") {
                setStep("to");
              } else if (step === "sent") {
                router.push("/wallet");
              }
            }}
            aria-label="Back to wallet"
            className="absolute left-4">
            <ChevronLeft className="h-6 w-6" strokeWidth={4} />
          </Button>
          <h1 className="text-md font-md">
            {step === "to"
              ? "Send"
              : step === "amount"
                ? "Amount to send"
                : step === "summary"
                  ? `Send ${selectedCurrency}`
                  : "Sent"}
          </h1>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow flex flex-col w-full font-[family-name:var(--font-decimal)]">
        {step === "to" && (
          <div className="flex flex-col h-full font-sans px-4">
            <div className="flex flex-col justify-center items-start p-4 w-full bg-[#121E2D] rounded-lg font-[family-name:var(--font-decimal)]">
              <Input
                type="text"
                value={
                  recipientType === "phone"
                    ? formatRecipient(recipient, recipientType)
                    : recipient
                }
                onChange={(e) => handleRecipientChange(e.target.value)}
                placeholder={"Phone, UMA, address, or invoice"}
                className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500 text-md"
              />
            </div>
            {recipient && recipientType && (
              <>
                <div className="w-full h-[1px] bg-gray-800 mt-4 mb-4" />
                <div
                  className="flex flex-col justify-center w-full"
                  onClick={handleContinue}>
                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-2">
                      {/* Display the appropriate icon based on recipientType */}
                      {recipientType === "phone" && (
                        <Image
                          src="/phone.svg"
                          alt="Phone"
                          width={44}
                          height={44}
                        />
                      )}
                      {(recipientType === "uma" ||
                        recipientType === "invoice") && (
                        <Image
                          src="/uma.svg"
                          alt="UMA"
                          width={44}
                          height={44}
                        />
                      )}
                      {recipientType === "publicKey" && (
                        <Image
                          src="/uma.svg"
                          alt="UMA"
                          width={44}
                          height={44}
                        />
                      )}
                      <div className="flex flex-col font-[family-name:var(--font-decimal)]">
                        <span className="text-gray-300">
                          {recipientType === "phone"
                            ? formatRecipient(recipient, recipientType)
                            : recipientType === "publicKey"
                              ? truncatePubkey(recipient, 12)
                              : recipientType === "invoice"
                                ? truncatePubkey(recipient, 12)
                                : recipient}
                        </span>
                        <span className="text-gray-500">
                          {recipientType === "phone" ||
                          recipientType === "publicKey"
                            ? "Send money via Spark"
                            : "Send money via Lightning"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === "amount" && (
          <div className="flex flex-col h-full w-full">
            <div className="flex-grow flex flex-col justify-center items-center">
              <p className="text-6xl font-bold mb-4 bg-[#F9F9F99914]">
                <span className="tabular-nums">
                  {formatWithCents(amountCents)}
                </span>
              </p>
              <div className="flex items-center justify-center border border-gray-800 rounded-full overflow-hidden">
                <p className="text-base font-bold px-3 py-2">
                  Available: {formatUSD(calculateBalanceInUSDCents)}
                </p>
                <Button
                  variant="outline"
                  onClick={handleUseMax}
                  className="text-sm  font-bold py-2 px-3 h-full rounded-full border-l border-gray-800 bg-gray-800">
                  Use Max
                </Button>
              </div>
              {recipientType !== "uma" && (
                <Sheet>
                  <SheetTrigger asChild>
                    <AssetSelector
                      onClick={() => {}}
                      imageSrc={selectedAsset.imageSrc}
                      altText={selectedAsset.altText}
                      payWithText={selectedAsset.payWithText}
                      balanceUSD={selectedAsset.balanceUSD}
                      balanceCrypto={selectedAsset.balanceCrypto}
                      showPayWith={true}
                    />
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="h-[50vh] bg-[#141A22] text-white font-[family-name:var(--font-decimal)]">
                    <SheetClose ref={sheetCloseRef} className="hidden" />
                    <div className="flex flex-col h-full">
                      <h2 className="text-2xl font-semibold mb-6 text-center">
                        Select asset to send
                      </h2>
                      <div className="flex-grow space-y-4">
                        <AssetSelector
                          onClick={() =>
                            handleAssetSelect({
                              imageSrc: "/bitcoin.svg",
                              altText: "Bitcoin",
                              payWithText: "BTC",
                              balanceUSD: "$1,200.00",
                              balanceCrypto: "0.02389516 BTC",
                            })
                          }
                          imageSrc="/bitcoin.svg"
                          altText="Bitcoin"
                          payWithText="BTC"
                          balanceUSD="$1,200.00"
                          balanceCrypto="0.02389516 BTC"
                          showPayWith={false}
                        />
                        <AssetSelector
                          onClick={() =>
                            handleAssetSelect({
                              imageSrc: "/usdb.svg",
                              altText: "USDB",
                              payWithText: "USDB",
                              balanceUSD: "$200.00",
                              balanceCrypto: "200 USDB",
                            })
                          }
                          imageSrc="/usdb.svg"
                          altText="USDB"
                          payWithText="USDB"
                          balanceUSD="$200.00"
                          balanceCrypto="200 USDB"
                          showPayWith={false}
                        />
                        <AssetSelector
                          onClick={() =>
                            handleAssetSelect({
                              imageSrc: "/mxnb.svg",
                              altText: "MXNB",
                              payWithText: "MXNB",
                              balanceUSD: "$100.00",
                              balanceCrypto: "1931.25 MXNB",
                            })
                          }
                          imageSrc="/mxnb.svg"
                          altText="MXNB"
                          payWithText="MXNB"
                          balanceUSD="$100.00"
                          balanceCrypto="1931.25 MXNB"
                          showPayWith={false}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
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

        {step === "summary" && (
          <div className="flex flex-col h-full px-8">
            <div className="flex-grow flex flex-col justify-center items-center mb-8">
              <div
                className="border-[0.5px] border-solid rounded-2xl w-full max-w-md p-8 mb-4 shadow-lg flex flex-col justify-center items-center min-h-[200px] overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #141A22 0%, #141A22 11.79%, #131A22 21.38%, #131922 29.12%, #131922 35.34%, #131921 40.37%, #131921 44.56%, #121820 48.24%, #121820 51.76%, #12171F 55.44%, #11171F 59.63%, #11171E 64.66%, #11161E 70.88%, #11161D 78.62%, #10151C 88.21%, #10151C 100%)",
                }}>
                <div className="text-center">
                  {selectedCurrency === "BTC" ? (
                    <>
                      <p className="text-5xl font-bold mb-2">
                        {formatUSD(amountCents)}
                      </p>
                      <p className="text-gray-400">
                        {formatSats(amountCents)} sats
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-5xl font-bold mb-2">
                        {formatWithCents(amountCents)}
                      </p>
                      <p className="text-gray-400">
                        {formatUSD(amountCents)} {selectedCurrency}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6 w-full">
                <div className="flex justify-between items-center">
                  <span>Send to</span>
                  <span>
                    {originalRecipient
                      ? originalRecipient
                      : formatRecipient(recipient, recipientType)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Funds arrive</span>
                  <span>Instantly</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Your fees</span>
                  <span>Free</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "sent" && (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-[#0E3154] rounded-full p-12">
                <MoveUpRight className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-center p-8">
                Payment sent
              </h2>
              <p className="text-gray-400 text-center p-8">
                {formatUSD(amountCents)} sent to{" "}
                {formatRecipient(recipient, recipientType)}{" "}
                {recipientType === "uma" || recipientType === "invoice"
                  ? "via Lightning"
                  : "via Spark"}
              </p>
            </div>
          </div>
        )}
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-4 w-full mt-auto">
        {/* Adjust footer buttons based on step */}
        {step === "to" && (
          <SparkButton
            onClick={handleContinue}
            className="w-full h-14 text-lg font-bold"
            disabled={!recipientType || recipient.length < 1}>
            Continue
          </SparkButton>
        )}

        {step === "amount" && (
          <div className="flex gap-4">
            <SparkButton
              disabled={
                isSendDisabled(getBalanceCurrentMode(), amountCents) ||
                isLoading
              }
              onClick={handleContinue}
              className={cn(
                "w-full h-14 text-lg font-bold",
                isLoading && "pointer-events-none"
              )}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Preview"
              )}
            </SparkButton>
          </div>
        )}

        {step === "summary" && (
          <motion.div
            className="relative mx-auto"
            initial={{ width: "100%" }}
            animate={{
              width: "100%",
              borderRadius: isSending ? 28 : 24,
            }}
            transition={{ duration: 0.3 }}>
            <p className="text-sm text-gray-400 mb-6 text-center">
              We&apos;ll send a text to {recipient} with a link they can open to
              receive your payment. All they need to do is log in with their
              phone number to see their wallet.
            </p>
            <SparkButton
              onClick={handleSendMoney}
              className={cn(
                "w-full h-14 text-lg font-bold",
                isSending && "pointer-events-none"
              )}>
              <span
                className={cn("transition-opacity", isSending && "opacity-0")}>
                SEND NOW
              </span>
              {isSending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </SparkButton>
          </motion.div>
        )}

        {step === "sent" && (
          <SparkButton href="/wallet" className="w-full h-14 text-lg font-bold">
            Go Home
          </SparkButton>
        )}
      </motion.footer>
    </div>
  );
}
