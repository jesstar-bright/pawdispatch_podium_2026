import Link from "next/link";
import Navbar from "@/components/Navbar";

const FEATURES: Record<string, string> = {
  track: "Live Tracking",
  appointments: "My Appointments",
  sdr: "SDR Console",
  analytics: "Analytics",
  booking: "Booking & time slots",
};

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const resolved = await searchParams;
  const featureKey = resolved.feature ?? "";
  const featureName = FEATURES[featureKey] ?? "This feature";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Coming soon
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {featureName} is not available yet. We’re working on it!
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
