import { MARKETING_DATA } from "@/lib/dashboard-data";

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { background: string; color: string }> = {
    Proposed: { background: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    Active: { background: "rgba(52,211,153,0.15)", color: "#34d399" },
    Draft: { background: "rgba(100,116,139,0.18)", color: "#94a3b8" },
  };
  const s = styles[status] ?? styles.Draft;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
      style={s}
    >
      {status}
    </span>
  );
}

function ResultBadge({ result }: { result: string }) {
  const isPending = result.toLowerCase().includes("pending");
  const color = isPending ? "#f59e0b" : "#34d399";
  const bg = isPending ? "rgba(245,158,11,0.12)" : "rgba(52,211,153,0.12)";
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded"
      style={{ background: bg, color }}
    >
      {result}
    </span>
  );
}

export default function MarketingPage() {
  const { websiteMetrics, seoPerformance, recentActions, campaignIdeas } = MARKETING_DATA;

  return (
    <div style={{ color: "#f1f5f9" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#f1f5f9" }}>
            AI Marketing Agent
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Autonomous SEO, content, and campaign management
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
          <span style={{ fontSize: 16 }}>✨</span>
          <span>Powered by Google Gemini</span>
        </div>
      </div>

      {/* Website Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Visitors Today", value: websiteMetrics.visitorsToday.toString(), accent: "#38bdf8" },
          { label: "Conversion Rate", value: websiteMetrics.conversionRate, accent: "#34d399" },
          { label: "Top Landing Page", value: websiteMetrics.topLandingPage, accent: "#818cf8", small: true },
          { label: "Bounce Rate", value: websiteMetrics.bounceRate, accent: "#f59e0b" },
        ].map((metric) => (
          <div key={metric.label} style={{ ...card, padding: "20px 24px" }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>
              {metric.label}
            </p>
            <p
              className={`font-bold ${metric.small ? "text-lg" : "text-3xl"}`}
              style={{ color: metric.accent }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* SEO Performance Table */}
        <div style={{ ...card, padding: "24px" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: "#64748b" }}>
            SEO Performance
          </h2>
          <div className="space-y-1">
            {/* Table header */}
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
              const isPositive = !isNaN(changeNum) && changeNum > 0;
              const isNew = row.change === "new";
              return (
                <div
                  key={row.keyword}
                  className="grid items-center py-2.5"
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
                    className="text-xs font-semibold text-center"
                    style={{
                      color: isNew ? "#818cf8" : isPositive ? "#34d399" : "#f472b6",
                    }}
                  >
                    {isNew ? "NEW" : isPositive ? `▲ +${changeNum}` : `▼ ${row.change}`}
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
        <div style={{ ...card, padding: "24px" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: "#64748b" }}>
            Recent Agent Actions
          </h2>
          <div className="space-y-3">
            {recentActions.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-3"
                style={{ borderBottom: i < recentActions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
              >
                <div
                  className="flex-shrink-0 mt-0.5"
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
                    <ResultBadge result={item.result} />
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Ideas */}
      <div style={{ ...card, padding: "24px" }}>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#64748b" }}>
            Campaign Ideas
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>
            ✨ Gemini-generated
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {campaignIdeas.map((campaign) => (
            <div
              key={campaign.name}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="text-sm font-semibold leading-snug" style={{ color: "#f1f5f9" }}>
                  {campaign.name}
                </h3>
                <StatusPill status={campaign.status} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#64748b" }}>Segment:</span>
                  <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{campaign.segment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#64748b" }}>Channel:</span>
                  <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{campaign.channel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
