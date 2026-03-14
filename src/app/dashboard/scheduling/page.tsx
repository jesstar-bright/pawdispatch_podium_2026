import { APPOINTMENTS, Appointment, REVENUE_DATA } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<Appointment["status"], string> = {
  scheduled: "#94a3b8",
  in_transit: "#f59e0b",
  grooming: "#38bdf8",
  completed: "#34d399",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<Appointment["status"], string> = {
  scheduled: "Scheduled",
  in_transit: "In Transit",
  grooming: "Grooming",
  completed: "Completed",
  cancelled: "Cancelled",
};

const CARD_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

const GROOMERS = [
  {
    name: "Alex Rivera",
    currentStatus: "Currently grooming Cooper",
  },
  {
    name: "Jordan Lee",
    currentStatus: "Completed — en route to next",
  },
  {
    name: "Casey Martinez",
    currentStatus: "In transit to Draper",
  },
];

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}

export default function SchedulingPage() {
  const todayAppts = APPOINTMENTS.filter((a) => a.date === "Today");
  const completed = todayAppts.filter((a) => a.status === "completed");
  const inProgress = todayAppts.filter(
    (a) => a.status === "grooming" || a.status === "in_transit"
  );
  const revenueToday = completed.reduce((sum, a) => sum + a.price, 0);

  return (
    <div style={{ color: "#f1f5f9" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
          Scheduling &amp; Dispatch
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>
          Today&apos;s appointments and groomer assignments
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Today", value: todayAppts.length, color: "#f1f5f9" },
          { label: "Completed", value: completed.length, color: "#34d399" },
          { label: "In Progress", value: inProgress.length, color: "#38bdf8" },
          { label: "Revenue Today", value: formatCents(revenueToday), color: "#818cf8" },
        ].map((stat) => (
          <div key={stat.label} className="p-4" style={CARD_STYLE}>
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>
              {stat.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Groomer Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {GROOMERS.map((groomer) => {
          const groomerAppts = todayAppts.filter((a) => a.groomer === groomer.name);
          const groomerUtil = REVENUE_DATA.groomerUtilization.find(
            (g) => g.name === groomer.name
          );
          const utilization = groomerUtil?.utilization ?? 0;

          return (
            <div key={groomer.name} className="p-5" style={CARD_STYLE}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                  {groomer.name}
                </p>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: "#38bdf8",
                    background: "#38bdf815",
                    border: "1px solid #38bdf830",
                  }}
                >
                  {groomerAppts.length} appts
                </span>
              </div>

              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                {groomer.currentStatus}
              </p>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#64748b" }}>Utilization</span>
                  <span style={{ color: "#94a3b8" }}>{utilization}%</span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 6, background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${utilization}%`,
                      background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Appointment List */}
      <div style={{ ...CARD_STYLE, padding: 0, overflow: "hidden" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
            All Appointments
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Time", "Date", "Customer", "Pet (Breed)", "Groomer", "Location", "Status", "Price"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: "#64748b" }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS.map((appt, i) => {
              const color = STATUS_COLORS[appt.status];
              return (
                <tr
                  key={appt.id}
                  style={{
                    borderBottom:
                      i < APPOINTMENTS.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <td className="px-5 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                    {appt.time}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                    {appt.date}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#f1f5f9" }}>
                    {appt.customerName}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                    {appt.petName}{" "}
                    <span style={{ color: "#64748b" }}>({appt.breed})</span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                    {appt.groomer}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#94a3b8" }}>
                    {appt.location}
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
                      {STATUS_LABELS[appt.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                    {formatCents(appt.price)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
