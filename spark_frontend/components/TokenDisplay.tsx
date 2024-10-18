import React from "react";
// import { formatSats } from "@/utils/validation";

export interface TokenDisplayProps {
  usdAmount: number;
  subtitleAmount: number;
  subtitleAsset: string;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  usdAmount,
  subtitleAmount,
  subtitleAsset,
}) => {
  const formatUsd = (usdAmount: number) => {
    const formatted = usdAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatted.slice(1); // Remove the dollar sign
  };

  return (
    <div
      className="border-[0.5px] border-solid rounded-2xl w-full max-w-md p-8 mb-4 shadow-lg flex flex-col justify-center items-center min-h-[200px] overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #141A22 0%, #141A22 11.79%, #131A22 21.38%, #131922 29.12%, #131922 35.34%, #131921 40.37%, #131921 44.56%, #121820 48.24%, #121820 51.76%, #12171F 55.44%, #11171F 59.63%, #11171E 64.66%, #11161E 70.88%, #11161D 78.62%, #10151C 88.21%, #10151C 100%)",
      }}>
      <p className="text-5xl font-bold mb-4 text-white text-center">
        $<span>{formatUsd(usdAmount).split(".")[0]}</span>
        <span className="text-3xl">.{formatUsd(usdAmount).split(".")[1]}</span>
      </p>
      <p className="text-gray-300 font-bold text-center text-xl">
        {subtitleAmount} {subtitleAsset}
      </p>
    </div>
  );
};

TokenDisplay.displayName = "TokenDisplay";
