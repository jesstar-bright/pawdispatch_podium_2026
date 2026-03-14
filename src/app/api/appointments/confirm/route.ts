import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  pricing_estimates,
  customers,
  pets,
  appointments,
  groomers,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { validateEmail, validateUUID } from "@/lib/db/utils";
import { parseSlotId } from "@/lib/db/slots";
import { generateConfirmationNumber } from "@/lib/db/confirmation";
import { randomUUID } from "crypto";

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

    if (!slotId || !estimateId || !customerName || !customerEmail || !customerPhone || !address || !petName) {
      return NextResponse.json(
        { error: "Validation error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!validateEmail(customerEmail)) {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!validateUUID(estimateId)) {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid estimate ID" },
        { status: 400 }
      );
    }

    const parsedSlot = parseSlotId(slotId);
    if (!parsedSlot) {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid slot ID format" },
        { status: 400 }
      );
    }

    // 1. Validate estimate exists
    const estimate = db
      .select()
      .from(pricing_estimates)
      .where(eq(pricing_estimates.id, estimateId))
      .limit(1)
      .all();

    if (estimate.length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid estimate ID" },
        { status: 400 }
      );
    }

    const est = estimate[0];

    // 2. Check slot availability
    const conflicting = db
      .select()
      .from(appointments)
      .where(eq(appointments.groomer_id, parsedSlot.groomerId))
      .all()
      .filter((apt) => {
        if (apt.status !== "confirmed") return false;
        const aptStart = new Date(apt.start_time).getTime();
        const slotStart = parsedSlot.startTime.getTime();
        return aptStart === slotStart;
      });

    if (conflicting.length > 0) {
      return NextResponse.json(
        { error: "Conflict", message: "This time slot has already been booked. Please select another slot." },
        { status: 409 }
      );
    }

    // 3. Create or find customer
    const existingCustomer = db
      .select()
      .from(customers)
      .where(eq(customers.email, customerEmail))
      .limit(1)
      .all();

    let customerId: string;
    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id;
      db.update(customers)
        .set({ name: customerName, phone: customerPhone, address })
        .where(eq(customers.id, customerId))
        .run();
    } else {
      customerId = randomUUID();
      db.insert(customers)
        .values({
          id: customerId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address,
        })
        .run();
    }

    // 4. Create pet
    const petId = randomUUID();
    db.insert(pets)
      .values({
        id: petId,
        customer_id: customerId,
        name: petName,
        breed: null,
        weight: null,
        size_category: est.size_category,
        image_url: est.image_url,
      })
      .run();

    // 5. Update estimate with pet_id
    db.update(pricing_estimates)
      .set({ pet_id: petId })
      .where(eq(pricing_estimates.id, estimateId))
      .run();

    // 6. Create appointment
    const appointmentId = randomUUID();
    const confirmationNumber = generateConfirmationNumber();
    const endTime = new Date(parsedSlot.startTime);
    endTime.setHours(endTime.getHours() + 1);

    db.insert(appointments)
      .values({
        id: appointmentId,
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
      .run();

    // 7. Get groomer name
    const groomer = db
      .select()
      .from(groomers)
      .where(eq(groomers.id, parsedSlot.groomerId))
      .limit(1)
      .all();

    return NextResponse.json({
      appointmentId,
      status: "confirmed",
      startTime: parsedSlot.startTime.toISOString(),
      endTime: endTime.toISOString(),
      groomer: groomer[0]?.name || "Unknown",
      totalPrice: est.total_price,
      confirmationNumber,
    });
  } catch (error) {
    console.error("[appointments/confirm]", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Unable to confirm appointment" },
      { status: 500 }
    );
  }
}
