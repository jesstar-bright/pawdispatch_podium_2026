import { KPIS, AGENT_ACTIVITIES, APPOINTMENTS } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#94a3b8",
  in_transit: "#f59e0b",
  grooming: "#38bdf8",
  completed: "#34d399",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  in_transit: "In Transit",
  grooming: "Grooming",
  completed: "Done",
  cancelled: "Cancelled",
};

export default function DashboardOverview() {
  const todayAppointments = APPOINTMENTS.filter((a) => a.date === "Today");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>Command Center</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>All agents running autonomously. Real-time overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{kpi.label}</p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: "#f1f5f9" }}>{kpi.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: "#34d399" }}>
              {kpi.change} vs last week
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Agent Activity Feed */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#e2e8f0" }}>
            Agent Activity Feed
          </h2>
          <div className="space-y-3">
            {AGENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ color: activity.color, background: `${activity.color}15`, border: `1px solid ${activity.color}30` }}
                >
                  {activity.agent}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "#cbd5e1" }}>{activity.action}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#e2e8f0" }}>
            Today&apos;s Appointments
          </h2>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
                    {apt.time} — {apt.petName} ({apt.breed})
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {apt.customerName} · {apt.groomer} · {apt.location}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: STATUS_COLORS[apt.status], background: `${STATUS_COLORS[apt.status]}15`, border: `1px solid ${STATUS_COLORS[apt.status]}30` }}
                >
                  {STATUS_LABELS[apt.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
