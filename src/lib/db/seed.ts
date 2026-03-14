import { db } from "./index";
import { groomers } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Seed the database with initial data
 * Idempotent - safe to run multiple times
 */
export async function seedDatabase(): Promise<void> {
  // Seed groomers
  const groomerNames = ["Alex Rivera", "Jordan Lee", "Casey Martinez", "Sam Taylor"];

  for (const name of groomerNames) {
    // Check if groomer already exists
    const existing = await db
      .select()
      .from(groomers)
      .where(eq(groomers.name, name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(groomers).values({
        name,
        available: true,
      });
    }
  }

  console.log("Database seeded successfully");
}
