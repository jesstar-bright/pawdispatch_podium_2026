import { redirect } from "next/navigation";

/**
 * Canonical pricing result lives under /agent-tests/pricing/result/[estimateId].
 * Redirect so existing links and redirects from the API still work.
 */
export default async function PricingResultRedirectPage({
  params,
}: {
  params: Promise<{ estimateId: string }>;
}) {
  const { estimateId } = await params;
  redirect(`/agent-tests/pricing/result/${estimateId}`);
}
