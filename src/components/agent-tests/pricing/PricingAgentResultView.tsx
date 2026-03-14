"use client";

import Link from "next/link";
import Image from "next/image";
import type { PricingEstimateResult } from "./types";

export interface PricingAgentResultViewProps {
  estimate: PricingEstimateResult;
  /** Base path for "Book now" (e.g. /booking or /agent-tests/pricing/booking). Default: /booking */
  bookNowHref?: string;
  /** Base path for "Get another estimate". Default: same as current test UI upload path. */
  newEstimateHref?: string;
  className?: string;
  title?: string;
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Displays a single pricing estimate from the Pricing Agent.
 * Use with getStoredEstimate(estimateId) or pass estimate from your own state/API.
 */
export function PricingAgentResultView({
  estimate,
  bookNowHref = "/booking",
  newEstimateHref,
  className = "",
  title = "Your grooming estimate",
}: PricingAgentResultViewProps) {
  const sizeLabel = estimate.sizeCategory.charAt(0).toUpperCase() + estimate.sizeCategory.slice(1);
  const bookHref = `${bookNowHref}/${estimate.estimateId}`;

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {estimate.imageUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={estimate.imageUrl}
              alt="Your dog"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
              {sizeLabel}
            </span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatCents(estimate.totalPrice)}
            </span>
          </div>

          <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Base price</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCents(estimate.basePrice)}
              </span>
            </div>
            {estimate.adjustments.map((adj) => (
              <div key={adj.reason} className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{adj.reason}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  +{formatCents(adj.amount)}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{estimate.explanation}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={bookHref}
          className="block rounded-full bg-zinc-900 py-4 text-center font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Book now
        </Link>
        {newEstimateHref != null && (
          <Link href={newEstimateHref} className="block text-center text-sm text-zinc-600 underline dark:text-zinc-400">
            Get another estimate
          </Link>
        )}
      </div>
    </div>
  );
}
