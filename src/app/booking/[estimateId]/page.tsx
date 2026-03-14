"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SlotPicker from "@/components/SlotPicker";
import { proposeAppointments, confirmAppointment } from "@/lib/api";
import type { TimeSlot } from "@/lib/api";

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.estimateId as string;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const canFindSlots =
    customerName && customerEmail && customerPhone && address && preferredDate;

  const handleFindSlots = async () => {
    if (!canFindSlots) return;
    setLoadingSlots(true);
    setError("");
    try {
      const result = await proposeAppointments({
        estimateId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        preferredDate,
      });
      setSlots(result.slots);
    } catch {
      setError("Failed to load available slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlotId || !petName) return;
    setConfirming(true);
    setError("");
    try {
      const confirmation = await confirmAppointment({
        slotId: selectedSlotId,
        estimateId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        petName,
        notes: notes || undefined,
      });
      sessionStorage.setItem(
        `confirmation-${confirmation.appointmentId}`,
        JSON.stringify(confirmation)
      );
      router.push(`/confirmation/${confirmation.appointmentId}`);
    } catch {
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Book Your Appointment</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in your details and pick a time that works for you.
      </p>

      <div className="mt-8 space-y-8">
        {/* Customer Info */}
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground" style={{ opacity: 0.6 }}>
            Your Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Name <span className="text-paw-cyan">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Email <span className="text-paw-cyan">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Phone <span className="text-paw-cyan">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(801) 555-0123"
                  className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Pet Name <span className="text-paw-cyan">*</span>
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g., Cooper"
                  className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Address <span className="text-paw-cyan">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any special instructions for the groomer"
                className="w-full rounded-lg px-4 py-2.5 text-sm glass-input placeholder:text-muted-foreground/40 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Date & Slots */}
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground" style={{ opacity: 0.6 }}>
            Pick a Date
          </h2>
          <div className="flex gap-3">
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm glass-input"
            />
            <button
              type="button"
              onClick={handleFindSlots}
              disabled={!canFindSlots || loadingSlots}
              className="btn-cta px-6 py-2.5 text-sm inline-flex items-center gap-2"
            >
              {loadingSlots && <SpinnerIcon />}
              Find Slots
            </button>
          </div>
        </section>

        {/* Slot Picker */}
        {slots.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground" style={{ opacity: 0.6 }}>
              Available Slots
            </h2>
            <SlotPicker
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />
          </section>
        )}

        {error && (
          <p
            className="rounded-lg p-3 text-sm"
            style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "#fca5a5",
            }}
          >
            {error}
          </p>
        )}

        {/* Confirm */}
        {selectedSlotId && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!petName || confirming}
            className="w-full rounded-full py-3.5 text-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ background: "#16a34a" }}
          >
            {confirming && <SpinnerIcon />}
            {confirming ? "Confirming..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
