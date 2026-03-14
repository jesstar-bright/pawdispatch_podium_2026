"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import type { PricingEstimate } from "@/lib/api";

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

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
        <p className="text-muted-foreground">Loading estimate...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Your Price Estimate</h1>
      <p className="mt-2 text-muted-foreground">
        Here&apos;s what grooming will cost based on our AI analysis of your dog&apos;s photo.
      </p>

      <div className="mt-8">
        <PricingCard estimate={estimate} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href={`/booking/${estimateId}`}
          className="flex-1 btn-cta py-3.5 text-center text-lg inline-flex items-center justify-center gap-2"
        >
          Book Now <ArrowRightIcon />
        </Link>
        <Link
          href="/upload"
          className="flex-1 btn-ghost py-3.5 text-center text-lg"
        >
          Try Another Photo
        </Link>
      </div>
    </div>
  );
}
