import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🐾 PawDispatch
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: "#94a3b8" }}>
          <Link href="/upload" className="transition-colors hover:text-white">
            Get Estimate
          </Link>
          <Link href="/coming-soon?agent=tracking" className="transition-colors hover:text-white" style={{ color: "#64748b" }}>
            Track Appointment
          </Link>
          <Link href="/coming-soon?agent=sdr" className="transition-colors hover:text-white" style={{ color: "#64748b" }}>
            SDR Console
          </Link>
          <Link href="/coming-soon?agent=analytics" className="transition-colors hover:text-white" style={{ color: "#64748b" }}>
            Analytics
          </Link>
          <Link href="/coming-soon?agent=retention" className="transition-colors hover:text-white" style={{ color: "#64748b" }}>
            Retention
          </Link>
          <Link
            href="/dashboard"
            className="ml-2 rounded-full px-3 py-1 text-xs font-bold transition-colors"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a" }}
          >
            HQ
          </Link>
        </div>
      </div>
    </nav>
  );
}
