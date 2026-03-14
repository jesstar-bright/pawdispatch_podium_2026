import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, customers, pets, groomers, pricing_estimates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/appointments/[appointmentId]
 * Retrieve appointment details by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const appointmentId = params.appointmentId;

    // Get appointment with joins
    const appointment = await db
      .select({
        appointment: appointments,
        customer: customers,
        pet: pets,
        groomer: groomers,
        estimate: pricing_estimates,
      })
      .from(appointments)
      .innerJoin(customers, eq(appointments.customer_id, customers.id))
      .innerJoin(pets, eq(appointments.pet_id, pets.id))
      .innerJoin(groomers, eq(appointments.groomer_id, groomers.id))
      .innerJoin(pricing_estimates, eq(appointments.estimate_id, pricing_estimates.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (appointment.length === 0) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Appointment not found",
        },
        { status: 404 }
      );
    }

    const apt = appointment[0];

    return NextResponse.json({
      appointmentId: apt.appointment.id,
      status: apt.appointment.status,
      startTime: apt.appointment.start_time,
      endTime: apt.appointment.end_time,
      groomer: apt.groomer.name,
      totalPrice: apt.estimate.total_price,
      confirmationNumber: apt.appointment.confirmation_number,
      customerName: apt.customer.name,
      petName: apt.pet.name,
      address: apt.customer.address,
    });
  } catch (error) {
    console.error("[appointments/[appointmentId]]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to retrieve appointment",
      },
      { status: 500 }
    );
  }
}
