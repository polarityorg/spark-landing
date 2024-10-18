import { ChevronRight } from "lucide-react";
import Image from "next/image";

export const AssetSelector: React.FC<{
  onClick: () => void;
  imageSrc: string;
  altText: string;
  payWithText: string;
  balanceUSD: string;
  balanceCrypto: string;
  showPayWith?: boolean;
}> = ({
  onClick,
  imageSrc,
  altText,
  payWithText,
  balanceUSD,
  balanceCrypto,
  showPayWith = true,
}) => (
  <div
    className="mt-8 border-b border-[#F9F9F14] rounded-sm flex items-center p-1 w-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
    onClick={onClick}>
    <div className="ml-2 mr-2 p-2">
      <Image src={imageSrc} alt={altText} width={40} height={40} />
    </div>
    <div className="flex flex-col">
      <div className="text-white font-bold">
        {showPayWith ? `Pay with ${payWithText}` : payWithText}
      </div>
      <div className="text-xs text-gray-400">Available Balance</div>
    </div>
    <div className="flex-grow"></div>
    <div className="flex flex-col text-right">
      <div className="text-white font-bold">{balanceUSD}</div>
      <div className="text-xs text-gray-400">{balanceCrypto}</div>
    </div>
    <div className="ml-2 mr-2 p-2">
      <ChevronRight className="h-4 w-4 text-[#4C5D72]" />
    </div>
  </div>
);
