"use client";

import Link from "next/link";
import { X, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useWalletStore } from "../store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// interface Transaction {
//   id: string;
//   type: "received" | "sent";
//   amount: number;
//   from: string;
//   date: Date;
// }

export default function ActivityPage() {
  const activity = useWalletStore((state) => state.activity);
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const router = useRouter();

  useEffect(() => {
    if (!mnemonic) {
      router.replace("/");
    } else {
      // Optionally, fetch and set activity here
      // For now, we'll use dummy data
      if (activity.length === 0) {
        useWalletStore.getState().setActivity([
          {
            id: "1",
            type: "received",
            amount: 0.1,
            from: "+1 321 591 3342",
            date: new Date("2023-08-20T13:59:00"),
          },
          // ... more dummy transactions ...
        ]);
      }
    }
  }, [mnemonic, router, activity.length]);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-white p-6 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <Link
            href="/wallet"
            className="inline-block"
            aria-label="Back to wallet">
            <X className="w-6 h-6 text-gray-900" />
          </Link>
        </motion.div>
        <motion.h1 className="text-3xl font-bold mt-4" variants={itemVariants}>
          Activity
        </motion.h1>
      </header>

      <main>
        <section>
          <motion.h2
            className="text-xl font-bold text-gray-400 mb-4"
            variants={itemVariants}>
            Completed
          </motion.h2>
          <motion.ul className="space-y-4">
            {activity.map((transaction, index) => (
              <motion.li
                key={index}
                className="flex items-center justify-between"
                variants={itemVariants}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <DollarSign
                      className="w-6 h-6 text-gray-600"
                      strokeWidth={3}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {transaction.type === "received" ? "Received" : "Sent"}
                    </p>
                    <p className="text-gray-500 text-sm">{transaction.from}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === "received"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {transaction.type === "received" ? "+" : "-"} $
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {transaction.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </main>
    </motion.div>
  );
}
