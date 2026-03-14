/**
 * POST /api/pricing/estimate
 * Creates a pricing estimate and saves to database.
 * Can use Sam's AI module or fallback to Python pricing agent.
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
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

// Pricing rules
// Base price (weight + dirtiness) should range from $60 to $150
// Other services should range from $30 to $80
const MIN_PRICE_CENTS = 6000;   // $60 (minimum base)
const MAX_PRICE_CENTS = 100000; // $1000 (maximum total)

// Base prices by size (weight-based)
const GROOMING_BASE_PRICE_CENTS: Record<string, number> = {
  small: 6000,   // $60
  medium: 7500,  // $75
  large: 9000,   // $90
  xlarge: 10500, // $105
};

// Dirtiness adjustments (part of base price calculation)
// These adjust the base price to stay within $60-$150 range
const SLIGHTLY_DIRTY_CENTS = 1000;    // $10
const MODERATELY_DIRTY_CENTS = 2500;   // $25
const VERY_DIRTY_CENTS = 4500;         // $45

// Other services (range $30-$80)
const LONG_THICK_COAT_CENTS = 5000;    // $50
const MATTED_FUR_CENTS = 6000;          // $60
const SPECIAL_HANDLING_CENTS = 4000;   // $40

type SizeBand = "small" | "medium" | "large" | "xlarge";

function sizeBandFromWeight(weightLbs: number | null | undefined): SizeBand {
  if (!weightLbs || weightLbs <= 0) {
    return "medium";
  }
  if (weightLbs < 15) {
    return "small";
  }
  if (weightLbs < 40) {
    return "medium";
  }
  if (weightLbs < 80) {
    return "large";
  }
  return "xlarge";
}

type DirtinessLevel = "clean" | "slightly_dirty" | "moderately_dirty" | "very_dirty";

function computeGroomingPrice(
  sizeBand: SizeBand,
  longThickCoat: boolean = false,
  mattedFur: boolean = false,
  specialHandling: boolean = false,
  dirtinessLevel: DirtinessLevel = "clean"
) {
  // Start with base price by size (weight-based)
  const sizeBasePrice = GROOMING_BASE_PRICE_CENTS[sizeBand];
  const adjustments: Array<{ reason: string; amount: number }> = [];
  
  // Add dirtiness adjustment (base + dirtiness = $60-$150 range)
  let dirtinessAdjustment = 0;
  if (dirtinessLevel === "slightly_dirty") {
    dirtinessAdjustment = SLIGHTLY_DIRTY_CENTS;
    adjustments.push({ reason: "Slightly dirty (extra cleaning time)", amount: SLIGHTLY_DIRTY_CENTS });
  } else if (dirtinessLevel === "moderately_dirty") {
    dirtinessAdjustment = MODERATELY_DIRTY_CENTS;
    adjustments.push({ reason: "Moderately dirty (extensive cleaning required)", amount: MODERATELY_DIRTY_CENTS });
  } else if (dirtinessLevel === "very_dirty") {
    dirtinessAdjustment = VERY_DIRTY_CENTS;
    adjustments.push({ reason: "Very dirty (deep cleaning and deodorizing)", amount: VERY_DIRTY_CENTS });
  }
  
  // Base price = size + dirtiness (should be $60-$150)
  let basePrice = sizeBasePrice + dirtinessAdjustment;
  
  // Ensure base price stays within $60-$150 range
  const BASE_MAX_CENTS = 15000; // $150
  basePrice = Math.max(MIN_PRICE_CENTS, Math.min(BASE_MAX_CENTS, basePrice));
  
  // Calculate total starting from base price (size + dirtiness)
  let totalPrice = basePrice;

  // Add other services (range $30-$80 each)
  if (longThickCoat) {
    totalPrice += LONG_THICK_COAT_CENTS;
    adjustments.push({ reason: "Long/thick coat", amount: LONG_THICK_COAT_CENTS });
  }
  if (mattedFur) {
    totalPrice += MATTED_FUR_CENTS;
    adjustments.push({ reason: "Matted fur", amount: MATTED_FUR_CENTS });
  }
  if (specialHandling) {
    totalPrice += SPECIAL_HANDLING_CENTS;
    adjustments.push({ reason: "Special handling (anxious/extra care)", amount: SPECIAL_HANDLING_CENTS });
  }

  // Clamp total price to maximum
  totalPrice = Math.max(MIN_PRICE_CENTS, Math.min(MAX_PRICE_CENTS, totalPrice));

  // Build explanation - base price includes size + dirtiness
  const factors = [{ label: `Base (${sizeBand}${dirtinessLevel !== "clean" ? `, ${dirtinessLevel.replace("_", " ")}` : ""})`, amountCents: basePrice }];
  for (const adj of adjustments) {
    // Only include other services in factors (dirtiness is already in base)
    if (!adj.reason.includes("dirty")) {
      factors.push({ label: adj.reason, amountCents: adj.amount });
    }
  }

  const explanation = `Total $${(totalPrice / 100).toFixed(2)} — ${factors.map(f => `${f.label}: $${(f.amountCents / 100).toFixed(2)}`).join("; ")}.`;

  return {
    sizeCategory: sizeBand,
    basePrice,
    adjustments,
    totalPrice,
    explanation,
  };
}

interface ImageAnalysis {
  sizeCategory: SizeBand;
  longThickCoat: boolean;
  mattedFur: boolean;
  specialHandling: boolean;
  breedGuess: string | null;
  dirtinessLevel: DirtinessLevel;
}

async function analyzeDogImage(
  imageBuffer: Buffer,
  apiKey: string | undefined,
  weightLbs: number | null | undefined,
  breedFromForm: string | null | undefined
): Promise<ImageAnalysis | null> {
  if (!apiKey) {
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });
    const base64Image = imageBuffer.toString("base64");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `You are a dog grooming pricing classifier. Analyze this dog photo carefully and respond with a single JSON object (no markdown, no code block) with exactly these keys:

- sizeCategory: one of "small", "medium", "large", "xlarge" (small <15 lbs equivalent, medium 15-40, large 40-80, xlarge 80+). Use visual size estimation, but if weight is provided (${weightLbs || "not provided"} lbs), use that as the primary indicator.

- longThickCoat: boolean (long or very thick/dense coat that requires more grooming time and products)

- mattedFur: boolean (visible matting, tangles, or severely knotted fur that requires dematting)

- specialHandling: boolean (signs of anxiety, nervousness, fear, or behavioral indicators that the dog may need extra care and patience during grooming)

- breedGuess: string (optional, brief breed guess. If breed is provided in form: "${breedFromForm || "not provided"}", use that if it seems accurate, otherwise make your best guess based on the image)

- dirtinessLevel: one of "clean", "slightly_dirty", "moderately_dirty", "very_dirty" 
  IMPORTANT: Carefully examine the dog's coat, paws, and overall appearance to assess dirtiness:
  - "clean": Dog appears clean, well-maintained, minimal dirt or stains
  - "slightly_dirty": Some visible dirt, mud, or stains on paws, legs, or coat - requires extra cleaning time
  - "moderately_dirty": Noticeable dirt, mud, or stains covering significant portions of the body - requires extensive cleaning
  - "very_dirty": Dog is heavily soiled with mud, dirt, stains, or appears to have been in very dirty conditions - requires deep cleaning and deodorizing

Only output the JSON object.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    if (!text) {
      return null;
    }

    // Remove markdown code blocks if present
    const cleanedText = text.replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    // Validate sizeCategory
    if (!["small", "medium", "large", "xlarge"].includes(parsed.sizeCategory)) {
      // Fallback to weight-based if invalid
      parsed.sizeCategory = sizeBandFromWeight(weightLbs);
    }

    // Validate dirtinessLevel
    if (!["clean", "slightly_dirty", "moderately_dirty", "very_dirty"].includes(parsed.dirtinessLevel)) {
      parsed.dirtinessLevel = "clean";
    }

    return {
      sizeCategory: parsed.sizeCategory as SizeBand,
      longThickCoat: Boolean(parsed.longThickCoat),
      mattedFur: Boolean(parsed.mattedFur),
      specialHandling: Boolean(parsed.specialHandling),
      breedGuess: parsed.breedGuess || null,
      dirtinessLevel: parsed.dirtinessLevel as DirtinessLevel,
    };
  } catch (error) {
    console.error("[pricing/estimate] Claude Vision error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  // If Python agent is not configured, return mock data
  if (!PRICING_AGENT_PYTHON_URL) {
    try {
      const contentType = request.headers.get("content-type") ?? "";
      
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const image = formData.get("image");
        const petName = formData.get("petName")?.toString() ?? "";
        const weightStr = formData.get("weight")?.toString();
        const breed = formData.get("breed")?.toString();

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

        // Analyze image with Claude Vision if API key is available
        const weight = weightStr ? parseFloat(weightStr) : null;
        const apiKey = process.env.ANTHROPIC_API_KEY;
        const imageAnalysis = await analyzeDogImage(imageBuffer, apiKey, weight, breed);

        // Use image analysis if available, otherwise fall back to weight/breed heuristics
        let sizeBand: SizeBand;
        let longThickCoat = false;
        let mattedFur = false;
        let specialHandling = false;
        let dirtinessLevel: DirtinessLevel = "clean";

        if (imageAnalysis) {
          sizeBand = imageAnalysis.sizeCategory;
          longThickCoat = imageAnalysis.longThickCoat;
          mattedFur = imageAnalysis.mattedFur;
          specialHandling = imageAnalysis.specialHandling;
          dirtinessLevel = imageAnalysis.dirtinessLevel;
        } else {
          // Fallback: use weight for size, breed for coat type
          sizeBand = sizeBandFromWeight(weight);
          longThickCoat = breed ? /retriever|shepherd|husky|collie|spaniel|poodle|bichon/i.test(breed) : false;
        }

        const estimate = computeGroomingPrice(sizeBand, longThickCoat, mattedFur, specialHandling, dirtinessLevel);

        // Save estimate to database
        try {
          await db.insert(pricing_estimates).values({
            id: estimateId,
            pet_id: null,
            base_price: estimate.basePrice,
            adjustments: JSON.stringify(estimate.adjustments),
            total_price: estimate.totalPrice,
            size_category: estimate.sizeCategory,
            explanation: estimate.explanation,
            image_url: imageUrl,
          });
        } catch (dbError) {
          console.error("[pricing/estimate] Database error:", dbError);
        }

        return NextResponse.json(
          toSpecResponse(estimate, estimateId, imageUrl)
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

      // Analyze image if provided
      let imageBuffer: Buffer | null = null;
      if (body.image) {
        try {
          const base64Data = body.image.includes(",") ? body.image.split(",")[1] : body.image;
          imageBuffer = Buffer.from(base64Data, "base64");
        } catch (e) {
          console.error("[pricing/estimate] Failed to decode base64 image:", e);
        }
      }

      let sizeBand: SizeBand;
      let longThickCoat = false;
      let mattedFur = false;
      let specialHandling = false;
      let dirtinessLevel: DirtinessLevel = "clean";

      if (imageBuffer) {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        const imageAnalysis = await analyzeDogImage(imageBuffer, apiKey, body.weight, body.breed);
        if (imageAnalysis) {
          sizeBand = imageAnalysis.sizeCategory;
          longThickCoat = imageAnalysis.longThickCoat;
          mattedFur = imageAnalysis.mattedFur;
          specialHandling = imageAnalysis.specialHandling;
          dirtinessLevel = imageAnalysis.dirtinessLevel;
        } else {
          // Fallback to weight/breed
          sizeBand = sizeBandFromWeight(body.weight);
          longThickCoat = body.breed ? /retriever|shepherd|husky|collie|spaniel|poodle|bichon/i.test(body.breed) : false;
        }
      } else {
        // No image provided, use weight/breed only
        sizeBand = sizeBandFromWeight(body.weight);
        longThickCoat = body.breed ? /retriever|shepherd|husky|collie|spaniel|poodle|bichon/i.test(body.breed) : false;
      }

      const estimate = computeGroomingPrice(sizeBand, longThickCoat, mattedFur, specialHandling, dirtinessLevel);

      const estimateId = randomUUID();
      return NextResponse.json(
        toSpecResponse(estimate, estimateId, "")
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
