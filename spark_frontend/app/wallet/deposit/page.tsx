"use client";

import Link from "next/link";
import { X, Loader2, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "../store";
// @ts-expect-error type error
import QRCode from "react-fancy-qrcode";
import Image from "next/image";
import debounce from "lodash.debounce";
import { truncatePubkey } from "@/lib/utils";

const formatRecipient = (value: string) => {
  const phonePattern = /^\+\d{10,}$/;
  if (phonePattern.test(value)) {
    return value.replace(/^(\+\d)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4");
  }
  if (value.length > 12) {
    return truncatePubkey(value, 6);
  }
  return value;
};

export default function DepositPage() {
  const [, setCopyStatus] = useState("");
  const [invoice, setInvoice] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [amountCents, setAmountCents] = useState(0);
  const [, setError] = useState("");
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const createLightningInvoice = useWalletStore(
    (state) => state.createLightningInvoice
  );
  const [qrSize, setQrSize] = useState(500);
  const btcPrice = useWalletStore((state) => state.btcPrice);
  const userPublicKey = useWalletStore((state) => state.pubkey);
  const userPhone = useWalletStore((state) => state.phoneNumber);
  const [selectedNetwork, setSelectedNetwork] = useState<"spark" | "lightning">(
    "lightning"
  );
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setIsCopied(true);
      setTimeout(() => {
        setCopyStatus("");
        setIsCopied(false);
      }, 2000);
    });
  };

  const handleNetworkSelection = (network: "spark" | "lightning") => {
    setSelectedNetwork(network);
    setInvoice("");
    setAmountCents(0);
    setError("");
    setIsEditingAmount(false);
    if (network === "spark") {
      setPublicKey(userPublicKey || "");
    } else {
      setPublicKey("");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmountCents(Number(value));
    generateInvoiceDebounced(Number(value));
  };

  const generateInvoice = async (amountCents: number) => {
    if (amountCents <= 0) {
      setError("Please enter a valid amount");
      setInvoice("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert USD amount to sats
      const amountSats = Number(
        Math.floor((amountCents / 100 / btcPrice) * 1e8)
      );

      // Create the Lightning invoice
      const newInvoice = await createLightningInvoice(amountSats, 3, 5);
      if (newInvoice) {
        setInvoice(newInvoice);
      } else {
        setError("Failed to create invoice. Please try again.");
        setInvoice("");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to create invoice. Please try again.");
      setInvoice("");
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceDebounced = useCallback(
    debounce((cents: number) => {
      generateInvoice(cents);
    }, 500),
    []
  );

  useEffect(() => {
    if (isEditingAmount && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isEditingAmount]);

  useEffect(() => {
    const updateQrSize = () => {
      if (window.innerWidth * 0.8 < 500) {
        setQrSize(window.innerWidth * 0.8);
      } else {
        setQrSize(500);
      }
    };

    // Set initial size
    updateQrSize();

    // Update size on window resize
    window.addEventListener("resize", updateQrSize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", updateQrSize);
  }, []);

  const qrData =
    selectedNetwork === "lightning"
      ? `lightning:${invoice}`
      : `spark:${publicKey}`;

  const getButtonStyle = (network: "spark" | "lightning") => {
    const isSelected = selectedNetwork === network;
    return isSelected
      ? "bg-[#0E3154] text-white border-2 border-black shadow-[inset_0_0_10px_rgba(255,255,255,0.3)] hover:bg-[#0E3154] focus:bg-[#0E3154]"
      : "bg-transparent text-white hover:bg-transparent focus:bg-transparent";
  };

  // Determine the QR code logo based on the selected network
  const qrCodeLogo =
    selectedNetwork === "spark" ? "/spark-box.png" : "/zap.png";

  // Add the handleShare function
  const handleShare = async () => {
    try {
      const shareData =
        selectedNetwork === "lightning"
          ? {
              title: "Lightning Invoice",
              text: invoice,
            }
          : {
              title: "Public Key",
              text: publicKey,
            };

      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Successful share");
      } else {
        copyToClipboard(shareData.text);
        alert(
          "Share not supported on this browser. The data has been copied to your clipboard instead."
        );
      }
    } catch (error) {
      console.error("Error sharing", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 font-[family-name:var(--font-decimal)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center">
        <Link href="/wallet" aria-label="Back to wallet">
          <X className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold">Receive</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center h-screen">
        <div className="flex gap-2 mb-6 w-full">
          <Button
            onClick={() => handleNetworkSelection("lightning")}
            className={`flex-1 h-[50px] ${getButtonStyle("lightning")}`}>
            Lightning
          </Button>
          <Button
            onClick={() => handleNetworkSelection("spark")}
            className={`flex-1 h-[50px] ${getButtonStyle("spark")}`}>
            Spark
          </Button>
        </div>
        <div
          className="border-[1px] border-solid border-[#2D3845] rounded-2xl w-full max-w-md mb-4 shadow-lg flex flex-col justify-center items-center overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #141A22 0%, #141A22 11.79%, #131A22 21.38%, #131922 29.12%, #131922 35.34%, #131921 40.37%, #131921 44.56%, #121820 48.24%, #121820 51.76%, #12171F 55.44%, #11171F 59.63%, #11171E 64.66%, #11161E 70.88%, #11161D 78.62%, #10151C 88.21%, #10151C 100%)",
            height: "66vh",
          }}>
          <div
            className="flex-grow flex items-center justify-center w-full p-4"
            style={{ height: "60%" }}>
            <div className="bg-[#212B37] rounded-lg p-4 w-full h-full flex flex-col items-center justify-center">
              {loading ? (
                /* Show the Loader2 spinner when loading */
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : selectedNetwork === "spark" || invoice ? (
                /* Show the QR code when not loading and invoice or public key is available */
                <QRCode
                  value={qrData}
                  size={qrSize}
                  dotScale={1}
                  dotRadius="100%"
                  positionRadius={["5%", "1%"]}
                  errorCorrection="H"
                  backgroundColor="transparent"
                  color="#F9F9F9"
                  logo={qrCodeLogo}
                />
              ) : (
                /* Show the placeholder message or blurred QR code when no invoice */
                <>
                  <p className="text-center text-white mb-4 z-10 absolute">
                    Add an amount to receive via lightning
                  </p>
                  <div className="relative w-full h-full flex items-center justify-center blur-md">
                    <QRCode
                      value="lnbc149329510n1pns79s9pp5emssj9sawqf8jqg5n49acdwv46tjyss8g7avk9dqng9fw7kyn7gshp5732rzz6dwm3carh4ju0vx6ghcdrymgyemjrln8lgr6s3qppn8j7qcqzzsxqyz5vqsp584emxnrtvlmymlvxng2vumfhnkd3ef5k6q2vcuvhrgg5l2aut7ys9qxpqysgq7de7rv4rywxu7ppeh2aunft8nkrfcxr3ss3datg423vy8ezh7a9px03dyxls5q5chvdvlwmfta6qz2q80qmghkgr07thte4ymaank9gpnfllfa"
                      size={qrSize}
                      dotScale={1}
                      dotRadius="100%"
                      positionRadius={["5%", "1%"]}
                      errorCorrection="H"
                      backgroundColor="transparent"
                      color="#F9F9F9"
                      logo={qrCodeLogo}
                    />
                    <div className="absolute inset-0 bg-[#212B37] opacity-80 blur-lg"></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full" style={{ height: "20%" }}>
            <div className="h-full border-t border-[#2D3845] flex items-center">
              <div
                className="flex justify-between items-center px-8 w-full cursor-pointer"
                onClick={() => {
                  if (selectedNetwork === "lightning") {
                    setIsEditingAmount(true);
                  }
                }}>
                {selectedNetwork === "lightning" ? (
                  <>
                    <div
                      className="flex items-center"
                      onClick={() => setIsEditingAmount(true)}>
                      <span className="text-gray-200 mr-2">Amount</span>
                      {isEditingAmount ? (
                        <input
                          ref={amountInputRef}
                          type="text"
                          value={amountCents}
                          onChange={handleAmountChange}
                          onBlur={() => setIsEditingAmount(false)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent border-b border-gray-500 text-gray-200 focus:outline-none w-20"
                        />
                      ) : (
                        <span className="text-gray-500 block text-sm">
                          ${(amountCents / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Image
                      src="/pen.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                      onClick={() => {
                        setIsEditingAmount(true);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span className="text-gray-200">Receive via</span>
                      <span className="text-gray-500 block text-sm truncate max-w-[200px]">
                        {formatRecipient(userPhone || "")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full" style={{ height: "20%" }}>
            <div className="h-full border-t border-[#2D3845] flex items-center">
              <div className="flex justify-between items-center px-8 w-full">
                <div>
                  <span className="text-gray-200">
                    {selectedNetwork === "lightning"
                      ? "Lightning Invoice"
                      : "Public Key"}
                  </span>
                  <span className="text-gray-500 block text-sm truncate max-w-[200px]">
                    {selectedNetwork === "lightning"
                      ? invoice || "Add an amount to generate invoice"
                      : publicKey}
                  </span>
                </div>
                {isCopied ? (
                  <Check className="w-[18px] h-[18px] text-gray-200" />
                ) : (
                  <Copy
                    className="w-[18px] h-[18px] text-gray-200 cursor-pointer"
                    onClick={() => {
                      if (selectedNetwork === "lightning") {
                        copyToClipboard(invoice);
                      } else {
                        copyToClipboard(publicKey);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          className="w-full py-6 font-bold text-lg rounded-full text-white"
          style={{
            background: "linear-gradient(0deg, #0E3154, #0E3154), #F9F9F9",
            boxShadow:
              "0px 4px 6px rgba(0, 0, 0, 0.14), 0px 0px 0px 1px #0C0D0F, inset 0px 9px 14px -5px rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
          }}
          disabled={!invoice && selectedNetwork === "lightning"}
          onClick={handleShare}>
          SHARE
        </Button>
      </motion.main>
    </div>
  );
}
