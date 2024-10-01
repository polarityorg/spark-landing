"use client";

import Link from "next/link";
import { useWalletStore } from "../wallet/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Cloud, Plus } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center">
        <Image
          className="dark:invert mb-10"
          src="/spark.svg"
          alt="Spark Logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 mb-20">
          {[
            { href: "/wallet/import", icon: Cloud, text: "Import Wallet" },
            { href: "/wallet/create", icon: Plus, text: "Create Wallet" },
          ].map(({ href, icon: Icon, text }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-xl bg-gray-100 text-black font-bold shadow-none text-md px-4 py-3 hover:bg-gray-200 transition-colors duration-200">
              <div className="bg-black rounded-full p-1">
                <Icon
                  className="w-3 h-3 text-gray-100"
                  strokeWidth={text === "Import Wallet" ? 5 : 4}
                />
              </div>
              {text}
            </Link>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
