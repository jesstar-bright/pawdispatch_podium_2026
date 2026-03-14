import { MARKETING_DATA } from "@/lib/dashboard-data";
import { ArrowUp, ArrowDown } from "lucide-react";

const CAMPAIGN_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Active: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
  Proposed: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  Draft: { bg: "rgba(100,116,139,0.18)", color: "#94a3b8" },
};

export default function MarketingPage() {
  const { websiteMetrics, seoPerformance, recentActions, campaignIdeas } = MARKETING_DATA;

  const webMetrics = [
    { label: "Visitors Today", value: websiteMetrics.visitorsToday.toString(), color: "#38bdf8" },
    { label: "Conversion Rate", value: websiteMetrics.conversionRate, color: "#34d399" },
    { label: "Top Landing Page", value: websiteMetrics.topLandingPage, color: "#818cf8", small: true },
    { label: "Bounce Rate", value: websiteMetrics.bounceRate, color: "#f59e0b" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>
            AI Marketing Agent
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
            SEO, campaigns, and content optimization.
          </p>
        </div>
        {/* Gemini Badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(244,114,182,0.18))",
            border: "1px solid rgba(129,140,248,0.35)",
            color: "#c4b5fd",
          }}
        >
          <span>✨</span>
          <span>Powered by Google Gemini</span>
        </div>
      </div>

      {/* Website Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {webMetrics.map((m) => (
          <div key={m.label} className="glass-card p-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              {m.label}
            </p>
            <p
              className={`font-extrabold mt-1 ${m.small ? "text-lg" : "text-2xl"}`}
              style={{ color: m.color }}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* SEO + Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* SEO Performance */}
        <div className="glass-card p-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-5"
            style={{ color: "rgba(100,116,139,0.8)" }}
          >
            SEO Performance
          </h2>
          <div className="space-y-1">
            <div
              className="grid text-xs font-semibold uppercase tracking-wide pb-2"
              style={{
                gridTemplateColumns: "1fr 48px 64px 72px",
                color: "#64748b",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>Keyword</span>
              <span className="text-center">Rank</span>
              <span className="text-center">Change</span>
              <span className="text-right">Traffic</span>
            </div>
            {seoPerformance.map((row) => {
              const isTop = row.rank === 1;
              const changeNum = parseInt(row.change);
              const isNew = row.change === "new";
              const isPositive = !isNaN(changeNum) && changeNum > 0;
              return (
                <div
                  key={row.keyword}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "1fr 48px 64px 72px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: isTop ? "rgba(245,158,11,0.05)" : "transparent",
                    borderRadius: isTop ? 8 : 0,
                    padding: isTop ? "10px 8px" : "10px 0",
                  }}
                >
                  <span className="text-sm" style={{ color: isTop ? "#f59e0b" : "#f1f5f9" }}>
                    {isTop && <span className="mr-1">🥇</span>}
                    {row.keyword}
                  </span>
                  <span
                    className="text-sm font-bold text-center"
                    style={{ color: isTop ? "#f59e0b" : "#f1f5f9" }}
                  >
                    #{row.rank}
                  </span>
                  <span
                    className="text-xs font-semibold text-center inline-flex items-center justify-center gap-0.5"
                    style={{
                      color: isNew ? "#818cf8" : isPositive ? "#34d399" : "#f472b6",
                    }}
                  >
                    {isNew ? (
                      "NEW"
                    ) : isPositive ? (
                      <><ArrowUp className="h-3 w-3" />+{changeNum}</>
                    ) : (
                      <><ArrowDown className="h-3 w-3" />{row.change}</>
                    )}
                  </span>
                  <span className="text-sm text-right" style={{ color: "#94a3b8" }}>
                    {row.traffic.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Agent Actions */}
        <div className="glass-card p-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-5"
            style={{ color: "rgba(100,116,139,0.8)" }}
          >
            Recent Agent Actions
          </h2>
          <div className="space-y-3">
            {recentActions.map((item, i) => {
              const isPending = item.result.toLowerCase().includes("pending");
              const resultColor = isPending ? "#f59e0b" : "#34d399";
              const resultBg = isPending ? "rgba(245,158,11,0.12)" : "rgba(52,211,153,0.12)";
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-3"
                  style={{
                    borderBottom:
                      i < recentActions.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#818cf8",
                      marginTop: 6,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug mb-1.5" style={{ color: "#f1f5f9" }}>
                      {item.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: resultBg, color: resultColor }}
                      >
                        {item.result}
                      </span>
                      <span className="text-xs" style={{ color: "#64748b" }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaign Ideas */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "rgba(100,116,139,0.8)" }}
          >
            Campaign Ideas
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}
          >
            ✨ Gemini-generated
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {campaignIdeas.map((c) => {
            const s = CAMPAIGN_STATUS_COLORS[c.status] ?? CAMPAIGN_STATUS_COLORS.Draft;
            return (
              <div
                key={c.name}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-sm font-semibold leading-snug" style={{ color: "#f1f5f9" }}>
                    {c.name}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={s}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#64748b" }}>Segment:</span>
                    <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{c.segment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#64748b" }}>Channel:</span>
                    <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{c.channel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
