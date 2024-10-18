"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "./store";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SparkButton from "@/components/SparkButton";
import Activity from "@/components/Activity";
import { Settings } from "lucide-react";
import { TokenDisplay } from "@/components/TokenDisplay";

export default function Wallet() {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const btcBalance = useWalletStore((state) => state.btcBalance);
  const stablecoinBalance = useWalletStore((state) => state.stablecoinBalance);
  const setBtcBalance = useWalletStore((state) => state.setBtcBalance);
  const setStablecoinBalance = useWalletStore(
    (state) => state.setStablecoinBalance
  );

  const router = useRouter();
  const btcPrice = useWalletStore((state) => state.btcPrice);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !mnemonic) {
      router.replace("/home");
    }
  }, [
    mnemonic,
    router,
    setBtcBalance,
    setStablecoinBalance,
    mounted,
    btcBalance,
    stablecoinBalance,
  ]);

  if (!mounted) return null;

  if (!mnemonic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const getTotalBalanceUSD = () => {
    const btcAmount = btcBalance / 100000000;
    const usdAmount = btcAmount * btcPrice;
    return usdAmount + stablecoinBalance / 100;
  };

  const getTotalBalanceBTC = () => {
    const btcAmount = btcBalance / 100000000;
    const stablecoinsToBtc = stablecoinBalance / (btcPrice * 100); // Convert cents to BTC
    const totalBtc = btcAmount + stablecoinsToBtc;
    return Number(totalBtc.toFixed(8));
  };

  const formatBtcUSD = () => {
    const btcAmount = btcBalance / 100000000;
    const usdAmount = btcAmount * btcPrice;
    return usdAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatStablecoinsUSD = (stablecoins: number) => {
    const usdAmount = stablecoins / 100;
    return usdAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 font-[family-name:var(--font-decimal)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative flex items-center justify-center mb-6">
        <div className="absolute left-4 flex items-center">
          {/* If you have a left-side element, place it here. Otherwise, you can remove this div */}
        </div>
        <div className="flex items-center mt-4">
          <Image
            className="mr-2"
            src="/wallet.svg"
            alt="Spark Logo"
            width={24}
            height={24}
            priority
          />
          <h1 className="text-white text-xl font-bold">Wallet</h1>
        </div>
        <Link
          href="/wallet/settings"
          className="absolute right-4 flex items-center mt-4">
          <Settings className="text-white w-6 h-6" />
        </Link>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-start">
        <TokenDisplay
          usdAmount={getTotalBalanceUSD()}
          subtitleAmount={getTotalBalanceBTC()}
          subtitleAsset={"BTC"}
        />

        <div className="flex gap-4 mb-10 mt-8 w-full max-w-md">
          <SparkButton className="rounded-2xl py-2" href="/wallet/send">
            <div className="flex-col flex items-center gap-1 ">
              <Image
                src="/arrow-diag.svg"
                alt="Arrow Diagonal"
                width={16}
                height={16}
              />
              SEND
            </div>
          </SparkButton>
          <SparkButton className="rounded-2xl py-2" href="/wallet/deposit">
            <div className="flex-col flex items-center gap-1">
              <Image
                src="/arrow-diag.svg"
                alt="Arrow Diagonal"
                className="rotate-180"
                width={16}
                height={16}
              />
              RECEIVE
            </div>
          </SparkButton>
        </div>
        <div className="w-full max-w-md">
          <div className="h-[2px] w-full border-b border-solid border-[#F9F9F914] mb-6" />
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <Image src="/bitcoin.svg" alt="Bitcoin" width={40} height={40} />
              <span className="text-white text-lg font-semibold">Bitcoin</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white text-lg font-semibold">
                {formatBtcUSD()}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <Image
                src="/stablecoins.svg"
                alt="Stablecoins"
                width={40}
                height={40}
              />
              <span className="text-white text-lg font-semibold">
                Stablecoins
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white text-lg font-semibold">
                {formatStablecoinsUSD(stablecoinBalance)}
              </span>
            </div>
          </div>
          <div className="h-[2px] w-full border-b border-solid border-[#F9F9F914] mt-6" />
        </div>
        <div className="w-full max-w-md mt-4">
          <Activity />
        </div>
      </motion.main>
    </div>
  );
}
