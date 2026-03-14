import {
  getAllAppointments,
  getTodayAppointments,
  getGroomerStats,
  type AppointmentWithDetails,
} from "@/lib/db/queries";

const STATUS_COLORS: Record<AppointmentWithDetails["status"], string> = {
  scheduled: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  in_transit: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  grooming: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
};

const STATUS_LABELS: Record<AppointmentWithDetails["status"], string> = {
  scheduled: "Scheduled",
  in_transit: "In Transit",
  grooming: "Grooming",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}

export default async function SchedulingPage() {
  const allAppointments = await getAllAppointments();
  const todayAppts = await getTodayAppointments();
  const groomerStats = await getGroomerStats();

  const completed = todayAppts.filter((a) => a.status === "completed");
  const inProgress = todayAppts.filter(
    (a) => a.status === "grooming" || a.status === "in_transit"
  );
  const revenueToday = completed.reduce((sum, a) => sum + a.price, 0);

  const stats = [
    { label: "Total Today", value: todayAppts.length.toString(), color: "#f1f5f9" },
    { label: "Completed", value: completed.length.toString(), color: "#34d399" },
    { label: "In Progress", value: inProgress.length.toString(), color: "#38bdf8" },
    { label: "Revenue Today", value: formatCents(revenueToday), color: "#818cf8" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>
          Scheduling &amp; Dispatch
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
          Groomer management and appointment tracking.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              {s.label}
            </p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Groomer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {groomerStats.map((g) => {
          const groomerAppts = todayAppts.filter((a) => a.groomer === g.name);
          const currentAppt = groomerAppts.find(
            (a) => a.status === "grooming" || a.status === "in_transit"
          );
          const statusText = currentAppt
            ? currentAppt.status === "grooming"
              ? `Currently grooming ${currentAppt.petName}`
              : `In transit to ${currentAppt.location}`
            : groomerAppts.some((a) => a.status === "completed")
            ? "Completed — en route to next"
            : "On schedule";

          return (
            <div key={g.name} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold" style={{ color: "#f1f5f9" }}>
                  {g.name}
                </h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: "#38bdf8",
                    background: "rgba(56,189,248,0.12)",
                    border: "1px solid rgba(56,189,248,0.25)",
                  }}
                >
                  {groomerAppts.length} appts
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                {statusText}
              </p>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#64748b" }}>Utilization</span>
                  <span style={{ color: "#38bdf8" }}>{g.utilization}%</span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 6, background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.utilization}%`,
                      background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Table */}
      <div className="glass-card overflow-hidden">
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
            All Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Time", "Date", "Customer", "Pet (Breed)", "Groomer", "Location", "Status", "Price"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(100,116,139,0.8)" }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {allAppointments.map((appt, i) => (
                <tr
                  key={appt.id}
                  style={{
                    borderBottom:
                      i < allAppointments.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                    {appt.time}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                    {appt.date}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                    {appt.customerName}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                    {appt.petName}{" "}
                    {appt.breed && (
                      <span style={{ color: "#64748b" }}>({appt.breed})</span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                    {appt.groomer}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#94a3b8" }}>
                    {appt.location}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-badge border ${STATUS_COLORS[appt.status]}`}
                    >
                      {STATUS_LABELS[appt.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#f1f5f9" }}>
                    {formatCents(appt.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
