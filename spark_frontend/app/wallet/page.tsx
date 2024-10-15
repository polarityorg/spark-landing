"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "./store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Settings,
  Clock,
  Copy,
  Check,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { truncatePubkey } from "@/lib/utils";
import { formatSats } from "@/utils/validation";

export default function Wallet() {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const balance = useWalletStore((state) => state.balance);
  const pubkey = useWalletStore((state) => state.pubkey);
  const setBalance = useWalletStore((state) => state.setBalance);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const btcPrice = useWalletStore((state) => state.btcPrice);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!mnemonic) {
        router.replace("/home");
      }
    }
  }, [mnemonic, router, setBalance, mounted, balance]);

  if (!mounted) {
    return null;
  }

  if (!mnemonic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const copyPubkey = () => {
    if (pubkey) {
      navigator.clipboard.writeText(pubkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatUSD = (sats: number) => {
    const btcAmount = sats / 100000000;
    const usdAmount = btcAmount * btcPrice;
    return usdAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center mb-20">
        <div className="text-xl font-bold">
          <Image
            className="dark:invert"
            src="/spark.svg"
            alt="Next.js logo"
            width={90}
            height={19}
            priority
          />
        </div>
        <div className="flex gap-4">
          <Link
            className="bg-gray-100 rounded-full p-2"
            href="/wallet/activity">
            <Clock className="w-6 h-6 text-black" strokeWidth={2.5} />
          </Link>
          <Link
            className="bg-gray-100 rounded-full p-2"
            href="/wallet/settings">
            <Settings className="w-6 h-6 text-black" strokeWidth={2.5} />
          </Link>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center">
        <Button
          onClick={copyPubkey}
          className="text-md text-black mb-4 bg-gray-100 p-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors duration-200">
          {copied ? (
            <Check className="w-4 h-4 " />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {truncatePubkey(pubkey || "")}
        </Button>
        <p className="text-6xl font-bold mb-1">{formatUSD(balance)}</p>
        <p className="text-gray-300 font-bold mb-8">
          {formatSats(balance)} sats
        </p>

        <div className="flex gap-4 mb-20">
          <Link
            className="flex items-center gap-2 rounded-xl bg-gray-100 text-black font-bold shadow-none text-md px-4 py-3 hover:bg-gray-200 transition-colors duration-200"
            href="/wallet/deposit">
            <div className="bg-black rounded-full p-1">
              <Plus className="w-3 h-3 text-gray-100" strokeWidth={5} />
            </div>
            Add Funds
          </Link>
          <Link
            className="flex items-center gap-2 rounded-xl bg-gray-100 text-black font-bold shadow-none text-md px-4 py-3 hover:bg-gray-200 transition-colors duration-200"
            href="/wallet/withdraw">
            <div className="bg-black rounded-full p-1">
              <ArrowUp className="w-3 h-3 text-gray-100" strokeWidth={4} />
            </div>
            Withdraw
          </Link>
        </div>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        <Link href="/wallet/send" className="w-full h-full">
          <Button className="w-full py-6 font-bold text-lg rounded-full">
            Send Money
          </Button>
        </Link>
      </motion.footer>
    </div>
  );
}
