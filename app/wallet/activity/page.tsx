"use client";

import Link from "next/link";
import { X, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useWalletStore } from "../store";
import { useRouter } from "next/navigation";

// interface Transaction {
//   id: string;
//   type: "received" | "sent";
//   amount: number;
//   from: string;
//   date: Date;
// }

const formatRecipient = (value: string) => {
  const phonePattern = /^\+\d{10,}$/;
  if (phonePattern.test(value)) {
    return value.replace(/^(\+\d)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4");
  }
  return value;
};

export default function ActivityPage() {
  const activity = useWalletStore((state) => state.activity);
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const router = useRouter();

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
          {activity.length === 0 ? (
            <motion.p
              className="text-center font-bold text-muted-foreground py-8"
              variants={itemVariants}>
              No transactions yet
            </motion.p>
          ) : (
            <>
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
                          {transaction.type === "received"
                            ? "Received"
                            : "Sent"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {formatRecipient(transaction.from)}
                        </p>
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
                        {transaction.date instanceof Date
                          ? transaction.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                          : "Unknown Date"}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </>
          )}
        </section>
      </main>
    </motion.div>
  );
}
