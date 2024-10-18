"use client";

import Link from "next/link";
import { X, Phone, KeyRound, Eye, EyeOff, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "../store";
import { useRouter } from "next/navigation";
import { truncatePubkey } from "@/lib/utils";
import SparkButton from "@/components/SparkButton";
import { useState } from "react";

export default function SettingsPage() {
  const clearMnemonic = useWalletStore((state) => state.clearMnemonic);
  const router = useRouter();
  const phoneNumber = useWalletStore((state) => state.phoneNumber);
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const pubkey = useWalletStore((state) => state.pubkey);

  // Add state to manage mnemonic visibility
  const [showMnemonic, setShowMnemonic] = useState(false);

  // Add state to manage copy icon
  const [isCopied, setIsCopied] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      clearMnemonic();
      router.replace("/home");
    }
  };

  // Function to toggle mnemonic visibility
  const handleToggleMnemonic = () => {
    setShowMnemonic(!showMnemonic);
  };

  // Updated function to copy mnemonic to clipboard
  const handleCopyMnemonic = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 font-[family-name:var(--font-decimal)]">
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
        <div className="w-8 h-8 rounded-full flex items-center justify-center"></div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow w-full flex flex-col items-center justify-center space-y-8">
        <section className="w-full">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <div className="bg-gray-800 rounded-lg w-full">
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

        {/* Updated Backup Section */}
        <section className="w-full mt-6">
          <h2 className="text-lg font-semibold mb-3">Mnemonic Backup</h2>
          <div className="bg-gray-800 rounded-lg w-full">
            <div className="flex flex-col py-4 px-4">
              <div className="mb-4">
                <p
                  className={`text-base font-bold h-32 overflow-auto p-4 ${
                    !showMnemonic ? "filter blur-lg" : ""
                  }`}>
                  {mnemonic}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleMnemonic}
                  className="focus:bg-transparent">
                  {showMnemonic ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyMnemonic}
                  className="focus:bg-transparent">
                  {isCopied ? (
                    <Check className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pb-[calc(4.5em+env(safe-area-inset-bottom))]">
        <SparkButton onClick={handleLogout}>Log Out</SparkButton>
      </motion.footer>
    </div>
  );
}
