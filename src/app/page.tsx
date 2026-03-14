import Link from "next/link";

const FEATURES = [
  {
    emoji: "📱",
    title: "Convenience",
    desc: "We come to you. No car rides, no waiting rooms — grooming at your doorstep.",
  },
  {
    emoji: "✨",
    title: "AI-Powered Pricing",
    desc: "Upload a photo and get a transparent, instant price estimate powered by AI vision.",
  },
  {
    emoji: "✂️",
    title: "Professional Groomers",
    desc: "Experienced, vetted groomers who love animals and deliver quality results.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="py-20 text-center relative">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(129,140,248,0.06) 40%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-8"
            style={{ border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8" }}
          >
            AI-POWERED GROOMING
          </span>

          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
            style={{ color: "#f1f5f9", letterSpacing: "-1.5px" }}
          >
            Mobile Pet Grooming,
            <br />
            <span className="gradient-text-hero">At Your Door</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            Upload a photo of your dog, get an instant AI-powered price estimate, and book a professional groomer — all in minutes.
          </p>

          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link href="/upload" className="btn-cta px-8 py-3.5 text-lg">
              Get a Price Estimate →
            </Link>
            <Link href="/dashboard" className="btn-ghost px-6 py-3.5 text-lg">
              Business Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid gap-5 py-16 md:grid-cols-3">
        {FEATURES.map((item) => (
          <div
            key={item.title}
            className="glass-card p-6 text-center group transition-all duration-300"
            style={{ transition: "background 0.3s" }}
          >
            <div
              className="mb-4 mx-auto w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))" }}
            >
              {item.emoji}
            </div>
            <h3 className="text-lg font-bold" style={{ color: "#f1f5f9" }}>{item.title}</h3>
            <p className="mt-2 text-sm" style={{ color: "#94a3b8" }}>{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
