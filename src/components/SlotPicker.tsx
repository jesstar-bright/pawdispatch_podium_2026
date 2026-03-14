"use client";

import type { TimeSlot } from "@/lib/api";

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SlotPicker({ slots, selectedSlotId, onSelect }: SlotPickerProps) {
  const grouped: Record<string, TimeSlot[]> = {};
  for (const slot of slots) {
    const date = formatDate(slot.startTime);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-500 uppercase">{date}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {dateSlots.map((slot) => (
              <button
                key={slot.slotId}
                onClick={() => onSelect(slot.slotId)}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  selectedSlotId === slot.slotId
                    ? "border-paw-blue bg-blue-50"
                    : "border-zinc-200 hover:border-paw-blue"
                }`}
              >
                <p className="font-semibold text-zinc-900">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>
                <p className="mt-1 text-sm text-zinc-500">with {slot.groomer}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
