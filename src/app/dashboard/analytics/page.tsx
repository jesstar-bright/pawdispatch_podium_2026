import {
  getWeeklyRevenue,
  getMarketStats,
  getGroomerStats,
  getCustomerMetrics,
} from "@/lib/db/queries";

export default async function AnalyticsPage() {
  const [weekly, topMarkets, groomerUtilization, customerMetrics] = await Promise.all([
    getWeeklyRevenue(),
    getMarketStats(),
    getGroomerStats(),
    getCustomerMetrics(),
  ]);

  const maxWeeklyRevenue = Math.max(...weekly.map((d) => d.revenue), 1);
  const maxBookings = Math.max(...topMarkets.map((m) => m.bookings), 1);

  const metrics = [
    { label: "Total Customers", value: customerMetrics.totalCustomers.toString(), color: "#38bdf8" },
    { label: "Repeat Rate", value: customerMetrics.repeatRate, color: "#818cf8" },
    { label: "Avg Lifetime Value", value: customerMetrics.avgLifetimeValue, color: "#34d399" },
    { label: "Churn Rate", value: customerMetrics.churnRate, color: "#f59e0b" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
          Revenue, markets, and customer insights.
        </p>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="glass-card p-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              {m.label}
            </p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: m.color }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Revenue Chart */}
      <div className="glass-card p-6 mb-6">
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-6"
          style={{ color: "rgba(100,116,139,0.8)" }}
        >
          Weekly Revenue
        </h2>
        <div className="flex items-end gap-3" style={{ height: 160 }}>
          {weekly.map((d) => {
            const heightPx = Math.round((d.revenue / maxWeeklyRevenue) * 120);
            const revenueInDollars = d.revenue / 100; // Convert cents to dollars
            return (
              <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
                  {revenueInDollars >= 1000
                    ? `$${(revenueInDollars / 1000).toFixed(1)}k`
                    : `$${Math.round(revenueInDollars)}`}
                </span>
                <div
                  style={{
                    height: heightPx,
                    width: "100%",
                    borderRadius: 6,
                    background: "linear-gradient(to top, #38bdf8, #818cf8)",
                    minHeight: 8,
                  }}
                />
                <span className="text-xs" style={{ color: "#64748b" }}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Markets + Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Markets */}
        <div className="glass-card p-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-5"
            style={{ color: "rgba(100,116,139,0.8)" }}
          >
            Top Markets
          </h2>
          <div className="space-y-1">
            <div
              className="grid text-xs font-semibold uppercase tracking-wide pb-2"
              style={{
                gridTemplateColumns: "1fr 56px 80px",
                color: "#64748b",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>Area</span>
              <span className="text-center">Bookings</span>
              <span className="text-right">Revenue</span>
            </div>
            {topMarkets.map((market) => {
              const barWidth = Math.round((market.bookings / maxBookings) * 100);
              return (
                <div key={market.area} className="pt-2">
                  <div className="grid items-center mb-1.5" style={{ gridTemplateColumns: "1fr 56px 80px" }}>
                    <span className="text-sm font-medium" style={{ color: "#f1f5f9" }}>
                      {market.area}
                    </span>
                    <span className="text-sm text-center" style={{ color: "#94a3b8" }}>
                      {market.bookings}
                    </span>
                    <span className="text-sm font-medium text-right" style={{ color: "#34d399" }}>
                      ${market.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        borderRadius: 2,
                        background: "linear-gradient(to right, #38bdf8, #818cf8)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Groomer Utilization */}
        <div className="glass-card p-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-5"
            style={{ color: "rgba(100,116,139,0.8)" }}
          >
            Groomer Utilization
          </h2>
          <div className="space-y-4">
            {groomerUtilization.map((g) => (
              <div key={g.name} className="glass-card-inner p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                    {g.name}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
                  >
                    {g.utilization}%
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: "#64748b" }}>
                  {g.appointments} appointments today
                </p>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${g.utilization}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: "#34d399",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
