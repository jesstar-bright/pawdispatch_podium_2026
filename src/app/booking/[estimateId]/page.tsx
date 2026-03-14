import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ estimateId: string }>;
}) {
  const { estimateId } = await params;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Book your appointment
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Time slot selection and confirmation will be available here. For now,
          this step is not fully built.
        </p>
        <Link
          href="/coming-soon?feature=booking"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Continue (coming soon)
        </Link>
        <p className="mt-4 text-sm text-zinc-500">
          <Link href={`/pricing/${estimateId}`} className="underline">
            Back to estimate
          </Link>
        </p>
      </main>
    </div>
  );
}
