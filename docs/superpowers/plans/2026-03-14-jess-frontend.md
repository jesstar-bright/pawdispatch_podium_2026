# Jess Frontend Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete frontend for the Lead-to-Booking flow — landing page, photo upload, pricing display, slot booking, and confirmation — with dead-end nav links for future agents.

**Architecture:** Next.js App Router pages with client components for interactivity. Each page is its own route. Forms use standard React state + fetch to call Spencer's API routes. Mock API responses are provided so development can proceed without the backend.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-03-14-lead-to-booking-spec.md`

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Modify — add Navbar, update metadata
│   ├── globals.css             # Modify — add brand colors
│   ├── page.tsx                # Rewrite — Landing page
│   ├── upload/
│   │   └── page.tsx            # Create — Photo upload + pet details form
│   ├── pricing/
│   │   └── [estimateId]/
│   │       └── page.tsx        # Create — Pricing result display
│   ├── booking/
│   │   └── [estimateId]/
│   │       └── page.tsx        # Create — Slot picker + customer form
│   ├── confirmation/
│   │   └── [appointmentId]/
│   │       └── page.tsx        # Create — Booking confirmation
│   └── coming-soon/
│       └── page.tsx            # Create — Dead-end for future agents
├── components/
│   ├── Navbar.tsx              # Create — Top nav with dead-end links
│   ├── PhotoUpload.tsx         # Create — Drag-and-drop image upload
│   ├── PetDetailsForm.tsx      # Create — Name, breed, weight fields
│   ├── PricingCard.tsx         # Create — Price breakdown display
│   ├── SlotPicker.tsx          # Create — Date + time slot selection
│   └── ConfirmationDetails.tsx # Create — Summary after booking
├── lib/
│   └── api.ts                  # Create — Fetch wrappers + mock mode
```

## Chunk 1: Foundation (Layout, Nav, Globals, Mock API Layer)

### Task 1: Brand colors and global styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css with PawDispatch brand colors**

Replace the entire file with:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
  --paw-blue: #2563eb;
  --paw-blue-dark: #1d4ed8;
  --paw-green: #16a34a;
  --paw-orange: #ea580c;
  --paw-gray: #f4f4f5;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-paw-blue: var(--paw-blue);
  --color-paw-blue-dark: var(--paw-blue-dark);
  --color-paw-green: var(--paw-green);
  --color-paw-orange: var(--paw-orange);
  --color-paw-gray: var(--paw-gray);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 2: Verify dev server runs**

Run: `cd /Users/jessicatalbert/Projects/pawdispatch_podium_2026 && npm run dev`
Expected: Server starts on localhost:3000, no errors

### Task 2: API helper with mock mode

**Files:**
- Create: `src/lib/api.ts`

- [ ] **Step 1: Create the API helper**

This file wraps all fetch calls to Spencer's API routes. When `NEXT_PUBLIC_MOCK_API=true`, it returns hardcoded mock data so Jess can build UI without the backend.

```typescript
const MOCK = process.env.NEXT_PUBLIC_MOCK_API === "true";

export interface PricingEstimate {
  estimateId: string;
  basePrice: number;
  adjustments: Array<{ reason: string; amount: number }>;
  totalPrice: number;
  sizeCategory: "small" | "medium" | "large" | "xlarge";
  explanation: string;
  imageUrl: string;
}

export interface TimeSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  groomer: string;
}

export interface AppointmentConfirmation {
  appointmentId: string;
  status: "confirmed";
  startTime: string;
  endTime: string;
  groomer: string;
  totalPrice: number;
  confirmationNumber: string;
}

const MOCK_ESTIMATE: PricingEstimate = {
  estimateId: "est-mock-001",
  basePrice: 5500,
  adjustments: [
    { reason: "Long/thick coat", amount: 1500 },
    { reason: "Large dog adjustment", amount: 500 },
  ],
  totalPrice: 7500,
  sizeCategory: "large",
  explanation:
    "Based on the photo, this appears to be a large breed (Golden Retriever, ~65 lbs) with a thick double coat that requires extra grooming time.",
  imageUrl: "/uploads/mock-dog.jpg",
};

const MOCK_SLOTS: TimeSlot[] = [
  { slotId: "slot-1", startTime: "2026-03-15T09:00:00", endTime: "2026-03-15T10:00:00", groomer: "Alex Rivera" },
  { slotId: "slot-2", startTime: "2026-03-15T11:00:00", endTime: "2026-03-15T12:00:00", groomer: "Jordan Lee" },
  { slotId: "slot-3", startTime: "2026-03-15T14:00:00", endTime: "2026-03-15T15:00:00", groomer: "Alex Rivera" },
  { slotId: "slot-4", startTime: "2026-03-16T10:00:00", endTime: "2026-03-16T11:00:00", groomer: "Casey Martinez" },
];

const MOCK_CONFIRMATION: AppointmentConfirmation = {
  appointmentId: "apt-mock-001",
  status: "confirmed",
  startTime: "2026-03-15T09:00:00",
  endTime: "2026-03-15T10:00:00",
  groomer: "Alex Rivera",
  totalPrice: 7500,
  confirmationNumber: "PAW-2026-0042",
};

export async function submitPricingEstimate(formData: FormData): Promise<PricingEstimate> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1500)); // simulate AI delay
    return MOCK_ESTIMATE;
  }
  const res = await fetch("/api/pricing/estimate", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to get pricing estimate");
  return res.json();
}

export async function proposeAppointments(data: {
  estimateId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
}): Promise<{ slots: TimeSlot[] }> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { slots: MOCK_SLOTS };
  }
  const res = await fetch("/api/appointments/propose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get appointment slots");
  return res.json();
}

export async function confirmAppointment(data: {
  slotId: string;
  estimateId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  petName: string;
  notes?: string;
}): Promise<AppointmentConfirmation> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_CONFIRMATION;
  }
  const res = await fetch("/api/appointments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to confirm appointment");
  return res.json();
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
```

- [ ] **Step 2: Add NEXT_PUBLIC_MOCK_API to .env.local**

Add to `.env.local`:
```
NEXT_PUBLIC_MOCK_API=true
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/api.ts src/app/globals.css .env.local
git commit -m "feat: add brand colors and API helper with mock mode"
```

### Task 3: Navbar component

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navbar with dead-end links**

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-paw-blue">
          PawDispatch
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/upload" className="hover:text-paw-blue">
            Get Estimate
          </Link>
          <Link href="/coming-soon?agent=tracking" className="hover:text-paw-blue">
            Track Appointment
          </Link>
          <Link href="/coming-soon?agent=sdr" className="hover:text-paw-blue">
            SDR Console
          </Link>
          <Link href="/coming-soon?agent=analytics" className="hover:text-paw-blue">
            Analytics
          </Link>
          <Link href="/coming-soon?agent=retention" className="hover:text-paw-blue">
            Retention
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Update layout.tsx**

Replace layout.tsx content:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PawDispatch - Mobile Pet Grooming",
  description: "AI-powered mobile pet grooming at your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx src/app/layout.tsx
git commit -m "feat: add Navbar with dead-end links for future agents"
```

---

## Chunk 2: Landing Page + Coming Soon + Upload Page

### Task 4: Landing page

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Replace landing page**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          Mobile Pet Grooming,
          <br />
          <span className="text-paw-blue">At Your Door</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Upload a photo of your dog, get an instant AI-powered price estimate,
          and book a professional groomer — all in minutes.
        </p>
        <Link
          href="/upload"
          className="mt-8 inline-block rounded-full bg-paw-blue px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Get a Price Estimate
        </Link>
      </section>

      {/* Value Props */}
      <section className="grid gap-8 py-16 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">📱</div>
          <h3 className="text-lg font-semibold text-zinc-900">Convenience</h3>
          <p className="mt-2 text-sm text-zinc-600">
            We come to you. No car rides, no waiting rooms — grooming at your doorstep.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">🤖</div>
          <h3 className="text-lg font-semibold text-zinc-900">AI-Powered Pricing</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Upload a photo and get a transparent, instant price estimate powered by AI vision.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <div className="mb-4 text-4xl">✂️</div>
          <h3 className="text-lg font-semibold text-zinc-900">Professional Groomers</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Experienced, vetted groomers who love animals and deliver quality results.
          </p>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run: visit `http://localhost:3000`
Expected: Landing page with hero, CTA button, and 3 value prop cards

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page with hero and value props"
```

### Task 5: Coming Soon page (dead-end for future agents)

**Files:**
- Create: `src/app/coming-soon/page.tsx`

- [ ] **Step 1: Create coming soon page**

```tsx
import Link from "next/link";

const AGENT_NAMES: Record<string, string> = {
  tracking: "Live Tracking",
  sdr: "SDR Console",
  analytics: "Analytics Dashboard",
  retention: "Retention & Surveys",
  marketing: "AI Marketing",
};

export default async function ComingSoon({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;
  const agentName = agent ? AGENT_NAMES[agent] || agent : "This Feature";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold text-zinc-900">{agentName}</h1>
      <p className="mt-4 max-w-md text-lg text-zinc-600">
        This agent is coming soon! We&apos;re building autonomous AI agents to handle
        every part of your pet grooming business.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-paw-blue px-6 py-2.5 font-semibold text-white transition-colors hover:bg-paw-blue-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/coming-soon/page.tsx
git commit -m "feat: add Coming Soon page for future agent dead-ends"
```

### Task 6: Photo upload component

**Files:**
- Create: `src/components/PhotoUpload.tsx`

- [ ] **Step 1: Create drag-and-drop photo upload**

```tsx
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
}

export default function PhotoUpload({ onFileSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
        dragOver
          ? "border-paw-blue bg-blue-50"
          : preview
            ? "border-zinc-300"
            : "border-zinc-300 hover:border-paw-blue"
      }`}
      onClick={() => document.getElementById("photo-input")?.click()}
    >
      {preview ? (
        <Image
          src={preview}
          alt="Dog photo preview"
          fill
          className="rounded-xl object-cover"
        />
      ) : (
        <>
          <div className="text-5xl mb-4">📷</div>
          <p className="text-lg font-medium text-zinc-700">
            Drop a photo of your dog here
          </p>
          <p className="mt-1 text-sm text-zinc-500">or click to browse</p>
        </>
      )}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
```

### Task 7: Pet details form component

**Files:**
- Create: `src/components/PetDetailsForm.tsx`

- [ ] **Step 1: Create pet details form**

```tsx
"use client";

interface PetDetailsFormProps {
  petName: string;
  breed: string;
  weight: string;
  onPetNameChange: (v: string) => void;
  onBreedChange: (v: string) => void;
  onWeightChange: (v: string) => void;
}

export default function PetDetailsForm({
  petName,
  breed,
  weight,
  onPetNameChange,
  onBreedChange,
  onWeightChange,
}: PetDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="petName" className="block text-sm font-medium text-zinc-700">
          Pet Name <span className="text-red-500">*</span>
        </label>
        <input
          id="petName"
          type="text"
          required
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., Buddy"
        />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-zinc-700">
          Breed <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="breed"
          type="text"
          value={breed}
          onChange={(e) => onBreedChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., Golden Retriever"
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-zinc-700">
          Weight (lbs) <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., 65"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit components**

```bash
git add src/components/PhotoUpload.tsx src/components/PetDetailsForm.tsx
git commit -m "feat: add PhotoUpload and PetDetailsForm components"
```

### Task 8: Upload page (assembles components)

**Files:**
- Create: `src/app/upload/page.tsx`

- [ ] **Step 1: Create upload page**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";
import PetDetailsForm from "@/components/PetDetailsForm";
import { submitPricingEstimate } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !petName) return;

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("petName", petName);
      formData.append("serviceType", "grooming");
      if (breed) formData.append("breed", breed);
      if (weight) formData.append("weight", weight);

      const estimate = await submitPricingEstimate(formData);
      router.push(`/pricing/${estimate.estimateId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Get a Price Estimate</h1>
      <p className="mt-2 text-zinc-600">
        Upload a photo of your dog and we&apos;ll use AI to give you an instant price estimate.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Photo</h2>
          <PhotoUpload onFileSelect={setFile} />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Pet Details</h2>
          <PetDetailsForm
            petName={petName}
            breed={breed}
            weight={weight}
            onPetNameChange={setPetName}
            onBreedChange={setBreed}
            onWeightChange={setWeight}
          />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Service</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border-2 border-paw-blue bg-blue-50 p-3 text-center text-sm font-medium text-paw-blue">
              Grooming
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Walking <span className="block text-xs">Coming Soon</span>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Boarding <span className="block text-xs">Coming Soon</span>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Daycare <span className="block text-xs">Coming Soon</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={!file || !petName || loading}
          className="w-full rounded-full bg-paw-blue py-3 text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing with AI..." : "Get Price Estimate"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run: visit `http://localhost:3000/upload`
Expected: Upload form with photo drop zone, pet fields, service selector, and submit button

- [ ] **Step 3: Commit**

```bash
git add src/app/upload/page.tsx
git commit -m "feat: add upload page with photo + pet details form"
```

---

## Chunk 3: Pricing Result + Booking + Confirmation Pages

### Task 9: Pricing card component

**Files:**
- Create: `src/components/PricingCard.tsx`

- [ ] **Step 1: Create pricing display component**

```tsx
import { formatPrice } from "@/lib/api";
import type { PricingEstimate } from "@/lib/api";

interface PricingCardProps {
  estimate: PricingEstimate;
}

const SIZE_LABELS: Record<string, string> = {
  small: "Small (< 15 lbs)",
  medium: "Medium (15-40 lbs)",
  large: "Large (40-80 lbs)",
  xlarge: "X-Large (80+ lbs)",
};

const SIZE_COLORS: Record<string, string> = {
  small: "bg-green-100 text-green-800",
  medium: "bg-blue-100 text-blue-800",
  large: "bg-orange-100 text-orange-800",
  xlarge: "bg-red-100 text-red-800",
};

export default function PricingCard({ estimate }: PricingCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Price Estimate</h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${SIZE_COLORS[estimate.sizeCategory] || "bg-zinc-100 text-zinc-800"}`}
        >
          {SIZE_LABELS[estimate.sizeCategory] || estimate.sizeCategory}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Base grooming price</span>
          <span>{formatPrice(estimate.basePrice)}</span>
        </div>
        {estimate.adjustments.map((adj, i) => (
          <div key={i} className="flex justify-between text-sm text-zinc-600">
            <span>{adj.reason}</span>
            <span>+{formatPrice(adj.amount)}</span>
          </div>
        ))}
        <div className="border-t border-zinc-200 pt-2">
          <div className="flex justify-between text-lg font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(estimate.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-paw-gray p-4">
        <p className="text-sm font-medium text-zinc-700">AI Analysis</p>
        <p className="mt-1 text-sm text-zinc-600">{estimate.explanation}</p>
      </div>
    </div>
  );
}
```

### Task 10: Pricing result page

**Files:**
- Create: `src/app/pricing/[estimateId]/page.tsx`

- [ ] **Step 1: Create pricing page**

This page needs to retrieve the estimate data. In mock mode it uses hardcoded data. When the backend is ready, it will fetch from the API. For now we store the estimate in sessionStorage from the upload page and read it here.

First, update `src/app/upload/page.tsx` — add sessionStorage save before redirect. In the `handleSubmit` function, before the `router.push` line, add:

```typescript
sessionStorage.setItem(`estimate-${estimate.estimateId}`, JSON.stringify(estimate));
```

Then create the pricing page:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import type { PricingEstimate } from "@/lib/api";

export default function PricingPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.estimateId as string;
  const [estimate, setEstimate] = useState<PricingEstimate | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`estimate-${estimateId}`);
    if (stored) {
      setEstimate(JSON.parse(stored));
    } else {
      router.push("/upload");
    }
  }, [estimateId, router]);

  if (!estimate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading estimate...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Your Price Estimate</h1>
      <p className="mt-2 text-zinc-600">
        Here&apos;s what grooming will cost based on our AI analysis of your dog&apos;s photo.
      </p>

      <div className="mt-8">
        <PricingCard estimate={estimate} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href={`/booking/${estimateId}`}
          className="flex-1 rounded-full bg-paw-blue py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Book Now
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full border border-zinc-300 py-3 text-center text-lg font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Try Another Photo
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PricingCard.tsx src/app/pricing/\[estimateId\]/page.tsx src/app/upload/page.tsx
git commit -m "feat: add pricing result page with AI analysis display"
```

### Task 11: Slot picker component

**Files:**
- Create: `src/components/SlotPicker.tsx`

- [ ] **Step 1: Create slot picker**

```tsx
"use client";

import type { TimeSlot } from "@/lib/api";

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SlotPicker({ slots, selectedSlotId, onSelect }: SlotPickerProps) {
  // Group slots by date
  const grouped: Record<string, TimeSlot[]> = {};
  for (const slot of slots) {
    const date = formatDate(slot.startTime);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-500 uppercase">{date}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {dateSlots.map((slot) => (
              <button
                key={slot.slotId}
                onClick={() => onSelect(slot.slotId)}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  selectedSlotId === slot.slotId
                    ? "border-paw-blue bg-blue-50"
                    : "border-zinc-200 hover:border-paw-blue"
                }`}
              >
                <p className="font-semibold text-zinc-900">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>
                <p className="mt-1 text-sm text-zinc-500">with {slot.groomer}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Task 12: Booking page

**Files:**
- Create: `src/app/booking/[estimateId]/page.tsx`

- [ ] **Step 1: Create booking page**

```tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SlotPicker from "@/components/SlotPicker";
import { proposeAppointments, confirmAppointment } from "@/lib/api";
import type { TimeSlot } from "@/lib/api";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.estimateId as string;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const handleFindSlots = async () => {
    if (!customerName || !customerEmail || !customerPhone || !address || !preferredDate) return;
    setLoadingSlots(true);
    setError("");
    try {
      const result = await proposeAppointments({
        estimateId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        preferredDate,
      });
      setSlots(result.slots);
    } catch {
      setError("Failed to load available slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlotId || !petName) return;
    setConfirming(true);
    setError("");
    try {
      const confirmation = await confirmAppointment({
        slotId: selectedSlotId,
        estimateId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        petName,
        notes: notes || undefined,
      });
      sessionStorage.setItem(
        `confirmation-${confirmation.appointmentId}`,
        JSON.stringify(confirmation)
      );
      router.push(`/confirmation/${confirmation.appointmentId}`);
    } catch {
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Book Your Appointment</h1>
      <p className="mt-2 text-zinc-600">
        Fill in your details and pick a time that works for you.
      </p>

      <div className="mt-8 space-y-6">
        {/* Customer Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-800">Your Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              />
            </div>
            <div>
              <label htmlFor="petNameBooking" className="block text-sm font-medium text-zinc-700">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                id="petNameBooking"
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-zinc-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              placeholder="123 Main St, Salt Lake City, UT"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-700">
              Special Instructions <span className="text-zinc-400">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
              placeholder="e.g., Dog is anxious around strangers, gate code is 1234"
            />
          </div>
        </section>

        {/* Date + Slot Picker */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-800">Pick a Date</h2>
          <div className="flex gap-3">
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
            />
            <button
              onClick={handleFindSlots}
              disabled={!customerName || !customerEmail || !customerPhone || !address || !preferredDate || loadingSlots}
              className="rounded-lg bg-paw-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-paw-blue-dark disabled:opacity-50"
            >
              {loadingSlots ? "Finding slots..." : "Find Available Slots"}
            </button>
          </div>
        </section>

        {/* Slots */}
        {slots.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-800">Available Slots</h2>
            <SlotPicker
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />
          </section>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        {/* Confirm */}
        {selectedSlotId && (
          <button
            onClick={handleConfirm}
            disabled={confirming || !petName}
            className="w-full rounded-full bg-paw-green py-3 text-lg font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {confirming ? "Confirming..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SlotPicker.tsx src/app/booking/\[estimateId\]/page.tsx
git commit -m "feat: add booking page with slot picker and customer form"
```

### Task 13: Confirmation details component

**Files:**
- Create: `src/components/ConfirmationDetails.tsx`

- [ ] **Step 1: Create confirmation display**

```tsx
import { formatPrice } from "@/lib/api";
import type { AppointmentConfirmation } from "@/lib/api";

interface ConfirmationDetailsProps {
  confirmation: AppointmentConfirmation;
}

export default function ConfirmationDetails({ confirmation }: ConfirmationDetailsProps) {
  const date = new Date(confirmation.startTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const startTime = new Date(confirmation.startTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = new Date(confirmation.endTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="rounded-xl border border-zinc-200 p-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-zinc-900">Booking Confirmed!</h2>
        <p className="mt-2 text-lg font-mono font-bold text-paw-blue">
          {confirmation.confirmationNumber}
        </p>
      </div>

      <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Date</span>
          <span className="font-medium text-zinc-900">{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Time</span>
          <span className="font-medium text-zinc-900">
            {startTime} – {endTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Groomer</span>
          <span className="font-medium text-zinc-900">{confirmation.groomer}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-zinc-200 pt-3">
          <span className="text-zinc-500">Total</span>
          <span className="text-lg font-bold text-zinc-900">
            {formatPrice(confirmation.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Task 14: Confirmation page

**Files:**
- Create: `src/app/confirmation/[appointmentId]/page.tsx`

- [ ] **Step 1: Create confirmation page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmationDetails from "@/components/ConfirmationDetails";
import type { AppointmentConfirmation } from "@/lib/api";

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`confirmation-${appointmentId}`);
    if (stored) {
      setConfirmation(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [appointmentId, router]);

  if (!confirmation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading confirmation...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mt-4">
        <ConfirmationDetails confirmation={confirmation} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/coming-soon?agent=tracking"
          className="flex-1 rounded-full border border-paw-blue py-3 text-center font-semibold text-paw-blue transition-colors hover:bg-blue-50"
        >
          Track Appointment
        </Link>
        <Link
          href="/upload"
          className="flex-1 rounded-full bg-paw-blue py-3 text-center font-semibold text-white transition-colors hover:bg-paw-blue-dark"
        >
          Book Another
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConfirmationDetails.tsx src/app/confirmation/\[appointmentId\]/page.tsx
git commit -m "feat: add confirmation page with booking details"
```

### Task 15: Final verification and push

- [ ] **Step 1: Run build to check for errors**

Run: `cd /Users/jessicatalbert/Projects/pawdispatch_podium_2026 && npm run build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 2: Push to GitHub**

```bash
git push origin jess-frontend
```
