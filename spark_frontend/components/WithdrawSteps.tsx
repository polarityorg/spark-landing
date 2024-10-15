import { memo } from "react";
import { Input } from "@/components/ui/input";

interface InvoiceStepProps {
  invoice: string;
  setInvoice: (value: string) => void;
  error: string;
}

export const InvoiceStep = memo(
  ({ invoice, setInvoice, error }: InvoiceStepProps) => {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6">Enter Lightning Invoice</h2>
        <Input
          type="text"
          placeholder="Lightning Invoice"
          value={invoice}
          onChange={(e) => setInvoice(e.target.value)}
          className="mt-4 rounded-lg shadow-none px-4 py-6 font-bold"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {/* Optionally, add a QR code scanner button */}
      </div>
    );
  }
);

InvoiceStep.displayName = "InvoiceStep";

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
          <p className="text-lg font-bold">{truncateInvoice(recipient)}</p>
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

// Utility function to truncate Lightning invoices for display
function truncateInvoice(invoice: string, length: number = 12) {
  return invoice.length > length
    ? `${invoice.substring(0, length)}...`
    : invoice;
}
