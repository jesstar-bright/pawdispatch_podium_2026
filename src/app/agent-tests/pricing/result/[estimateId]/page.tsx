"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PricingAgentResultView,
  getStoredEstimate,
} from "@/components/agent-tests/pricing";

const UPLOAD_PATH = "/agent-tests/pricing/upload";

export default function PricingAgentResultTestPage({
  params,
}: { params: { estimateId: string } }) {
  const estimateId = params.estimateId;
  const [estimate, setEstimate] = useState<ReturnType<typeof getStoredEstimate>>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const data = getStoredEstimate(estimateId);
    if (data) setEstimate(data);
    else setMissing(true);
  }, [estimateId]);

  if (missing || (!estimate && estimateId)) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Estimate not found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This estimate may have expired or the link is invalid.
        </p>
        <Link
          href={UPLOAD_PATH}
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Get a new estimate
        </Link>
      </div>
    );
  }

  if (!estimate) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  return (
    <>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Result from Pricing agent (estimateId: {estimateId})
      </p>
      <PricingAgentResultView
        estimate={estimate}
        bookNowHref="/booking"
        newEstimateHref={UPLOAD_PATH}
        title="Your grooming estimate"
      />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <a href="/agent-tests" className="underline">
          Back to agent tests
        </a>
      </p>
    </>
  );
}
