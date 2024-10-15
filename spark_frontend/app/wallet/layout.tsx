"use client";
import localFont from "next/font/local";
import "../globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useWalletStore } from "./store";
import { walletSDK } from "./sdk";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const previousBalanceRef = useRef<number | null>(null);
  const setBtcPrice = useWalletStore((state) => state.setBtcPrice);
  const setBalance = useWalletStore((state) => state.setBalance);
  const POLLING_INTERVAL = 1000; // 1 second
  const BTC_POLLING_INTERVAL = 60000; // 1 minute

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mnemonic) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const initializeAndPoll = async () => {
      try {
        // Initialize the wallet client once
        await walletSDK.createSparkClient(mnemonic);
        console.log("Wallet initialized.");

        // Function to fetch and handle balance
        const fetchBalance = async () => {
          if (!isMounted) return;
          try {
            const balance = await walletSDK.getBalance();
            setBalance(Number(balance));
            if (previousBalanceRef.current === null) {
              previousBalanceRef.current = Number(balance);
            } else if (balance > previousBalanceRef.current) {
              toast.success(`Balance Increased: ${balance}`);
              previousBalanceRef.current = Number(balance);
            } else {
              // Balance has not increased, update the previous balance
              previousBalanceRef.current = Number(balance);
            }
          } catch (error) {
            console.error("Error fetching balance:", error);
            toast.error("Failed to fetch balance.");
          }
        };

        // Initial balance fetch
        await fetchBalance();

        // Start polling for balance
        intervalId = setInterval(fetchBalance, POLLING_INTERVAL);
      } catch (error) {
        console.error("Error initializing wallet:", error);
        toast.error("Failed to initialize wallet.");
      }
    };

    initializeAndPoll();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [mounted, mnemonic]);

  // Add useEffect for BTC price polling
  useEffect(() => {
    if (!mounted) return;

    let isMounted = true;

    const fetchBtcPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await response.json();
        if (isMounted) {
          setBtcPrice(data.bitcoin.usd);
        }
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };

    // Initial fetch
    fetchBtcPrice();

    // Set interval to fetch every minute
    const btcIntervalId = setInterval(fetchBtcPrice, BTC_POLLING_INTERVAL);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(btcIntervalId);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  const isVerticalAnimation =
    pathname.includes("activity") || pathname.includes("settings");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Provide BTC price via Context */}

        <div className="mx-auto w-full h-[100dvh] max-w-[490px] overflow-hidden bg-white">
          <motion.div
            key={pathname}
            initial={{
              opacity: 0,
              [isVerticalAnimation ? "y" : "x"]: isVerticalAnimation
                ? 300
                : 300,
            }}
            animate={{ opacity: 1, [isVerticalAnimation ? "y" : "x"]: 0 }}
            exit={{
              opacity: 0,
              [isVerticalAnimation ? "y" : "x"]: isVerticalAnimation
                ? -300
                : -300,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5,
            }}
            className="h-full flex flex-col">
            {children}
          </motion.div>
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
