"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import type { PricingEstimate } from "@/lib/api";

export default function PricingPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.estimateId as string;
  const [estimate, setEstimate] = useState<PricingEstimate | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`estimate-${estimateId}`);
    if (stored) {
      setEstimate(JSON.parse(stored));
    } else {
      router.push("/upload");
    }
  }, [estimateId, router]);

  if (!estimate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading estimate...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Your Price Estimate</h1>
      <p className="mt-2 text-zinc-600">
        Here&apos;s what grooming will cost based on our AI analysis of your dog&apos;s photo.
      </p>

      <div className="mt-8">
        <PricingCard estimate={estimate} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href={`/booking/${estimateId}`}
          className="flex-1 rounded-full bg-paw-blue py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Book Now
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full border border-zinc-300 py-3 text-center text-lg font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Try Another Photo
        </Link>
      </div>
    </div>
  );
}
