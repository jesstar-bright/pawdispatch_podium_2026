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
        <p className="text-muted-foreground">Loading confirmation...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <ConfirmationDetails confirmation={confirmation} />

      <div className="mt-8 flex gap-4">
        <Link
          href="/coming-soon?agent=tracking"
          className="flex-1 btn-ghost py-3.5 text-center text-lg"
        >
          Track Appointment
        </Link>
        <Link
          href="/upload"
          className="flex-1 btn-cta py-3.5 text-center text-lg"
        >
          Book Another
        </Link>
      </div>
    </div>
  );
}
