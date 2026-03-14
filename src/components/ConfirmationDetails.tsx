import { formatPrice } from "@/lib/api";
import type { AppointmentConfirmation } from "@/lib/api";

interface ConfirmationDetailsProps {
  confirmation: AppointmentConfirmation;
}

export default function ConfirmationDetails({ confirmation }: ConfirmationDetailsProps) {
  const date = new Date(confirmation.startTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const startTime = new Date(confirmation.startTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = new Date(confirmation.endTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>Booking Confirmed!</h2>
        <p className="mt-2 text-lg font-mono font-bold" style={{ color: "#38bdf8" }}>
          {confirmation.confirmationNumber}
        </p>
      </div>

      <div className="mt-6 space-y-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#64748b" }}>Date</span>
          <span className="font-medium" style={{ color: "#f1f5f9" }}>{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#64748b" }}>Time</span>
          <span className="font-medium" style={{ color: "#f1f5f9" }}>
            {startTime} – {endTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#64748b" }}>Groomer</span>
          <span className="font-medium" style={{ color: "#f1f5f9" }}>{confirmation.groomer}</span>
        </div>
        <div className="flex justify-between text-sm pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: "#64748b" }}>Total</span>
          <span className="text-lg font-bold" style={{ color: "#f1f5f9" }}>
            {formatPrice(confirmation.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
