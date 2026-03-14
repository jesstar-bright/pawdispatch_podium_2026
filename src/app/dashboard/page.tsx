import { KPIS, AGENT_ACTIVITIES, APPOINTMENTS } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  in_transit: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  grooming: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
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
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>
          Command Center
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
          All agents running autonomously. Real-time overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="glass-card p-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              {kpi.label}
            </p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: "#f1f5f9" }}>
              {kpi.value}
            </p>
            <p className="text-xs font-medium mt-1" style={{ color: "#34d399" }}>
              {kpi.change} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Activity + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agent Activity Feed */}
        <div className="glass-card p-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            Agent Activity
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {AGENT_ACTIVITIES.map((act) => (
              <div key={act.id} className="flex gap-3 text-sm">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                  style={{
                    color: act.color,
                    background: act.color + "15",
                    border: `1px solid ${act.color}30`,
                  }}
                >
                  {act.agent}
                </span>
                <div className="flex-1">
                  <p style={{ color: "#94a3b8" }}>{act.action}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(71,85,105,0.8)" }}
                  >
                    {act.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="glass-card p-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            Today&apos;s Appointments
          </h2>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-card-inner flex items-center justify-between p-3"
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#f1f5f9" }}>
                    {apt.customerName} — {apt.petName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    {apt.time} · {apt.groomer} · {apt.location}
                  </p>
                </div>
                <span className={`status-badge border ${STATUS_COLORS[apt.status]}`}>
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
