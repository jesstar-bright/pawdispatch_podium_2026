import { formatPrice } from "@/lib/api";
import type { PricingEstimate } from "@/lib/api";

interface PricingCardProps {
  estimate: PricingEstimate;
}

const SIZE_LABELS: Record<string, string> = {
  small: "Small (< 15 lbs)",
  medium: "Medium (15-40 lbs)",
  large: "Large (40-80 lbs)",
  xlarge: "X-Large (80+ lbs)",
};

const SIZE_COLORS: Record<string, string> = {
  small: "bg-green-100 text-green-800",
  medium: "bg-blue-100 text-blue-800",
  large: "bg-orange-100 text-orange-800",
  xlarge: "bg-red-100 text-red-800",
};

export default function PricingCard({ estimate }: PricingCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Price Estimate</h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${SIZE_COLORS[estimate.sizeCategory] || "bg-zinc-100 text-zinc-800"}`}
        >
          {SIZE_LABELS[estimate.sizeCategory] || estimate.sizeCategory}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Base grooming price</span>
          <span>{formatPrice(estimate.basePrice)}</span>
        </div>
        {estimate.adjustments.map((adj, i) => (
          <div key={i} className="flex justify-between text-sm text-zinc-600">
            <span>{adj.reason}</span>
            <span>+{formatPrice(adj.amount)}</span>
          </div>
        ))}
        <div className="border-t border-zinc-200 pt-2">
          <div className="flex justify-between text-lg font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(estimate.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-paw-gray p-4">
        <p className="text-sm font-medium text-zinc-700">AI Analysis</p>
        <p className="mt-1 text-sm text-zinc-600">{estimate.explanation}</p>
      </div>
    </div>
  );
}
