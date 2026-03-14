/**
 * POST /api/pricing/estimate
 * Creates a pricing estimate and saves to database.
 * Can use Sam's AI module or fallback to Python pricing agent.
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { pricing_estimates } from "@/lib/db/schema";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PRICING_AGENT_PYTHON_URL = process.env.PRICING_AGENT_PYTHON_URL;

async function saveUploadedImage(estimateId: string, buffer: Buffer): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${estimateId}.jpg`;
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

function toSpecResponse(
  result: {
    sizeCategory: string;
    basePrice: number;
    adjustments: Array<{ reason: string; amount: number }>;
    totalPrice: number;
    explanation: string;
  },
  estimateId: string,
  imageUrl: string
) {
  return {
    estimateId,
    basePrice: result.basePrice,
    adjustments: result.adjustments,
    totalPrice: result.totalPrice,
    sizeCategory: result.sizeCategory,
    explanation: result.explanation,
    imageUrl,
  };
}

const SPEC_ERROR = {
  error: "Pricing estimate failed",
  message: "Unable to generate pricing estimate. Please try again.",
} as const;

// Mock data for when Python agent is not available
const MOCK_ESTIMATE = {
  sizeCategory: "large",
  basePrice: 5500,
  adjustments: [
    { reason: "Long/thick coat", amount: 1500 },
    { reason: "Large dog adjustment", amount: 500 },
  ],
  totalPrice: 7500,
  explanation: "Based on the photo, this appears to be a large breed with a thick double coat that requires extra grooming time. The estimate includes base grooming services plus adjustments for coat complexity and size.",
};

export async function POST(request: Request) {
  // If Python agent is not configured, return mock data
  if (!PRICING_AGENT_PYTHON_URL) {
    try {
      const contentType = request.headers.get("content-type") ?? "";
      
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const image = formData.get("image");
        const petName = formData.get("petName")?.toString() ?? "";

        if (!image || typeof image === "string") {
          return NextResponse.json(
            { ...SPEC_ERROR, message: "Image file is required." },
            { status: 400 }
          );
        }
        if (!petName.trim()) {
          return NextResponse.json(
            { ...SPEC_ERROR, message: "Pet name is required." },
            { status: 400 }
          );
        }

        const file = image as File;
        const arrayBuffer = await file.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const estimateId = randomUUID();
        const imageUrl = await saveUploadedImage(estimateId, imageBuffer);

        // Save mock estimate to database
        try {
          await db.insert(pricing_estimates).values({
            id: estimateId,
            pet_id: null,
            base_price: MOCK_ESTIMATE.basePrice,
            adjustments: JSON.stringify(MOCK_ESTIMATE.adjustments),
            total_price: MOCK_ESTIMATE.totalPrice,
            size_category: MOCK_ESTIMATE.sizeCategory,
            explanation: MOCK_ESTIMATE.explanation,
            image_url: imageUrl,
          });
        } catch (dbError) {
          console.error("[pricing/estimate] Database error:", dbError);
        }

        return NextResponse.json(
          toSpecResponse(MOCK_ESTIMATE, estimateId, imageUrl)
        );
      }

      // JSON request
      const body = (await request.json()) as {
        petName?: string;
        breed?: string;
        weight?: number;
        image?: string;
      };
      const petName = body.petName?.trim() ?? "";
      if (!petName) {
        return NextResponse.json(
          { ...SPEC_ERROR, message: "Pet name is required." },
          { status: 400 }
        );
      }

      const estimateId = randomUUID();
      return NextResponse.json(
        toSpecResponse(MOCK_ESTIMATE, estimateId, "")
      );
    } catch (e) {
      console.error("[pricing/estimate] Mock mode error:", e);
      return NextResponse.json(SPEC_ERROR, { status: 500 });
    }
  }

  const base = PRICING_AGENT_PYTHON_URL.replace(/\/$/, "");

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image");
      const petName = formData.get("petName")?.toString() ?? "";

      if (!image || typeof image === "string") {
        return NextResponse.json(
          { ...SPEC_ERROR, message: "Image file is required." },
          { status: 400 }
        );
      }
      if (!petName.trim()) {
        return NextResponse.json(
          { ...SPEC_ERROR, message: "Pet name is required." },
          { status: 400 }
        );
      }

      const file = image as File;
      const arrayBuffer = await file.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const estimateId = randomUUID();

      const pythonForm = new FormData();
      pythonForm.append("image", file);
      pythonForm.append("petName", petName);
      const breed = formData.get("breed")?.toString();
      if (breed) pythonForm.append("breed", breed);
      const weight = formData.get("weight")?.toString();
      if (weight) pythonForm.append("weight", weight);

      const res = await fetch(`${base}/estimate`, { method: "POST", body: pythonForm });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json(
          { ...SPEC_ERROR, message: (err as { detail?: string }).detail ?? SPEC_ERROR.message },
          { status: res.status >= 400 ? res.status : 500 }
        );
      }

      const data = (await res.json()) as Record<string, unknown>;
      const imageUrl = await saveUploadedImage(estimateId, imageBuffer);

      // Save to database
      try {
        await db.insert(pricing_estimates).values({
          id: estimateId,
          pet_id: null, // Will be set at booking time
          base_price: Number(data.basePrice),
          adjustments: JSON.stringify(data.adjustments ?? []),
          total_price: Number(data.totalPrice),
          size_category: String(data.sizeCategory),
          explanation: String(data.explanation),
          image_url: imageUrl,
        });
      } catch (dbError) {
        console.error("[pricing/estimate] Database error:", dbError);
        // Continue anyway - return the response even if DB save fails
      }

      return NextResponse.json(
        toSpecResponse(
          {
            sizeCategory: String(data.sizeCategory),
            basePrice: Number(data.basePrice),
            adjustments: (data.adjustments as Array<{ reason: string; amount: number }>) ?? [],
            totalPrice: Number(data.totalPrice),
            explanation: String(data.explanation),
          },
          estimateId,
          imageUrl
        )
      );
    }

    const body = (await request.json()) as {
      petName?: string;
      breed?: string;
      weight?: number;
      image?: string;
    };
    const petName = body.petName?.trim() ?? "";
    if (!petName) {
      return NextResponse.json(
        { ...SPEC_ERROR, message: "Pet name is required." },
        { status: 400 }
      );
    }

    const res = await fetch(`${base}/estimate/json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petName,
        breed: body.breed ?? null,
        weight: body.weight ?? null,
        image: body.image ?? null,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { ...SPEC_ERROR, message: (err as { detail?: string }).detail ?? SPEC_ERROR.message },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    const data = (await res.json()) as Record<string, unknown>;
    const estimateId = String(data.estimateId ?? randomUUID());
    return NextResponse.json(
      toSpecResponse(
        {
          sizeCategory: String(data.sizeCategory),
          basePrice: Number(data.basePrice),
          adjustments: (data.adjustments as Array<{ reason: string; amount: number }>) ?? [],
          totalPrice: Number(data.totalPrice),
          explanation: String(data.explanation),
        },
        estimateId,
        ""
      )
    );
  } catch (e) {
    console.error("[pricing/estimate]", e);
    return NextResponse.json(SPEC_ERROR, { status: 500 });
  }
}
