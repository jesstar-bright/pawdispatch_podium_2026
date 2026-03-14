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

const SIZE_COLORS: Record<string, { background: string; color: string }> = {
  small: { background: "rgba(22,163,74,0.2)", color: "#4ade80" },
  medium: { background: "rgba(37,99,235,0.2)", color: "#60a5fa" },
  large: { background: "rgba(234,88,12,0.2)", color: "#fb923c" },
  xlarge: { background: "rgba(220,38,38,0.2)", color: "#f87171" },
};

export default function PricingCard({ estimate }: PricingCardProps) {
  const sizeStyle = SIZE_COLORS[estimate.sizeCategory] || { background: "rgba(255,255,255,0.08)", color: "#94a3b8" };

  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>Price Estimate</h2>
        <span
          className="rounded-full px-3 py-1 text-sm font-medium"
          style={sizeStyle}
        >
          {SIZE_LABELS[estimate.sizeCategory] || estimate.sizeCategory}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm" style={{ color: "#94a3b8" }}>
          <span>Base grooming price</span>
          <span>{formatPrice(estimate.basePrice)}</span>
        </div>
        {estimate.adjustments.map((adj, i) => (
          <div key={i} className="flex justify-between text-sm" style={{ color: "#94a3b8" }}>
            <span>{adj.reason}</span>
            <span>+{formatPrice(adj.amount)}</span>
          </div>
        ))}
        <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex justify-between text-lg font-bold" style={{ color: "#f1f5f9" }}>
            <span>Total</span>
            <span>{formatPrice(estimate.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm font-medium" style={{ color: "#38bdf8" }}>AI Analysis</p>
        <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>{estimate.explanation}</p>
      </div>
    </div>
  );
}
