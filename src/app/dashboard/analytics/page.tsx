import { REVENUE_DATA } from "@/lib/dashboard-data";

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

const maxWeeklyRevenue = Math.max(...REVENUE_DATA.weekly.map((d) => d.revenue));
const maxBookings = Math.max(...REVENUE_DATA.topMarkets.map((m) => m.bookings));

export default function AnalyticsPage() {
  const { customerMetrics, weekly, topMarkets, groomerUtilization } = REVENUE_DATA;

  return (
    <div style={{ color: "#f1f5f9" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#f1f5f9" }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: "#94a3b8" }}>Revenue, customers, and operational insights</p>
      </div>

      {/* Customer Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Customers", value: customerMetrics.totalCustomers.toString(), accent: "#38bdf8" },
          { label: "Repeat Rate", value: customerMetrics.repeatRate, accent: "#818cf8" },
          { label: "Avg Lifetime Value", value: customerMetrics.avgLifetimeValue, accent: "#34d399" },
          { label: "Churn Rate", value: customerMetrics.churnRate, accent: "#f59e0b" },
        ].map((metric) => (
          <div key={metric.label} style={{ ...card, padding: "20px 24px" }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>
              {metric.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: metric.accent }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div style={{ ...card, padding: "24px", marginBottom: "24px" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-6" style={{ color: "#64748b" }}>
          Weekly Revenue
        </h2>
        <div className="flex items-end gap-3" style={{ height: 160 }}>
          {weekly.map((d) => {
            const heightPx = Math.round((d.revenue / maxWeeklyRevenue) * 120);
            return (
              <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
                  ${(d.revenue / 1000).toFixed(1)}k
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

      <div className="grid grid-cols-2 gap-6">
        {/* Top Markets Table */}
        <div style={{ ...card, padding: "24px" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: "#64748b" }}>
            Top Markets
          </h2>
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wide pb-2" style={{ color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span>Area</span>
              <span className="text-center">Bookings</span>
              <span className="text-right">Revenue</span>
            </div>
            {topMarkets.map((market) => {
              const barWidth = Math.round((market.bookings / maxBookings) * 100);
              return (
                <div key={market.area}>
                  <div className="grid grid-cols-3 items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: "#f1f5f9" }}>
                      {market.area}
                    </span>
                    <span className="text-sm text-center" style={{ color: "#94a3b8" }}>
                      {market.bookings}
                    </span>
                    <span className="text-sm font-medium text-right" style={{ color: "#34d399" }}>
                      ${(market.revenue / 100).toFixed(0)}
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
        <div style={{ ...card, padding: "24px" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: "#64748b" }}>
            Groomer Utilization
          </h2>
          <div className="space-y-5">
            {groomerUtilization.map((groomer) => (
              <div key={groomer.name} style={{ ...card, padding: "16px 20px" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                    {groomer.name}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                    {groomer.utilization}%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {groomer.appointments} appointments
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${groomer.utilization}%`,
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
