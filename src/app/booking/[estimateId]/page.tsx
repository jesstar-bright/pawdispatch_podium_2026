"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SlotPicker from "@/components/SlotPicker";
import { proposeAppointments, confirmAppointment } from "@/lib/api";
import type { TimeSlot } from "@/lib/api";

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
};

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

  const handleFindSlots = async () => {
    if (!customerName || !customerEmail || !customerPhone || !address || !preferredDate) return;
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
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Book Your Appointment</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>
        Fill in your details and pick a time that works for you.
      </p>

      <div className="mt-8 space-y-6">
        {/* Customer Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Your Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="petNameBooking" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                id="petNameBooking"
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={inputStyle}
              placeholder="123 Main St, Salt Lake City, UT"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
              Special Instructions <span style={{ color: "#64748b" }}>(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={inputStyle}
              placeholder="e.g., Dog is anxious around strangers, gate code is 1234"
            />
          </div>
        </section>

        {/* Date + Slot Picker */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Pick a Date</h2>
          <div className="flex gap-3">
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={inputStyle}
            />
            <button
              onClick={handleFindSlots}
              disabled={!customerName || !customerEmail || !customerPhone || !address || !preferredDate || loadingSlots}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 16px rgba(37,99,235,0.25)" }}
            >
              {loadingSlots ? "Finding slots..." : "Find Available Slots"}
            </button>
          </div>
        </section>

        {/* Slots */}
        {slots.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Available Slots</h2>
            <SlotPicker
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />
          </section>
        )}

        {error && (
          <p className="rounded-lg p-3 text-sm" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}>{error}</p>
        )}

        {/* Confirm */}
        {selectedSlotId && (
          <button
            onClick={handleConfirm}
            disabled={confirming || !petName}
            className="w-full rounded-full py-3 text-lg font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ background: "#16a34a" }}
          >
            {confirming ? "Confirming..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
