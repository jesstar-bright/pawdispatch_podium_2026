import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
      >
        PawDispatch
      </Link>
      <div className="flex gap-4 text-sm">
        <Link
          href="/coming-soon?feature=track"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Track Appointment
        </Link>
        <Link
          href="/coming-soon?feature=appointments"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          My Appointments
        </Link>
        <Link
          href="/coming-soon?feature=sdr"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          SDR Console
        </Link>
        <Link
          href="/coming-soon?feature=analytics"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Analytics
        </Link>
      </div>
    </nav>
  );
}
