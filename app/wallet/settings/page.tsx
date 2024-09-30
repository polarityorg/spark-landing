"use client";

import Link from "next/link";
import { X, Phone, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-between p-6">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-grow flex flex-col px-6 pt-8 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <p className="font-bold">+1 650 644 8779</p>
              </div>
            </div>
          </div>{" "}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Settings</h2>
          <Button className="w-full bg-gray-50 rounded-lg divide-y divide-gray-200 hover:bg-gray-100 transition-colors duration-200 shadow-none py-6">
            <div className="flex items-center justify-between p-4 w-full">
              <div className="flex items-center">
                <LogOut className="w-5 h-5 text-red-500 mr-3" />
                <p className="font-bold text-red-500">Log Out</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Button>
        </section>
      </motion.main>
    </div>
  );
}
