/**
 * POST /api/pricing/estimate
 * Proxies to the Python pricing agent (src/agents/pricing).
 * Requires PRICING_AGENT_PYTHON_URL. Multipart or JSON body.
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

export async function POST(request: Request) {
  if (!PRICING_AGENT_PYTHON_URL) {
    return NextResponse.json(
      {
        error: "Pricing agent not configured",
        message: "Set PRICING_AGENT_PYTHON_URL and run the Python pricing agent (src/agents/pricing).",
      },
      { status: 503 }
    );
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
