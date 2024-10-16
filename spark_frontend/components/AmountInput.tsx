import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AmountInputProps {
  amountCents: number;
  setAmountCents: React.Dispatch<React.SetStateAction<number>>;
}

export const AmountInput = memo(
  ({ amountCents, setAmountCents }: AmountInputProps) => {
    const formatUSD = (amount: number) => {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    };

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => setError(null), 1000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    const MAX_AMOUNT_CENTS = 1000000; // $10,000 in cents

    const handleNumberClick = useCallback(
      (digit: string) => {
        setAmountCents((prevAmount: number) => {
          const newAmount = prevAmount * 10 + parseInt(digit);
          if (newAmount > MAX_AMOUNT_CENTS) {
            setError("Maximum amount is $10,000");
            return prevAmount;
          }
          return newAmount;
        });
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
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }, [handleKeyPress]);

    return (
      <div className="flex flex-col h-full w-full mb-20">
        <div className="flex-grow flex flex-col justify-center items-center">
          <p className="text-6xl font-bold mb-4">
            <span className="tabular-nums">{formatUSD(amountCents / 100)}</span>
          </p>
          {error && (
            <p className="text-red-500 text-center absolute left-1/2 transform -translate-x-1/2">
              {error}
            </p>
          )}
        </div>
        <div className="w-full max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-x-16 gap-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "delete"].map(
              (item, index) => (
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
              )
            )}
          </div>
        </div>
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
