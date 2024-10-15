import { memo } from "react";
import { PhoneInput } from "@/components/phone-input";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { truncatePubkey } from "@/lib/utils";

interface ToStepProps {
  recipient: string;
  setRecipient: (value: string) => void;
  inputType: "phone" | "publicKey";
  toggleInputType: () => void;
  setError: (value: string) => void;
}

export const ToStep = memo(
  ({ recipient, setRecipient, inputType, toggleInputType }: ToStepProps) => {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6">Who will receive the money?</h2>
        {inputType === "phone" ? (
          <PhoneInput value={recipient} onChange={setRecipient} />
        ) : (
          <Input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter public key"
            className="w-full px-2 py-6 border rounded-lg shadow-none"
          />
        )}
        <Button
          variant="link"
          onClick={toggleInputType}
          className="mt-2 text-sm text-gray-600 self-start p-0">
          {inputType === "phone"
            ? "Or send to a public key"
            : "Or send to a phone number"}
        </Button>
      </div>
    );
  }
);

ToStep.displayName = "ToStep";

interface SummaryStepProps {
  amountCents: number;
  recipient: string;
}

export const SummaryStep = ({ amountCents, recipient }: SummaryStepProps) => {
  const formatRecipient = (value: string) => {
    const phonePattern = /^\+\d{10,15}$/;
    if (phonePattern.test(value)) {
      return value.replace(/^(\+\d)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4");
    } else {
      return truncatePubkey(value, 12);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col justify-center items-center mb-8">
        <p className="text-xl font-bold mb-2">You are Sending</p>
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
          <p className="text-lg font-bold">{formatRecipient(recipient)}</p>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-500 font-bold">
          *Transfers cannot be reversed
        </p>
      </div>
    </div>
  );
};
