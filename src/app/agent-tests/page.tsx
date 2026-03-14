import Link from "next/link";

/**
 * Index of agent test UIs. Add a link here when you add a new agent test.
 */
export default function AgentTestsIndexPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Agent tests
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Isolated UIs for testing each agent. The main app frontend is built
        separately.
      </p>
      <ul className="list-inside list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
        <li>
          <Link
            href="/agent-tests/pricing/upload"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Pricing agent
          </Link>
          — dog photo + pet details → estimate (POST /api/pricing/estimate)
        </li>
      </ul>
    </div>
  );
}
