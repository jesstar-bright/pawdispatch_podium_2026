import { formatPrice } from "@/lib/api";
import type { PricingEstimate } from "@/lib/api";

const SIZE_STYLES: Record<string, { color: string; bg: string }> = {
  small: { color: "text-green-400", bg: "bg-green-500/20" },
  medium: { color: "text-blue-400", bg: "bg-blue-500/20" },
  large: { color: "text-orange-400", bg: "bg-orange-500/20" },
  xlarge: { color: "text-red-400", bg: "bg-red-500/20" },
};

// Inline SVG icon for Sparkles (used in AI Analysis section)
function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-paw-cyan"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export default function PricingCard({ estimate }: { estimate: PricingEstimate }) {
  const size = SIZE_STYLES[estimate.sizeCategory] || SIZE_STYLES.medium;

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Price Breakdown</h2>
        <span className={`status-badge ${size.bg} ${size.color}`}>
          {estimate.sizeCategory.charAt(0).toUpperCase() + estimate.sizeCategory.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base grooming</span>
          <span className="text-foreground font-medium">{formatPrice(estimate.basePrice)}</span>
        </div>
        {estimate.adjustments.map((adj, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{adj.reason}</span>
            <span className="text-foreground font-medium">+{formatPrice(adj.amount)}</span>
          </div>
        ))}
        <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-2xl font-extrabold gradient-text-brand">
            {formatPrice(estimate.totalPrice)}
          </span>
        </div>
      </div>

      <div className="glass-card-inner p-4">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon />
          <span className="text-xs font-bold uppercase tracking-wider text-paw-cyan">AI Analysis</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{estimate.explanation}</p>
      </div>
    </div>
  );
}
