import Link from "next/link";
import { headers } from "next/headers";
import { Dog, BarChart3, Target, Calendar, TrendingUp, Megaphone, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/sdr", label: "SDR Agent", icon: Target },
  { href: "/dashboard/scheduling", label: "Scheduling", icon: Calendar },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/marketing", label: "Marketing", icon: Megaphone },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  return (
    <div className="flex min-h-screen" style={{ background: "#0f172a" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "var(--sidebar-background, #0b1120)", borderRight: "1px solid var(--sidebar-border, rgba(255,255,255,0.07))" }}
      >
        {/* Logo */}
        <div
          className="p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dog className="h-5 w-5" style={{ color: "#38bdf8" }} />
            <span className="text-lg font-extrabold gradient-text-brand">PawDispatch</span>
          </Link>
          <p className="text-xs mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>
            Business Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative"
                style={{
                  color: active ? "#f1f5f9" : "#64748b",
                  background: active ? "rgba(255,255,255,0.06)" : "transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{ width: 3, height: 20, background: "#38bdf8" }}
                  />
                )}
                <item.icon
                  className="h-4 w-4"
                  style={{ color: active ? "#38bdf8" : "#64748b" }}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="p-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium transition-colors"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Customer Site
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
