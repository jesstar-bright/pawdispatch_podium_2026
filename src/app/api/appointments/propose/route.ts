import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pricing_estimates, groomers, appointments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { validateEmail, validateDate, validateUUID } from "@/lib/db/utils";
import { generateTimeSlots, formatSlotId } from "@/lib/db/slots";

/**
 * POST /api/appointments/propose
 * Propose available time slots for a given date
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      estimateId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      preferredDate,
    } = body;

    // Validate required fields
    if (
      !estimateId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !address ||
      !preferredDate
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate estimateId format
    if (!validateUUID(estimateId)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid estimate ID format",
        },
        { status: 400 }
      );
    }

    // Validate estimate exists
    const estimate = await db
      .select()
      .from(pricing_estimates)
      .where(eq(pricing_estimates.id, estimateId))
      .limit(1);

    if (estimate.length === 0) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Invalid estimate ID or date",
        },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateEmail(customerEmail)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate date
    const dateValidation = validateDate(preferredDate);
    if (!dateValidation.valid) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: dateValidation.error || "Invalid estimate ID or date",
        },
        { status: 400 }
      );
    }

    // Get available groomers
    const availableGroomers = await db
      .select()
      .from(groomers)
      .where(eq(groomers.available, true));

    if (availableGroomers.length === 0) {
      return NextResponse.json(
        {
          slots: [],
        },
        { status: 200 }
      );
    }

    // Generate time slots for the requested date
    const requestedDate = new Date(preferredDate);
    const allSlots = generateTimeSlots(requestedDate, availableGroomers);

    // Get existing appointments for this date to exclude booked slots
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.status, "confirmed"),
          // Note: SQLite doesn't have native date comparison, so we'll filter in JS
        )
      );

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = slot.startTime.getTime();
      const slotEnd = slot.endTime.getTime();

      return !existingAppointments.some((apt) => {
        const aptStart = new Date(apt.start_time).getTime();
        const aptEnd = new Date(apt.end_time).getTime();

        // Check for overlap
        return (
          (slotStart >= aptStart && slotStart < aptEnd) ||
          (slotEnd > aptStart && slotEnd <= aptEnd) ||
          (slotStart <= aptStart && slotEnd >= aptEnd)
        );
      });
    });

    // Format response
    const slots = availableSlots.map((slot) => {
      const groomer = availableGroomers.find((g) => g.id === slot.groomerId);
      return {
        slotId: formatSlotId(slot.groomerId, slot.startTime),
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        groomer: groomer?.name || "Unknown",
      };
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[appointments/propose]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to propose appointments",
      },
      { status: 500 }
    );
  }
}
