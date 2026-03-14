import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="py-16 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-100 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.05) 40%, transparent 70%)" }} />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6" style={{ border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8" }}>
            AI-POWERED GROOMING
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: "#f1f5f9", letterSpacing: "-1.5px" }}>
            Mobile Pet Grooming,
            <br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              At Your Door
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            Upload a photo of your dog, get an instant AI-powered price estimate,
            and book a professional groomer — all in minutes.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/upload"
              className="inline-block rounded-full px-8 py-3 text-lg font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
            >
              Get a Price Estimate →
            </Link>
            <Link
              href="/dashboard"
              className="inline-block rounded-full px-6 py-3 text-lg font-semibold transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}
            >
              Business Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid gap-4 py-16 md:grid-cols-3">
        {[
          { icon: "📱", title: "Convenience", desc: "We come to you. No car rides, no waiting rooms — grooming at your doorstep." },
          { icon: "🤖", title: "AI-Powered Pricing", desc: "Upload a photo and get a transparent, instant price estimate powered by AI vision." },
          { icon: "✂️", title: "Professional Groomers", desc: "Experienced, vetted groomers who love animals and deliver quality results." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="mb-4 mx-auto w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))" }}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold" style={{ color: "#f1f5f9" }}>{item.title}</h3>
            <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
