/** When true, pricing returns a fixed mock ($75). Set false to use the real pricing agent (Claude image → $50–$5000). */
const MOCK = process.env.NEXT_PUBLIC_MOCK_API === "true";

export interface PricingEstimate {
  estimateId: string;
  basePrice: number;
  adjustments: Array<{ reason: string; amount: number }>;
  totalPrice: number;
  sizeCategory: "small" | "medium" | "large" | "xlarge";
  explanation: string;
  imageUrl: string;
}

export interface TimeSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  groomer: string;
}

export interface AppointmentConfirmation {
  appointmentId: string;
  status: "confirmed";
  startTime: string;
  endTime: string;
  groomer: string;
  totalPrice: number;
  confirmationNumber: string;
}

/** Fixed mock used when NEXT_PUBLIC_MOCK_API=true. For real AI pricing ($50–$5000), set NEXT_PUBLIC_MOCK_API=false and run the Python pricing agent. */
const MOCK_ESTIMATE: PricingEstimate = {
  estimateId: "est-mock-001",
  basePrice: 5500,
  adjustments: [
    { reason: "Long/thick coat", amount: 1500 },
    { reason: "Large dog adjustment", amount: 500 },
  ],
  totalPrice: 7500,
  sizeCategory: "large",
  explanation:
    "Based on the photo, this appears to be a large breed (Golden Retriever, ~65 lbs) with a thick double coat that requires extra grooming time.",
  imageUrl: "/uploads/mock-dog.jpg",
};

const MOCK_SLOTS: TimeSlot[] = [
  { slotId: "slot-1", startTime: "2026-03-15T09:00:00", endTime: "2026-03-15T10:00:00", groomer: "Alex Rivera" },
  { slotId: "slot-2", startTime: "2026-03-15T11:00:00", endTime: "2026-03-15T12:00:00", groomer: "Jordan Lee" },
  { slotId: "slot-3", startTime: "2026-03-15T14:00:00", endTime: "2026-03-15T15:00:00", groomer: "Alex Rivera" },
  { slotId: "slot-4", startTime: "2026-03-16T10:00:00", endTime: "2026-03-16T11:00:00", groomer: "Casey Martinez" },
];

const MOCK_CONFIRMATION: AppointmentConfirmation = {
  appointmentId: "apt-mock-001",
  status: "confirmed",
  startTime: "2026-03-15T09:00:00",
  endTime: "2026-03-15T10:00:00",
  groomer: "Alex Rivera",
  totalPrice: 7500,
  confirmationNumber: "PAW-2026-0042",
};

export async function submitPricingEstimate(formData: FormData): Promise<PricingEstimate> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1500));
    return MOCK_ESTIMATE;
  }
  const res = await fetch("/api/pricing/estimate", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to get pricing estimate");
  return res.json();
}

export async function proposeAppointments(data: {
  estimateId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
}): Promise<{ slots: TimeSlot[] }> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { slots: MOCK_SLOTS };
  }
  const res = await fetch("/api/appointments/propose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get appointment slots");
  return res.json();
}

export async function confirmAppointment(data: {
  slotId: string;
  estimateId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  petName: string;
  notes?: string;
}): Promise<AppointmentConfirmation> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_CONFIRMATION;
  }
  const res = await fetch("/api/appointments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to confirm appointment");
  return res.json();
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
