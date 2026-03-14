import { db } from "./index";
import { appointments } from "./schema";
import { sql } from "drizzle-orm";

/**
 * Generate a unique confirmation number in format: PD-YYYY-XXXXXX
 */
export async function generateConfirmationNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PD-${year}-`;

  // Find the highest existing number for this year
  const result = await db
    .select({
      maxNumber: sql<number>`MAX(CAST(SUBSTR(${appointments.confirmation_number}, ${prefix.length + 1}) AS INTEGER))`,
    })
    .from(appointments)
    .where(sql`${appointments.confirmation_number} LIKE ${prefix + "%"}`);

  const maxNumber = result[0]?.maxNumber ?? 0;
  const nextNumber = maxNumber + 1;

  // Format as 6-digit number with leading zeros
  const numberPart = nextNumber.toString().padStart(6, "0");
  const confirmationNumber = `${prefix}${numberPart}`;

  // Double-check uniqueness (race condition protection)
  const existing = await db
    .select()
    .from(appointments)
    .where(sql`${appointments.confirmation_number} = ${confirmationNumber}`)
    .limit(1);

  if (existing.length > 0) {
    // If collision, try again with incremented number
    return generateConfirmationNumber();
  }

  return confirmationNumber;
}
