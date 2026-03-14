"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmationDetails from "@/components/ConfirmationDetails";
import type { AppointmentConfirmation } from "@/lib/api";

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`confirmation-${appointmentId}`);
    if (stored) {
      setConfirmation(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [appointmentId, router]);

  if (!confirmation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading confirmation...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mt-4">
        <ConfirmationDetails confirmation={confirmation} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/coming-soon?agent=tracking"
          className="flex-1 rounded-full border border-paw-blue py-3 text-center font-semibold text-paw-blue transition-colors hover:bg-blue-50"
        >
          Track Appointment
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full bg-paw-blue py-3 text-center font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Book Another
        </Link>
      </div>
    </div>
  );
}
