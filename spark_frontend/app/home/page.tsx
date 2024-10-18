"use client";

import Link from "next/link";
import { useWalletStore } from "../wallet/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const { mnemonic } = useWalletStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && mnemonic) {
      router.replace("/wallet");
    }
  }, [mnemonic, router, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#10151C] flex flex-col p-6 font-[family-name:var(--font-decimal)] overflow-x-hidden">
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
        <p className="text-muted-foreground text-md text-center my-6">
          A Spark-enabled, self-custody
          <br />
          Bitcoin wallet
        </p>

        <div className="flex flex-col gap-2 mb-20">
          <Link
            href="/wallet/create"
            className="flex items-center justify-center gap-2 rounded-full bg-[#0E3154] text-white font-medium text-sm sm:text-base md:text-lg px-8 sm:px-10 py-6 hover:bg-[#1A4B7C] transition-colors duration-200 whitespace-nowrap w-full relative overflow-hidden border-2 border-black shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]">
            <Image src="/sparkles.svg" alt="Sparkles" width={30} height={29} />
            CREATE A NEW WALLET
          </Link>
          <Link
            href="/wallet/import"
            className="flex items-center justify-center gap-2 rounded-full bg-[rgba(14,49,84,0.2)] text-white font-medium text-sm sm:text-base md:text-lg px-8 sm:px-10 py-6 hover:bg-[rgba(14,49,84,0.5] transition-colors duration-200 whitespace-nowrap w-full relative overflow-hidden border-2 border-black shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]">
            <Image src="/key.svg" alt="Key" width={30} height={29} />I already
            have a wallet
          </Link>
        </div>
      </motion.main>
    </div>
  );
}
