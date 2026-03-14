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
        <p style={{ color: "#64748b" }}>Loading confirmation...</p>
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
          className="flex-1 rounded-full py-3 text-center font-semibold transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}
        >
          Track Appointment
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full py-3 text-center font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
        >
          Book Another
        </Link>
      </div>
    </div>
  );
}
