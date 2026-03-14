import { LEADS, Lead } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "#38bdf8",
  contacted: "#f59e0b",
  qualified: "#818cf8",
  booked: "#34d399",
  lost: "#ef4444",
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  booked: "Booked",
  lost: "Lost",
};

const FUNNEL_STATUSES: Lead["status"][] = ["new", "contacted", "qualified", "booked"];

const AGENT_ACTIONS = [
  { id: 1, action: "Sent follow-up email to Tom R. (Bernedoodle, Lehi)", time: "18 min ago" },
  { id: 2, action: "Captured lead from website form: Sarah M. — Goldendoodle, South Jordan", time: "2 min ago" },
  { id: 3, action: "Updated CRM with Sarah M. details and estimated price range", time: "3 min ago" },
  { id: 4, action: "Qualified lead: Emily C. — French Bulldog, Sugar House", time: "2 hrs ago" },
  { id: 5, action: "Sent intro text to Ryan P. — German Shepherd, Highland", time: "5 hrs ago" },
  { id: 6, action: "Marked Amanda F. as lost — no response after 3 attempts", time: "1 day ago" },
];

const CARD_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

export default function SDRAgentPage() {
  const countByStatus = (status: Lead["status"]) =>
    LEADS.filter((l) => l.status === status).length;

  return (
    <div style={{ color: "#f1f5f9" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
          SDR Agent
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>
          Autonomous lead capture and follow-up
        </p>
      </div>

      {/* Funnel Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {FUNNEL_STATUSES.map((status) => {
          const count = countByStatus(status);
          const color = STATUS_COLORS[status];
          return (
            <div key={status} className="p-4" style={CARD_STYLE}>
              <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>
                {STATUS_LABELS[status]}
              </p>
              <p className="text-3xl font-bold" style={{ color }}>
                {count}
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                leads
              </p>
            </div>
          );
        })}
      </div>

      {/* Main content: table + actions panel */}
      <div className="flex gap-4">
        {/* Lead Pipeline Table */}
        <div className="flex-1 min-w-0" style={{ ...CARD_STYLE, padding: 0, overflow: "hidden" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
              Lead Pipeline
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Name", "Pet (Breed)", "Location", "Source", "Status", "Time"].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: "#64748b" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADS.map((lead, i) => {
                const color = STATUS_COLORS[lead.status];
                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: i < LEADS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <td className="px-5 py-3" style={{ color: "#f1f5f9" }}>
                      {lead.name}
                    </td>
                    <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                      {lead.pet}{" "}
                      <span style={{ color: "#64748b" }}>({lead.breed})</span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                      {lead.location}
                    </td>
                    <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                      {lead.source}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          color,
                          background: color + "15",
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "#64748b" }}>
                      {lead.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Agent Actions Panel */}
        <div className="w-72 flex-shrink-0" style={{ ...CARD_STYLE, padding: 0, overflow: "hidden" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
              Recent Agent Actions
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {AGENT_ACTIONS.map((item) => (
              <div key={item.id} className="px-5 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "#38bdf8" }}
                  />
                  <div>
                    <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
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
