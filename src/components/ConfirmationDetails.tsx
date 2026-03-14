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
    <div className="rounded-xl border border-zinc-200 p-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-zinc-900">Booking Confirmed!</h2>
        <p className="mt-2 text-lg font-mono font-bold text-paw-blue">
          {confirmation.confirmationNumber}
        </p>
      </div>

      <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Date</span>
          <span className="font-medium text-zinc-900">{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Time</span>
          <span className="font-medium text-zinc-900">
            {startTime} – {endTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Groomer</span>
          <span className="font-medium text-zinc-900">{confirmation.groomer}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-zinc-200 pt-3">
          <span className="text-zinc-500">Total</span>
          <span className="text-lg font-bold text-zinc-900">
            {formatPrice(confirmation.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
