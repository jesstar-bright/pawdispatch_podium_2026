import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-paw-blue">
          PawDispatch
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/upload" className="hover:text-paw-blue">
            Get Estimate
          </Link>
          <Link href="/coming-soon?agent=tracking" className="hover:text-paw-blue">
            Track Appointment
          </Link>
          <Link href="/coming-soon?agent=sdr" className="hover:text-paw-blue">
            SDR Console
          </Link>
          <Link href="/coming-soon?agent=analytics" className="hover:text-paw-blue">
            Analytics
          </Link>
          <Link href="/coming-soon?agent=retention" className="hover:text-paw-blue">
            Retention
          </Link>
        </div>
      </div>
    </nav>
  );
}
