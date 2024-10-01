"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Settings, Plus, ArrowDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Wallet() {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-md text-black mb-4 bg-gray-100 p-3 rounded-xl font-bold">
          My Balance
        </h2>
        <p className="text-6xl font-bold mb-1">$0.10</p>
        <p className="text-gray-300 font-bold mb-8">100k sats</p>

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
              <ArrowDown className="w-3 h-3 text-gray-100" strokeWidth={4} />
            </div>
            Withdraw
          </Link>
        </div>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mb-16">
        <Link href="/wallet/send" className="w-full">
          <Button className="w-full py-6 font-bold text-lg rounded-3xl">
            Send/Request money
          </Button>
        </Link>
      </motion.footer>
    </div>
  );
}
