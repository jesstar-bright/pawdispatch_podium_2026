import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slotId, estimateId, customerName, petName } = body;

  // Generate a confirmation number
  const confirmNum = `PAW-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  // Find the slot time from the slotId or use defaults
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const confirmation = {
    appointmentId: `apt-${Date.now()}`,
    status: "confirmed" as const,
    startTime: body.startTime || `${tomorrow.toISOString().split("T")[0]}T09:00:00`,
    endTime: body.endTime || `${tomorrow.toISOString().split("T")[0]}T10:00:00`,
    groomer: body.groomer || "Alex Rivera",
    totalPrice: body.totalPrice || 7500,
    confirmationNumber: confirmNum,
  };

  return NextResponse.json(confirmation);
}
