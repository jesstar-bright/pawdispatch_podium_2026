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
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>{date}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {dateSlots.map((slot) => (
              <button
                key={slot.slotId}
                onClick={() => onSelect(slot.slotId)}
                className="rounded-xl p-4 text-left transition-all"
                style={
                  selectedSlotId === slot.slotId
                    ? {
                        background: "rgba(37,99,235,0.15)",
                        border: "2px solid #38bdf8",
                        boxShadow: "0 0 12px rgba(56,189,248,0.2)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                <p className="font-semibold" style={{ color: "#f1f5f9" }}>
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>
                <p className="mt-1 text-sm" style={{ color: "#64748b" }}>with {slot.groomer}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
