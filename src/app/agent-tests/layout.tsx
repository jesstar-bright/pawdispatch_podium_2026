import Link from "next/link";

/**
 * Layout for agent test routes. Keeps test UIs visually separate from the main app.
 */
export default function AgentTestsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-medium text-zinc-700 dark:text-zinc-300">
            ← PawDispatch
          </Link>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Agent tests
          </span>
          <Link
            href="/agent-tests"
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            Index
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-8">{children}</main>
    </div>
  );
}
