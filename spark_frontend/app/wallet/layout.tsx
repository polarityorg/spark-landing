"use client";
import localFont from "next/font/local";
import "../globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useWalletStore } from "./store";
import { ThemeProvider } from "@/components/theme-provider";

// Import Decimal font with multiple weights and styles
const decimal = localFont({
  src: [
    {
      path: "../fonts/Decimal-Thin-Pro.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-ThinItalic-Pro.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Light-Pro.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-LightItalic-Pro.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-XLight-Pro.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-XLightItalic-Pro.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Book-Pro.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BookItalic-Pro.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Medium-Pro.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-MediumItalic-Pro.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Semibold-Pro.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-SemiboldItalic-Pro.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Bold-Pro.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BoldItalic-Pro.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-XBlack-Pro.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-XBlackItalic-Pro.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Black-Pro.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BlackItalic-Pro.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-decimal",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Remove the mounted state and useEffect
  // const [mounted, setMounted] = useState(false);

  // Remove this useEffect
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // Remove the conditional rendering
  // if (!mounted) {
  //   return null;
  // }

  const mnemonic = useWalletStore((state) => state.mnemonic);
  const previousBtcBalanceRef = useRef<number | null>(null);
  const previousStablecoinBalanceRef = useRef<number | null>(null);

  const setBtcPrice = useWalletStore((state) => state.setBtcPrice);
  const fetchBalance = useWalletStore((state) => state.fetchBalance);
  const createSparkClient = useWalletStore((state) => state.createSparkClient);
  const POLLING_INTERVAL = 1000; // 1 second
  const BTC_POLLING_INTERVAL = 60000; // 1 minute

  useEffect(() => {
    if (!mnemonic) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const initializeAndPoll = async () => {
      try {
        // Initialize the wallet client once
        await createSparkClient(mnemonic);
        console.log("Wallet initialized.");

        // Function to fetch and handle balance
        const updateBalance = async () => {
          if (!isMounted) return;
          try {
            const [btcBalance, stablecoinBalance] = await fetchBalance();

            if (previousBtcBalanceRef.current === null) {
              previousBtcBalanceRef.current = Number(btcBalance);
            } else if (btcBalance > previousBtcBalanceRef.current) {
              toast.success(
                `Received ${btcBalance.toLocaleString("en-US")} sats`
              );
              previousBtcBalanceRef.current = Number(btcBalance);
            } else {
              previousBtcBalanceRef.current = Number(btcBalance);
            }

            if (previousStablecoinBalanceRef.current === null) {
              previousStablecoinBalanceRef.current = Number(stablecoinBalance);
            } else if (
              stablecoinBalance > previousStablecoinBalanceRef.current
            ) {
              toast.success(
                `Received ${stablecoinBalance.toLocaleString("en-US")} sats`
              );
              previousStablecoinBalanceRef.current = Number(stablecoinBalance);
            } else {
              previousStablecoinBalanceRef.current = Number(stablecoinBalance);
            }
          } catch (error) {
            console.error("Error fetching balances:", error);
            toast.error("Failed to fetch balances.");
          }
        };

        // Initial balance fetch
        await updateBalance();

        // Start polling for balance
        intervalId = setInterval(updateBalance, POLLING_INTERVAL);
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
  }, [mnemonic]);

  // Use effect for BTC price polling
  useEffect(() => {
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
  }, []);

  const isVerticalAnimation =
    pathname.includes("activity") || pathname.includes("settings");

  return (
    <html lang="en" className={decimal.variable}>
      <body className={`bg-[#10151C] overflow-x-hidden antialiased`}>
        {/* Provide BTC price via Context */}

        <div className="mx-auto w-full h-[100dvh] max-w-[490px] bg-[#10151C] overflow-x-hidden">
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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}>
              {children}
            </ThemeProvider>
          </motion.div>
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
