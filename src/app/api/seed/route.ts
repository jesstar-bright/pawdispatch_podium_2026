import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

/**
 * POST /api/seed
 * Seed the database with initial data (dev only)
 */
export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "Seed endpoint is only available in development",
      },
      { status: 403 }
    );
  }

  try {
    await seedDatabase();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("[seed]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to seed database",
      },
      { status: 500 }
    );
  }
}
