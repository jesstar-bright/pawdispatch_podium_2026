import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { preferredDate } = body;

  // Generate mock slots based on the preferred date
  const baseDate = preferredDate || new Date().toISOString().split("T")[0];

  const groomers = ["Alex Rivera", "Jordan Lee", "Casey Martinez"];
  const times = ["09:00", "10:30", "13:00", "14:30", "16:00"];

  const slots = times.slice(0, 4).map((time, i) => ({
    slotId: `slot-${Date.now()}-${i}`,
    startTime: `${baseDate}T${time}:00`,
    endTime: `${baseDate}T${String(parseInt(time) + 1).padStart(2, "0")}:${time.split(":")[1]}:00`,
    groomer: groomers[i % groomers.length],
  }));

  return NextResponse.json({ slots });
}
