import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          Mobile Pet Grooming,
          <br />
          <span className="text-paw-blue">At Your Door</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Upload a photo of your dog, get an instant AI-powered price estimate,
          and book a professional groomer — all in minutes.
        </p>
        <Link
          href="/upload"
          className="mt-8 inline-block rounded-full bg-paw-blue px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Get a Price Estimate
        </Link>
      </section>

      {/* Value Props */}
      <section className="grid gap-8 py-16 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">📱</div>
          <h3 className="text-lg font-semibold text-zinc-900">Convenience</h3>
          <p className="mt-2 text-sm text-zinc-600">
            We come to you. No car rides, no waiting rooms — grooming at your doorstep.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">🤖</div>
          <h3 className="text-lg font-semibold text-zinc-900">AI-Powered Pricing</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Upload a photo and get a transparent, instant price estimate powered by AI vision.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">✂️</div>
          <h3 className="text-lg font-semibold text-zinc-900">Professional Groomers</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Experienced, vetted groomers who love animals and deliver quality results.
          </p>
        </div>
      </section>
    </div>
  );
}
