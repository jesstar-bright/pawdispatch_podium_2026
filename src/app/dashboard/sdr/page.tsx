import { LEADS, Lead } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  contacted: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  qualified: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  booked: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  lost: "text-red-400 bg-red-500/10 border-red-500/20",
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  booked: "Booked",
  lost: "Lost",
};

const FUNNEL_STAGES: { key: Lead["status"]; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#38bdf8" },
  { key: "contacted", label: "Contacted", color: "#f59e0b" },
  { key: "qualified", label: "Qualified", color: "#818cf8" },
  { key: "booked", label: "Booked", color: "#34d399" },
];

const AGENT_ACTIONS = [
  { id: 1, action: "Sent follow-up email to Tom R. (Bernedoodle, Lehi)", time: "18 min ago" },
  { id: 2, action: "Captured lead from website form: Sarah M. — Goldendoodle, South Jordan", time: "2 min ago" },
  { id: 3, action: "Updated CRM with Sarah M. details and estimated price range", time: "3 min ago" },
  { id: 4, action: "Qualified lead: Emily C. — French Bulldog, Sugar House", time: "2 hrs ago" },
  { id: 5, action: "Sent intro text to Ryan P. — German Shepherd, Highland", time: "5 hrs ago" },
  { id: 6, action: "Marked Amanda F. as lost — no response after 3 attempts", time: "1 day ago" },
];

export default function SDRAgentPage() {
  const funnelCounts = FUNNEL_STAGES.map((s) => ({
    ...s,
    count: LEADS.filter((l) => l.status === s.key).length,
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>
          SDR Agent
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
          Lead pipeline and funnel management.
        </p>
      </div>

      {/* Funnel Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {funnelCounts.map((s) => (
          <div key={s.key} className="glass-card p-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              {s.label}
            </p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: s.color }}>
              {s.count}
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(100,116,139,0.8)" }}>
              leads
            </p>
          </div>
        ))}
      </div>

      {/* Lead table + Agent Actions panel */}
      <div className="flex gap-4">
        {/* Lead Pipeline Table */}
        <div className="glass-card flex-1 min-w-0 overflow-hidden">
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
              Lead Pipeline
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Name", "Pet (Breed)", "Location", "Source", "Status", "Time"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(100,116,139,0.8)" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADS.map((lead, i) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom:
                        i < LEADS.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                      {lead.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                      {lead.pet}{" "}
                      <span style={{ color: "#64748b" }}>({lead.breed})</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                      {lead.location}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                      {lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`status-badge border ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "rgba(100,116,139,0.8)" }}
                    >
                      {lead.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Agent Actions Panel */}
        <div className="glass-card w-72 flex-shrink-0 overflow-hidden">
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
              Recent Agent Actions
            </h2>
          </div>
          <div>
            {AGENT_ACTIONS.map((item, i) => (
              <div
                key={item.id}
                className="px-5 py-3.5"
                style={{
                  borderBottom:
                    i < AGENT_ACTIONS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 rounded-full mt-1.5"
                    style={{ width: 6, height: 6, background: "#38bdf8", display: "block" }}
                  />
                  <div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#94a3b8" }}
                    >
                      {item.action}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
