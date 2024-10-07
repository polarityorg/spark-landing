"use client";

import Link from "next/link";
import { X, Phone, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "../store";
import { useRouter } from "next/navigation";
import { truncatePubkey } from "@/lib/utils";

export default function SettingsPage() {
  const clearMnemonic = useWalletStore((state) => state.clearMnemonic);
  const router = useRouter();
  const phoneNumber = useWalletStore((state) => state.phoneNumber);
  const pubkey = useWalletStore((state) => state.pubkey);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      clearMnemonic();
      router.replace("/home");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-20">
        <Link href="/wallet" aria-label="Back to wallet">
          <Button variant="ghost" size="icon">
            <X className="w-6 h-6" strokeWidth={2.5} />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">My Account</h1>
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <motion.span
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow w-full flex flex-col items-center justify-center space-y-8">
        <section className="w-full">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <div className="bg-gray-50 rounded-lg w-full">
            <div className="flex items-center py-4 px-4">
              <div className="w-10 flex justify-center">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-base font-bold">
                {phoneNumber
                  ? phoneNumber.replace(
                      /^(\+\d)(\d{3})(\d{3})(\d{4})$/,
                      "$1 ($2) $3-$4"
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="flex items-center py-4 px-4">
              <div className="w-10 flex justify-center">
                <KeyRound className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-base font-bold">
                {truncatePubkey(pubkey || "", 12)}
              </p>
            </div>
          </div>
        </section>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        <Button
          onClick={handleLogout}
          className="w-full py-6 font-bold text-lg rounded-full shadow-none">
          Log Out
        </Button>
      </motion.footer>
    </div>
  );
}
