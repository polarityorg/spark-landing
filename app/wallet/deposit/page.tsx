"use client";

import Link from "next/link";
import { X, Copy } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DepositPage() {
  const [copyStatus, setCopyStatus] = useState({ bitcoin: "", lightning: "" });
  const bitcoinAddress = "BC1QYLH3U67J673H6Y6ALV70M0PL2YZ53TZHVXGG7U";
  const lightningInvoice =
    "LNBC10U1P3PJ257PP5YZTKWJCZ5FTL5LAXKAV23ZMZEKAW37ZK6KMV80PK4XAEV5QHTZ7QDPDWD3XGER9WD5KWM36YPRX7U3QD36KUCMGYP282ETNV3SHJCQZPGXQYZ5VQSP5USYC4LK9CHSFP53KVCNVQ456GANH60D89REYKDNGSMTJ6YW3NHVQ9QYYSSQJCEWM5CJWZ4A6RFJX77C490YCED6PEMK0UPKXHY89CMM7SCT66K8GNEANWYKZGDRWRFJE69H9U5U0W57RRCSYSAS7GADWMZXC8C6T0SPJAZUP6";
  const qrData = `bitcoin:${bitcoinAddress}?amount=0.00001&label=sbddesign%3A%20For%20lunch%20Tuesday&message=For%20lunch%20Tuesday&lightning=${lightningInvoice}`;

  const copyToClipboard = (text: string, type: "bitcoin" | "lightning") => {
    navigator.clipboard.writeText(text.toLowerCase()).then(() => {
      setCopyStatus({ ...copyStatus, [type]: "Copied!" });
      setTimeout(() => setCopyStatus({ ...copyStatus, [type]: "" }), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between p-6">
        <Link href="/wallet" aria-label="Back to wallet">
          <X className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold">Deposit</h1>
        <div className="w-6 h-6" aria-hidden="true" />
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow flex flex-col justify-center items-center px-6">
        <p className="mb-6 text-center text-gray-600 font-bold">
          Scan this QR code to deposit funds
        </p>
        <div className="bg-white p-4 rounded-3xl border border-gray-200">
          <QRCode
            value={qrData}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div className="mt-4 flex space-x-4 w-full">
          <Button
            onClick={() => copyToClipboard(bitcoinAddress, "bitcoin")}
            variant="outline"
            className="flex items-center px-3 py-2 w-1/2">
            <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate font-bold">
              {copyStatus.bitcoin || "Copy Bitcoin Address"}
            </span>
          </Button>
          <Button
            onClick={() => copyToClipboard(lightningInvoice, "lightning")}
            className="flex items-center px-3 py-2 w-1/2">
            <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate font-bold">
              {copyStatus.lightning || "Copy Lightning Invoice"}
            </span>
          </Button>
        </div>
      </motion.main>
    </div>
  );
}
