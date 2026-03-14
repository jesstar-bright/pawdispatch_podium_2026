import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pricing_estimates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/pricing/estimate/[estimateId]
 * Retrieve pricing estimate by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ estimateId: string }> }
) {
  try {
    const { estimateId } = await params;

    const estimate = await db
      .select()
      .from(pricing_estimates)
      .where(eq(pricing_estimates.id, estimateId))
      .limit(1);

    if (estimate.length === 0) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Estimate not found",
        },
        { status: 404 }
      );
    }

    const est = estimate[0];

    return NextResponse.json({
      estimateId: est.id,
      basePrice: est.base_price,
      adjustments: JSON.parse(est.adjustments),
      totalPrice: est.total_price,
      sizeCategory: est.size_category as "small" | "medium" | "large" | "xlarge",
      explanation: est.explanation,
      imageUrl: est.image_url,
    });
  } catch (error) {
    console.error("[pricing/estimate/[estimateId]]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to retrieve estimate",
      },
      { status: 500 }
    );
  }
}
