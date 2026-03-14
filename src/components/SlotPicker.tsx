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
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 text-paw-cyan"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function SlotPicker({ slots, selectedSlotId, onSelect }: SlotPickerProps) {
  // Group by date
  const grouped: Record<string, TimeSlot[]> = {};
  slots.forEach((slot) => {
    const date = slot.startTime.split("T")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot);
  });

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3" style={{ opacity: 0.6 }}>
            {formatDate(dateSlots[0].startTime)}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {dateSlots.map((slot) => {
              const selected = slot.slotId === selectedSlotId;
              return (
                <button
                  key={slot.slotId}
                  type="button"
                  onClick={() => onSelect(slot.slotId)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selected
                      ? ""
                      : "glass-card hover:bg-secondary/50"
                  }`}
                  style={
                    selected
                      ? {
                          border: "2px solid #38bdf8",
                          background: "rgba(37,99,235,0.15)",
                          boxShadow: "0 0 12px rgba(56,189,248,0.2)",
                          borderRadius: "0.75rem",
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ClockIcon />
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <UserIcon />
                    {slot.groomer}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
