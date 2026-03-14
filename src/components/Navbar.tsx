"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/upload", label: "Get Estimate", active: true },
  { href: "/coming-soon?agent=tracking", label: "Track", active: false },
  { href: "/coming-soon?agent=sdr", label: "SDR Console", active: false },
  { href: "/coming-soon?agent=analytics", label: "Analytics", active: false },
  { href: "/coming-soon?agent=retention", label: "Retention", active: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(15,23,42,0.8)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* Paw icon inline SVG */}
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="2" fill="#38bdf8" />
            <circle cx="17" cy="7" r="2" fill="#38bdf8" />
            <circle cx="4.5" cy="12" r="1.5" fill="#38bdf8" />
            <circle cx="19.5" cy="12" r="1.5" fill="#38bdf8" />
            <path
              d="M12 10c-3 0-5.5 2-5.5 5 0 2.5 2 4 5.5 4s5.5-1.5 5.5-4c0-3-2.5-5-5.5-5z"
              fill="#38bdf8"
            />
          </svg>
          <span className="text-xl font-extrabold gradient-text-brand">PawDispatch</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors"
              style={{
                color: pathname === link.href
                  ? "#f1f5f9"
                  : link.active
                  ? "#94a3b8"
                  : "rgba(100,116,139,0.7)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-2 rounded-full px-3 py-1 text-xs font-bold btn-cta"
          >
            HQ
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden transition-colors"
          style={{ color: "#94a3b8" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-3"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0f172a" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#94a3b8" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-bold"
            style={{ color: "#38bdf8" }}
          >
            Business Dashboard →
          </Link>
        </div>
      )}
    </nav>
  );
}
