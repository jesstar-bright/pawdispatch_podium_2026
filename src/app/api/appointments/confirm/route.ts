import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  pricing_estimates,
  customers,
  pets,
  appointments,
  groomers,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { validateEmail, validateUUID } from "@/lib/db/utils";
import { parseSlotId } from "@/lib/db/slots";
import { generateConfirmationNumber } from "@/lib/db/confirmation";

/**
 * POST /api/appointments/confirm
 * Confirm an appointment booking with race condition protection
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slotId,
      estimateId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      petName,
      notes,
    } = body;

    // Validate required fields
    if (
      !slotId ||
      !estimateId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !address ||
      !petName
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Missing required fields",
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

    // Validate estimateId
    if (!validateUUID(estimateId)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid estimate ID",
        },
        { status: 400 }
      );
    }

    // Parse slot ID
    const parsedSlot = parseSlotId(slotId);
    if (!parsedSlot) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid slot ID format",
        },
        { status: 400 }
      );
    }

    // Use database transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // 1. Validate estimate exists
      const estimate = await tx
        .select()
        .from(pricing_estimates)
        .where(eq(pricing_estimates.id, estimateId))
        .limit(1);

      if (estimate.length === 0) {
        throw new Error("Invalid estimate ID");
      }

      const est = estimate[0];

      // 2. Check slot availability (race condition check)
      const conflictingAppointments = await tx
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.groomer_id, parsedSlot.groomerId),
            eq(appointments.status, "confirmed")
          )
        );

      const slotStart = parsedSlot.startTime.getTime();
      const slotEnd = new Date(parsedSlot.startTime);
      slotEnd.setHours(slotEnd.getHours() + 1);
      const slotEndTime = slotEnd.getTime();

      const hasConflict = conflictingAppointments.some((apt) => {
        const aptStart = new Date(apt.start_time).getTime();
        const aptEnd = new Date(apt.end_time).getTime();

        return (
          (slotStart >= aptStart && slotStart < aptEnd) ||
          (slotEndTime > aptStart && slotEndTime <= aptEnd) ||
          (slotStart <= aptStart && slotEndTime >= aptEnd)
        );
      });

      if (hasConflict) {
        throw new Error("SLOT_TAKEN");
      }

      // 3. Create or find customer
      let customer = await tx
        .select()
        .from(customers)
        .where(eq(customers.email, customerEmail))
        .limit(1);

      let customerId: string;
      if (customer.length > 0) {
        customerId = customer[0].id;
        // Update customer info if needed
        await tx
          .update(customers)
          .set({
            name: customerName,
            phone: customerPhone,
            address: address,
          })
          .where(eq(customers.id, customerId));
      } else {
        const newCustomer = await tx
          .insert(customers)
          .values({
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: address,
          })
          .returning();
        customerId = newCustomer[0].id;
      }

      // 4. Create pet record
      const newPet = await tx
        .insert(pets)
        .values({
          customer_id: customerId,
          name: petName,
          breed: null, // Could extract from estimate if available
          weight: null, // Could extract from estimate if available
          size_category: est.size_category,
          image_url: est.image_url,
        })
        .returning();

      const petId = newPet[0].id;

      // 5. Update pricing_estimates.pet_id
      await tx
        .update(pricing_estimates)
        .set({ pet_id: petId })
        .where(eq(pricing_estimates.id, estimateId));

      // 6. Generate confirmation number
      const confirmationNumber = generateConfirmationNumber();

      // 7. Create appointment
      const endTime = new Date(parsedSlot.startTime);
      endTime.setHours(endTime.getHours() + 1);

      const newAppointment = await tx
        .insert(appointments)
        .values({
          customer_id: customerId,
          pet_id: petId,
          estimate_id: estimateId,
          groomer_id: parsedSlot.groomerId,
          start_time: parsedSlot.startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: "confirmed",
          confirmation_number: confirmationNumber,
          notes: notes || null,
        })
        .returning();

      // 8. Get groomer name
      const groomer = await tx
        .select()
        .from(groomers)
        .where(eq(groomers.id, parsedSlot.groomerId))
        .limit(1);

      return {
        appointmentId: newAppointment[0].id,
        status: "confirmed" as const,
        startTime: parsedSlot.startTime.toISOString(),
        endTime: endTime.toISOString(),
        groomer: groomer[0]?.name || "Unknown",
        totalPrice: est.total_price,
        confirmationNumber,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[appointments/confirm]", error);

    if (error instanceof Error && error.message === "SLOT_TAKEN") {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "This time slot has already been booked. Please select another slot.",
        },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message === "Invalid estimate ID") {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid estimate ID",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to confirm appointment",
      },
      { status: 500 }
    );
  }
}
