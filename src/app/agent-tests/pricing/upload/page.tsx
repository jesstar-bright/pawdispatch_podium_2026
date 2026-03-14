"use client";

import { useRouter } from "next/navigation";
import { PricingAgentUploadForm } from "@/components/agent-tests/pricing";

const RESULT_PATH = "/agent-tests/pricing/result";

export default function PricingAgentUploadTestPage() {
  const router = useRouter();

  return (
    <>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Test UI for the <strong>Pricing agent</strong> only. Submit calls POST
        /api/pricing/estimate.
      </p>
      <PricingAgentUploadForm
        title="Get a price estimate"
        description="Upload a photo of your dog and add a few details. We'll use AI to give you a fair grooming quote."
        onSuccess={(estimateId) => router.push(`${RESULT_PATH}/${estimateId}`)}
      />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <a href="/agent-tests" className="underline">
          Back to agent tests
        </a>
      </p>
    </>
  );
}
