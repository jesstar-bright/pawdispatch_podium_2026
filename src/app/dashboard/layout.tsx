import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/sdr", label: "SDR Agent", icon: "🎯" },
  { href: "/dashboard/scheduling", label: "Scheduling", icon: "📅" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/marketing", label: "Marketing", icon: "📣" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "#0f172a" }}>
      {/* Sidebar */}
      <aside className="w-56 border-r flex-shrink-0 flex flex-col" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/dashboard" className="text-lg font-extrabold" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🐾 PawDispatch HQ
          </Link>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>Business Dashboard</p>
        </div>
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "#94a3b8" }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/" className="text-xs font-medium hover:underline" style={{ color: "#64748b" }}>
            ← Customer Site
          </Link>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
