"use client";

import { useWalletStore } from "@/app/wallet/store";

export default function Activity() {
  const activity = useWalletStore((state) => state.activity);
  const btcPrice = useWalletStore((state) => state.btcPrice);

  // Helper functions
  const formatCurrencyAmount = (amount: number, currency: string) => {
    if (currency === "BTC") {
      return `${(amount / 100000000).toFixed(8)} ${currency}`; // Convert sats to BTC
    } else {
      return `${amount.toFixed(2)} ${currency}`; // Assuming stablecoins are in standard units
    }
  };

  const formatUsdAmount = (amount: number, currency: string) => {
    if (currency === "BTC") {
      const btcAmount = amount / 100000000;
      return (btcAmount * btcPrice).toFixed(2);
    } else {
      return amount.toFixed(2); // Assuming stablecoins are pegged to USD
    }
  };

  return (
    <div className="font-[family-name:var(--font-decimal)]">
      <main>
        <section>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-12">
              <p className="text-xl font-semibold text-[#F9F9F9] mb-2">
                Your wallet activity starts now
              </p>
              <p className="text-gray-500 text-center">
                Add or receive BTC or Stablecoins to see your activity here.
              </p>
            </div>
          ) : (
            <ul className="space-y-4 w-full">
              {activity.map((transaction) => {
                const usdAmount = formatUsdAmount(
                  transaction.amount,
                  transaction.currency
                );
                const currencyAmount = formatCurrencyAmount(
                  transaction.amount,
                  transaction.currency
                );
                const timestamp = transaction.date
                  ? new Date(transaction.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                  : "Unknown Date";

                // Determine the text color based on transaction type
                const amountClass =
                  transaction.type === "sent"
                    ? "text-red-500"
                    : "text-green-500";

                return (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between px-4 py-2 rounded-md">
                    <div>
                      <p className="font-semibold text-[#F9F9F9]">
                        {transaction.type === "received"
                          ? `Received ${transaction.currency}`
                          : transaction.type === "withdraw"
                            ? `Withdrawn ${transaction.currency}`
                            : transaction.type === "deposit"
                              ? `Deposited ${transaction.currency}`
                              : `Sent ${transaction.currency}`}
                      </p>
                      <p className="text-gray-500 text-sm">{timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${amountClass}`}>
                        ${usdAmount}
                      </p>
                      <p className="text-gray-500 text-sm">{currencyAmount}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
