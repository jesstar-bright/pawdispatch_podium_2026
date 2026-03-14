import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-900 dark:shadow-none md:p-14">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Mobile Pet Grooming, At Your Door
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Get an AI-powered price estimate in seconds. Upload a photo of your
            dog, add a few details, and we’ll give you a transparent quote for
            grooming.
          </p>
          <Link
            href="/agent-tests/pricing/upload"
            className="mt-8 inline-block rounded-full bg-zinc-900 px-8 py-4 text-lg font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get a Price Estimate
          </Link>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Or{" "}
            <Link href="/agent-tests" className="underline">
              open agent tests
            </Link>{" "}
            to test the Pricing agent in isolation.
          </p>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Convenience
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              We come to you. No stressful car rides or waiting in a lobby.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              AI-Powered Pricing
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Upload a photo and get a fair, transparent estimate in seconds.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Professional Groomers
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Experienced, caring groomers who work with your pet at home.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
