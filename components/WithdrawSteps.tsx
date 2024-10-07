import { memo, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { truncatePubkey } from "@/lib/utils";

interface AddressStepProps {
  address: string;
  setAddress: (value: string) => void;
  error: string;
}

export const AddressStep = memo(
  ({ address, setAddress, error }: AddressStepProps) => {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6">
          Enter Bitcoin address or LN invoice
        </h2>
        <Input
          type="text"
          placeholder="Enter Bitcoin address or LN invoice"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-4 rounded-full shadow-none px-4 py-6 font-bold"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {/* Optionally, add a QR code scanner button */}
      </div>
    );
  }
);

AddressStep.displayName = "AddressStep";

interface AmountStepProps {
  amountCents: number;
  setAmountCents: React.Dispatch<React.SetStateAction<number>>;
  availableBalance: number;
}

export const AmountStep = ({
  amountCents,
  setAmountCents,
  availableBalance,
}: AmountStepProps) => {
  const MAX_AMOUNT_CENTS = 99999999;

  const handleNumberClick = useCallback(
    (digit: string) => {
      setAmountCents((prevAmount: number) =>
        Math.min(prevAmount * 10 + parseInt(digit), MAX_AMOUNT_CENTS)
      );
    },
    [setAmountCents]
  );

  const handleDelete = useCallback(() => {
    setAmountCents((prevAmount: number) => Math.floor(prevAmount / 10));
  }, [setAmountCents]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        handleNumberClick(event.key);
      } else if (event.key === "Backspace") {
        handleDelete();
      }
    },
    [handleNumberClick, handleDelete]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleUseMax = useCallback(() => {
    setAmountCents(
      Math.min(Math.round(availableBalance * 100), MAX_AMOUNT_CENTS)
    );
  }, [availableBalance, setAmountCents]);

  return (
    <div className="flex flex-col h-full">
      {/* Center the amount display */}
      <div className="flex-grow flex flex-col justify-center items-center">
        <p className="text-6xl font-bold mb-4">
          <span className="tabular-nums">
            $
            {(amountCents / 100).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
        <div className="flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
          <p className="text-base font-bold text-gray-700 px-3 py-2">
            Available: ${availableBalance.toFixed(2)}
          </p>
          <Button
            variant="outline"
            onClick={handleUseMax}
            className="text-sm font-bold py-2 px-3 h-full rounded-full border-l border border-gray-300">
            Use Max
          </Button>
        </div>
      </div>

      <div className="w-full max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-x-16 gap-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "delete"].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="aspect-square text-2xl font-bold p-0 h-auto"
              onClick={() => {
                if (item === "delete") {
                  handleDelete();
                } else if (item !== null) {
                  handleNumberClick(item.toString());
                }
              }}
              disabled={item === null}
              aria-label={item === "delete" ? "Delete" : item?.toString()}>
              {item === "delete" ? (
                <ChevronLeft className="h-6 w-6" strokeWidth={4} />
              ) : (
                item
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SummaryStepProps {
  amountCents: number;
  recipient: string;
}

export const SummaryStep = ({ amountCents, recipient }: SummaryStepProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col justify-center items-center mb-8">
        <p className="text-xl font-bold mb-2">You are Withdrawing</p>
        <p className="text-6xl font-bold mb-4">
          <span className="tabular-nums">
            $
            {(amountCents / 100).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">To</p>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-lg font-bold">{truncatePubkey(recipient, 12)}</p>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-500 font-bold">
          *Withdrawals cannot be reversed
        </p>
      </div>
    </div>
  );
};
