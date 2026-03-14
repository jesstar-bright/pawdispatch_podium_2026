import Link from "next/link";

const AGENT_NAMES: Record<string, string> = {
  tracking: "Live Tracking",
  sdr: "SDR Console",
  analytics: "Analytics Dashboard",
  retention: "Retention & Surveys",
  marketing: "AI Marketing",
};

export default async function ComingSoon({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;
  const agentName = agent ? AGENT_NAMES[agent] || agent : "This Feature";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold text-zinc-900">{agentName}</h1>
      <p className="mt-4 max-w-md text-lg text-zinc-600">
        This agent is coming soon! We&apos;re building autonomous AI agents to handle
        every part of your pet grooming business.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-paw-blue px-6 py-2.5 font-semibold text-white transition-colors hover:bg-paw-blue-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
