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
        <p style={{ color: "#64748b" }}>Loading estimate...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Your Price Estimate</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>
        Here&apos;s what grooming will cost based on our AI analysis of your dog&apos;s photo.
      </p>

      <div className="mt-8">
        <PricingCard estimate={estimate} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href={`/booking/${estimateId}`}
          className="flex-1 rounded-full py-3 text-center text-lg font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
        >
          Book Now
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full py-3 text-center text-lg font-semibold transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}
        >
          Try Another Photo
        </Link>
      </div>
    </div>
  );
}
