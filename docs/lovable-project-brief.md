# PawDispatch — Lovable Project Brief

**Purpose of this document:** Upload this to Lovable as a complete project brief. It contains the full codebase context, design system, every page, every component, all data shapes, and specific areas where visual polish is needed. Lovable should read all of this before making any changes.

---

## 1. Project Overview

PawDispatch is an AI-powered mobile pet grooming platform with two distinct interfaces:

**Customer-facing site** — A dark, premium-feeling booking funnel where a pet owner can:
1. Land on the homepage and understand the value prop
2. Upload a photo of their dog and fill in basic pet details
3. Receive an instant AI-generated price estimate (powered by Claude Vision)
4. Pick an available time slot with a groomer
5. Confirm a booking and receive a confirmation number

**Business dashboard** — An internal "Command Center" for the grooming business, organized as a sidebar-nav app with five views:
- **Overview** — KPI cards, agent activity feed, today's appointments
- **SDR Agent** — Lead pipeline table, funnel stats, recent agent actions
- **Scheduling & Dispatch** — Groomer cards with utilization bars, full appointment table
- **Analytics** — Revenue chart (CSS bar chart), top markets, groomer utilization
- **AI Marketing Agent** — SEO performance table, recent agent actions, Gemini-generated campaign ideas

The two interfaces are linked: the customer site has a small "HQ" pill button in the navbar that goes to `/dashboard`, and the dashboard sidebar has a "← Customer Site" link back to `/`.

---

## 2. Design Direction: Bold Premium Dark UI

The entire app uses a single cohesive dark design language. No light mode. Think: premium SaaS meets luxury consumer brand.

### Color Tokens (from `src/app/globals.css`)

```css
:root {
  --background:       #0f172a;   /* near-black navy — entire app background */
  --foreground:       #f1f5f9;   /* primary text — headings, key values */
  --paw-blue:         #2563eb;   /* CTA button base (gradient start) */
  --paw-blue-dark:    #1d4ed8;   /* hover state for blue */
  --paw-green:        #16a34a;   /* confirmation/success actions */
  --paw-orange:       #ea580c;   /* not currently used heavily */
  --paw-cyan:         #38bdf8;   /* gradient accent, logo, badges */
  --paw-indigo:       #818cf8;   /* gradient accent pair */
}
```

### Text Hierarchy

| Role | Color | Usage |
|------|-------|-------|
| Primary text | `#f1f5f9` | Headings, values, important labels |
| Secondary text | `#94a3b8` | Body copy, subtitles, descriptions |
| Muted text | `#64748b` | Helper text, timestamps, column headers |
| Off-white | `#e2e8f0` | Section headings within forms |
| Slate 300 | `#cbd5e1` | Ghost button text |

### Card Style (used everywhere)

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 16px; /* rounded-2xl */
```

Inner cards/nested cards use slightly more transparent:
```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.05);
```

Form inputs use:
```css
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.1);
color: #f1f5f9;
```

### Gradient Accents

**Cyan-to-indigo gradient** (logo, bar charts, selected slot ring):
```css
linear-gradient(135deg, #38bdf8, #818cf8)
```

**Tri-color logo gradient** (hero headline span):
```css
linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)
```

**CTA button gradient** (primary action button used site-wide):
```css
background: linear-gradient(135deg, #2563eb, #7c3aed);
box-shadow: 0 0 24px rgba(37,99,235,0.3);
border-radius: 9999px; /* rounded-full */
```

**Confirmation/success button** (green, flat):
```css
background: #16a34a;
border-radius: 9999px;
```

**Ghost/secondary button**:
```css
border: 1px solid rgba(255,255,255,0.15);
color: #cbd5e1;
border-radius: 9999px;
```

### Status Badge Colors (used in pipeline tables and appointment lists)

| Status | Color |
|--------|-------|
| Scheduled / Default | `#94a3b8` |
| In Transit | `#f59e0b` (amber) |
| Grooming / New lead | `#38bdf8` (cyan) |
| Completed / Booked | `#34d399` (emerald) |
| Cancelled / Lost | `#ef4444` (red) |
| Qualified / Indigo | `#818cf8` |

Badge pattern: `color` text, `color + "15"` background, `color + "30"` border, `rounded-full`.

### Logo Style

The brand name "🐾 PawDispatch" (and "🐾 PawDispatch HQ" inside dashboard) uses:
```css
background: linear-gradient(135deg, #38bdf8, #818cf8);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-weight: 800; /* extrabold */
```

### Typography

- Font: Geist Sans (Google Font) for body; Geist Mono for confirmation numbers
- Hero h1: `text-5xl font-extrabold` with `letter-spacing: -1.5px`
- Section headings: `text-2xl font-extrabold` or `text-2xl font-bold`
- Card/table section labels: `text-sm font-bold uppercase tracking-wider`
- Body copy: `text-lg` with `#94a3b8`
- Small labels: `text-xs font-semibold uppercase tracking-wider` in `#64748b`

### Hero Radial Glow

Behind the hero section, there is a decorative radial gradient orb:
```css
background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.05) 40%, transparent 70%);
width: 500px;
height: 500px;
border-radius: 50%;
position: absolute;
top: 0;
left: 50%;
transform: translateX(-50%);
pointer-events: none;
```

---

## 3. Tech Stack

- **Framework:** Next.js 15 (App Router, `src/` directory)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with `@import "tailwindcss"` syntax (NOT v3 — no `@tailwind base/components/utilities`)
- **Language:** TypeScript
- **Fonts:** Geist Sans + Geist Mono via `next/font/google`
- **State:** React `useState` / `useEffect` — no external state library
- **Routing:** Next.js App Router with dynamic segments `[estimateId]`, `[appointmentId]`
- **API Layer:** `src/lib/api.ts` — client-side fetch helpers with mock mode via `NEXT_PUBLIC_MOCK_API=true`
- **Dashboard Data:** `src/lib/dashboard-data.ts` — static mock data (no API calls for dashboard)
- **AI Backend (planned):** Anthropic Claude Vision API for photo analysis; `analyzeDogPhoto()` in `src/lib/ai/pricing-engine.ts`
- **Database (planned):** SQLite via Drizzle or Prisma

### Important Tailwind 4 Note
Tailwind CSS 4 uses `@import "tailwindcss"` in globals.css and `@theme inline { ... }` blocks for custom tokens. Do NOT use v3 `@tailwind` directives or `theme.extend` in `tailwind.config.js`. Custom tokens are declared inside `@theme inline { }` in `globals.css`.

---

## 4. Full Page Structure & Routes

```
/                                    → Landing page (homepage)
/upload                              → Photo upload + pet details form
/pricing/[estimateId]                → AI price estimate results
/booking/[estimateId]                → Customer info + slot picker
/confirmation/[appointmentId]        → Booking confirmation
/coming-soon?agent=tracking          → Placeholder for Live Tracking agent
/coming-soon?agent=sdr               → Placeholder for SDR Console (also live at /dashboard/sdr)
/coming-soon?agent=analytics         → Placeholder for Analytics (also live at /dashboard/analytics)
/coming-soon?agent=retention         → Placeholder for Retention & Surveys agent
/dashboard                           → Business dashboard overview (Command Center)
/dashboard/sdr                       → SDR Agent — lead pipeline
/dashboard/scheduling                → Scheduling & Dispatch
/dashboard/analytics                 → Analytics Dashboard
/dashboard/marketing                 → AI Marketing Agent
```

---

## 5. Pages — Full Code & Layout Details

### `src/app/layout.tsx` — Root Layout

Wraps every page. Renders `<Navbar />` above `<main>`. Dark background is set at the `body` level via `globals.css`.

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PawDispatch - Mobile Pet Grooming",
  description: "AI-powered mobile pet grooming at your doorstep",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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

**Note:** The dashboard has its own `layout.tsx` at `src/app/dashboard/layout.tsx` which overrides this with a sidebar layout. The root layout's `<Navbar />` still renders on dashboard pages — this creates a double-nav situation that should likely be fixed (the dashboard layout uses a full-screen flex layout with its own sidebar, so the top Navbar is redundant/clashing there).

---

### `src/app/page.tsx` — Landing Page (`/`)

**Layout:** Centered max-w-6xl container. Two sections:
1. **Hero** — radial glow orb, badge pill, h1 with gradient text span, subtitle, two CTA buttons
2. **Value Props** — 3-column grid of icon cards

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="py-16 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-100 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.05) 40%, transparent 70%)" }} />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6" style={{ border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8" }}>
            AI-POWERED GROOMING
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: "#f1f5f9", letterSpacing: "-1.5px" }}>
            Mobile Pet Grooming,
            <br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              At Your Door
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            Upload a photo of your dog, get an instant AI-powered price estimate,
            and book a professional groomer — all in minutes.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/upload"
              className="inline-block rounded-full px-8 py-3 text-lg font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
            >
              Get a Price Estimate →
            </Link>
            <Link
              href="/dashboard"
              className="inline-block rounded-full px-6 py-3 text-lg font-semibold transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}
            >
              Business Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid gap-4 py-16 md:grid-cols-3">
        {[
          { icon: "📱", title: "Convenience", desc: "We come to you. No car rides, no waiting rooms — grooming at your doorstep." },
          { icon: "🤖", title: "AI-Powered Pricing", desc: "Upload a photo and get a transparent, instant price estimate powered by AI vision." },
          { icon: "✂️", title: "Professional Groomers", desc: "Experienced, vetted groomers who love animals and deliver quality results." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="mb-4 mx-auto w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))" }}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold" style={{ color: "#f1f5f9" }}>{item.title}</h3>
            <p className="mt-2 text-sm" style={{ color: "#64748b" }}>{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

### `src/app/upload/page.tsx` — Upload Page (`/upload`)

**Layout:** `max-w-2xl` centered form. Three sections stacked vertically: Photo, Pet Details, Service type grid. Submit button at bottom.

**State:** `file`, `petName`, `breed`, `weight`, `loading`, `error` — all via `useState`.

**Logic:** On submit, builds `FormData`, calls `submitPricingEstimate()`, stores result in `sessionStorage`, redirects to `/pricing/[estimateId]`.

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
      sessionStorage.setItem(`estimate-${estimate.estimateId}`, JSON.stringify(estimate));
      router.push(`/pricing/${estimate.estimateId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Get a Price Estimate</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>
        Upload a photo of your dog and we'll use AI to give you an instant price estimate.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Photo</h2>
          <PhotoUpload onFileSelect={setFile} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Pet Details</h2>
          <PetDetailsForm
            petName={petName} breed={breed} weight={weight}
            onPetNameChange={setPetName} onBreedChange={setBreed} onWeightChange={setWeight}
          />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Service</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Active: Grooming */}
            <div className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ border: "2px solid #2563eb", background: "rgba(37,99,235,0.15)", color: "#38bdf8" }}>
              Grooming
            </div>
            {/* Disabled: Walking, Boarding, Daycare */}
            {["Walking", "Boarding", "Daycare"].map(svc => (
              <div key={svc} className="rounded-lg p-3 text-center text-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}>
                {svc} <span className="block text-xs">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
        {error && (
          <p className="rounded-lg p-3 text-sm" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}>{error}</p>
        )}
        <button type="submit" disabled={!file || !petName || loading}
          className="w-full rounded-full py-3 text-lg font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}>
          {loading ? "Analyzing with AI..." : "Get Price Estimate"}
        </button>
      </form>
    </div>
  );
}
```

---

### `src/app/pricing/[estimateId]/page.tsx` — Pricing Result

**Layout:** `max-w-2xl`. Heading + subtext. `<PricingCard>` component. Two buttons side-by-side: "Book Now" (primary CTA) and "Try Another Photo" (ghost).

**Logic:** Reads from `sessionStorage` on mount, redirects to `/upload` if not found.

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
    if (stored) setEstimate(JSON.parse(stored));
    else router.push("/upload");
  }, [estimateId, router]);

  if (!estimate) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p style={{ color: "#64748b" }}>Loading estimate...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Your Price Estimate</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>
        Here's what grooming will cost based on our AI analysis of your dog's photo.
      </p>
      <div className="mt-8">
        <PricingCard estimate={estimate} />
      </div>
      <div className="mt-8 flex gap-4">
        <Link href={`/booking/${estimateId}`}
          className="flex-1 rounded-full py-3 text-center text-lg font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}>
          Book Now
        </Link>
        <Link href="/upload"
          className="flex-1 rounded-full py-3 text-center text-lg font-semibold transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}>
          Try Another Photo
        </Link>
      </div>
    </div>
  );
}
```

---

### `src/app/booking/[estimateId]/page.tsx` — Booking Page

**Layout:** `max-w-2xl`. Three sections: (1) Customer info form (name, email, phone, pet name, address, notes), (2) Date picker + "Find Available Slots" button, (3) `<SlotPicker>` grid (only appears after slots are fetched). Confirm booking button appears after a slot is selected.

**Logic:**
- "Find Available Slots" calls `proposeAppointments()`
- "Confirm Booking" calls `confirmAppointment()`, stores result in `sessionStorage`, redirects to `/confirmation/[appointmentId]`

```tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SlotPicker from "@/components/SlotPicker";
import { proposeAppointments, confirmAppointment } from "@/lib/api";
import type { TimeSlot } from "@/lib/api";

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
};

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
      const result = await proposeAppointments({ estimateId, customerName, customerEmail, customerPhone, address, preferredDate });
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
      const confirmation = await confirmAppointment({ slotId: selectedSlotId, estimateId, customerName, customerEmail, customerPhone, address, petName, notes: notes || undefined });
      sessionStorage.setItem(`confirmation-${confirmation.appointmentId}`, JSON.stringify(confirmation));
      router.push(`/confirmation/${confirmation.appointmentId}`);
    } catch {
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Book Your Appointment</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>Fill in your details and pick a time that works for you.</p>
      <div className="mt-8 space-y-6">
        {/* Customer Info — 2-col grid for name/email/phone/pet, full-width address + notes */}
        {/* Date Picker + Find Slots button */}
        {/* SlotPicker (conditional on slots.length > 0) */}
        {/* Confirm button (conditional on selectedSlotId) — green #16a34a */}
      </div>
    </div>
  );
}
```

---

### `src/app/confirmation/[appointmentId]/page.tsx` — Confirmation Page

**Layout:** `max-w-2xl`. The `<ConfirmationDetails>` component is the main content. Two buttons: "Track Appointment" (ghost, → coming-soon) and "Book Another" (primary CTA → /upload).

**Logic:** Reads from `sessionStorage`, redirects to `/` if not found.

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
    if (stored) setConfirmation(JSON.parse(stored));
    else router.push("/");
  }, [appointmentId, router]);

  if (!confirmation) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p style={{ color: "#64748b" }}>Loading confirmation...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mt-4">
        <ConfirmationDetails confirmation={confirmation} />
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/coming-soon?agent=tracking"
          className="flex-1 rounded-full py-3 text-center font-semibold transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1" }}>
          Track Appointment
        </Link>
        <Link href="/upload"
          className="flex-1 rounded-full py-3 text-center font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}>
          Book Another
        </Link>
      </div>
    </div>
  );
}
```

---

### `src/app/coming-soon/page.tsx` — Coming Soon Placeholder

**Layout:** Full-height centered column. Emoji, title, description, "Back to Home" button. Dynamic based on `?agent=` query param.

```tsx
import Link from "next/link";

const AGENT_NAMES: Record<string, string> = {
  tracking: "Live Tracking",
  sdr: "SDR Console",
  analytics: "Analytics Dashboard",
  retention: "Retention & Surveys",
  marketing: "AI Marketing",
};

export default async function ComingSoon({ searchParams }: { searchParams: Promise<{ agent?: string }> }) {
  const { agent } = await searchParams;
  const agentName = agent ? AGENT_NAMES[agent] || agent : "This Feature";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>{agentName}</h1>
      <p className="mt-4 max-w-md text-lg" style={{ color: "#94a3b8" }}>
        This agent is coming soon! We're building autonomous AI agents to handle
        every part of your pet grooming business.
      </p>
      <Link href="/"
        className="mt-8 rounded-full px-6 py-2.5 font-semibold text-white transition-all"
        style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}>
        Back to Home
      </Link>
    </div>
  );
}
```

---

### `src/app/dashboard/layout.tsx` — Dashboard Layout

**Layout:** Full-screen flex row. Left sidebar (`w-56`, fixed width) with logo, nav links, footer link. Right main content area (`flex-1`, `p-6`, `overflow-auto`).

```tsx
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/sdr", label: "SDR Agent", icon: "🎯" },
  { href: "/dashboard/scheduling", label: "Scheduling", icon: "📅" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/marketing", label: "Marketing", icon: "📣" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#0f172a" }}>
      <aside className="w-56 border-r flex-shrink-0 flex flex-col" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/dashboard" className="text-lg font-extrabold"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🐾 PawDispatch HQ
          </Link>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>Business Dashboard</p>
        </div>
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "#94a3b8" }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/" className="text-xs font-medium hover:underline" style={{ color: "#64748b" }}>
            ← Customer Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
```

---

### `src/app/dashboard/page.tsx` — Command Center Overview

**Layout:** Header text → 4-column KPI grid → 2-column grid (Agent Activity Feed | Today's Appointments).

**Data source:** `KPIS`, `AGENT_ACTIVITIES`, `APPOINTMENTS` from `dashboard-data.ts`.

**KPI cards:** 4 cards with large `text-3xl` value and green delta text.

**Agent Activity Feed:** List of agent actions with colored agent-name badges (each agent has a distinct color).

**Today's Appointments:** List of appointment rows with status pills.

```tsx
import { KPIS, AGENT_ACTIVITIES, APPOINTMENTS } from "@/lib/dashboard-data";

const STATUS_COLORS = {
  scheduled: "#94a3b8", in_transit: "#f59e0b",
  grooming: "#38bdf8", completed: "#34d399", cancelled: "#ef4444",
};
const STATUS_LABELS = {
  scheduled: "Scheduled", in_transit: "In Transit",
  grooming: "Grooming", completed: "Done", cancelled: "Cancelled",
};

export default function DashboardOverview() {
  const todayAppointments = APPOINTMENTS.filter((a) => a.date === "Today");
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9" }}>Command Center</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>All agents running autonomously. Real-time overview.</p>
      </div>
      {/* 4-col KPI grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{kpi.label}</p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: "#f1f5f9" }}>{kpi.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: "#34d399" }}>{kpi.change} vs last week</p>
          </div>
        ))}
      </div>
      {/* 2-col: activity feed + appointments */}
      {/* ... */}
    </div>
  );
}
```

**Mock KPI data:**
- New Leads Today: 24 (+18%)
- Revenue Today: $3,240 (+12%)
- Appointments: 18 (+6)
- Satisfaction: 98% (+2%)

---

### `src/app/dashboard/sdr/page.tsx` — SDR Agent

**Layout:** Header → 4-column funnel stat cards (New/Contacted/Qualified/Booked) → flex row: lead pipeline table (flex-1) + recent agent actions panel (w-72).

**Funnel counts:** Derived from `LEADS` array, filtered by status.

**Lead pipeline table columns:** Name, Pet (Breed), Location, Source, Status (colored pill), Time.

**Recent agent actions panel:** Bulleted list of 6 recent actions with timestamps.

```
Current lead data (8 leads):
- Sarah Mitchell → Cooper (Goldendoodle, South Jordan) — new, Website, 2 min ago
- Tom Robinson → Baxter (Bernedoodle, Lehi) — contacted, Nextdoor, 1 hr ago
- Emily Chen → Mochi (French Bulldog, Sugar House) — qualified, Google, 2 hrs ago
- David Larsen → Duke (Golden Retriever, Draper) — booked, Referral, 3 hrs ago
- Maria Garcia → Bella (Shih Tzu, Eagle Mountain) — booked, Facebook, 4 hrs ago
- Ryan Patel → Zeus (German Shepherd, Highland) — new, Website, 5 hrs ago
- Amanda Foster → Daisy (Corgi, Millcreek) — lost, Instagram, 1 day ago
- Jake Thompson → Rocky (Labrador, Saratoga Springs) — qualified, Google, 1 day ago
```

---

### `src/app/dashboard/scheduling/page.tsx` — Scheduling & Dispatch

**Layout:** Header → 4-col stat row (Total/Completed/In Progress/Revenue) → 3-col groomer cards → full appointment table.

**Groomer cards:** Name, current status text, utilization percentage, CSS progress bar (gradient cyan-to-indigo).

**Appointment table columns:** Time, Date, Customer, Pet (Breed), Groomer, Location, Status, Price.

**Current groomer data:**
- Alex Rivera — 85% utilization, 6 appointments, "Currently grooming Cooper"
- Jordan Lee — 71% utilization, 5 appointments, "Completed — en route to next"
- Casey Martinez — 71% utilization, 5 appointments, "In transit to Draper"

---

### `src/app/dashboard/analytics/page.tsx` — Analytics Dashboard

**Layout:** Header → 4-col customer metrics row → Weekly Revenue CSS bar chart → 2-col grid (Top Markets table | Groomer Utilization cards).

**Revenue chart:** CSS div bars with height proportional to revenue, gradient fill `#38bdf8 → #818cf8`. No charting library — pure CSS/div elements. This is a known area for improvement.

**Top Markets table:** Area, Bookings count, Revenue, CSS progress bar per row.

**Groomer Utilization:** Cards for each groomer with CSS progress bar (green `#34d399`).

**Customer metrics:**
- Total Customers: 187
- Repeat Rate: 34%
- Avg Lifetime Value: $420
- Churn Rate: 8%

**Weekly revenue data (Mon-Sun):** $2.8k, $3.2k, $2.95k, $3.6k, $4.1k, $5.2k, $1.8k

---

### `src/app/dashboard/marketing/page.tsx` — AI Marketing Agent

**Layout:** Header (with "Powered by Google Gemini" badge) → 4-col website metrics → 2-col grid (SEO Performance table | Recent Agent Actions) → Campaign Ideas 3-col grid.

**SEO Performance table columns:** Keyword, Rank (#N), Change (▲/▼ colored), Traffic.

**Campaign Ideas:** 3 cards — each has name, status pill (Proposed/Active/Draft), segment, channel.

**Website metrics:**
- Visitors Today: 482
- Conversion Rate: 4.8%
- Top Landing Page: /upload (Get Estimate)
- Bounce Rate: 32%

---

## 6. Component Inventory

### `src/components/Navbar.tsx`

**Purpose:** Top navigation bar rendered on all customer-facing pages (not on dashboard where the sidebar replaces it — though currently it does render on dashboard pages due to root layout).

**Props:** None (no props — static server component).

**Layout:** `max-w-6xl` container, flex row between logo and nav links.

**Elements:**
- Logo: "🐾 PawDispatch" with cyan-to-indigo gradient text
- Nav links: "Get Estimate", "Track Appointment" (muted, coming-soon), "SDR Console" (muted, coming-soon), "Analytics" (muted, coming-soon), "Retention" (muted, coming-soon)
- "HQ" pill button with gradient background (dark text `#0f172a` on gradient)

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold"
          style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🐾 PawDispatch
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: "#94a3b8" }}>
          <Link href="/upload" className="transition-colors hover:text-white">Get Estimate</Link>
          <Link href="/coming-soon?agent=tracking" style={{ color: "#64748b" }}>Track Appointment</Link>
          <Link href="/coming-soon?agent=sdr" style={{ color: "#64748b" }}>SDR Console</Link>
          <Link href="/coming-soon?agent=analytics" style={{ color: "#64748b" }}>Analytics</Link>
          <Link href="/coming-soon?agent=retention" style={{ color: "#64748b" }}>Retention</Link>
          <Link href="/dashboard"
            className="ml-2 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a" }}>
            HQ
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

---

### `src/components/PhotoUpload.tsx`

**Purpose:** Drag-and-drop (or click-to-browse) image uploader. Shows preview image after upload.

**Props:**
```typescript
interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
}
```

**State:** `preview: string | null`, `dragOver: boolean`

**Layout:** `min-h-[300px]` dashed-border box. When dragging over: border turns cyan, slight cyan background. When file selected: shows `next/image` fill preview. When empty: camera emoji, text prompt.

```tsx
"use client";
import { useCallback, useState } from "react";
import Image from "next/image";

export default function PhotoUpload({ onFileSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      className="relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
      style={
        dragOver ? { borderColor: "#38bdf8", background: "rgba(56,189,248,0.06)" }
        : preview ? { borderColor: "rgba(255,255,255,0.15)", background: "transparent" }
        : { borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }
      }
      onClick={() => document.getElementById("photo-input")?.click()}
    >
      {preview ? (
        <Image src={preview} alt="Dog photo preview" fill className="rounded-xl object-cover" />
      ) : (
        <>
          <div className="text-5xl mb-4">📷</div>
          <p className="text-lg font-medium" style={{ color: "#94a3b8" }}>Drop a photo of your dog here</p>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>or click to browse</p>
        </>
      )}
      <input id="photo-input" type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
```

---

### `src/components/PetDetailsForm.tsx`

**Purpose:** Three controlled text inputs: Pet Name (required), Breed (optional), Weight in lbs (optional).

**Props:**
```typescript
interface PetDetailsFormProps {
  petName: string;
  breed: string;
  weight: string;
  onPetNameChange: (v: string) => void;
  onBreedChange: (v: string) => void;
  onWeightChange: (v: string) => void;
}
```

**Layout:** Vertical stack of 3 labeled inputs. Each uses the semi-transparent dark input style.

---

### `src/components/PricingCard.tsx`

**Purpose:** Displays the AI pricing estimate result: size badge, itemized price breakdown, AI explanation.

**Props:**
```typescript
interface PricingCardProps {
  estimate: PricingEstimate;
}
// Where PricingEstimate:
interface PricingEstimate {
  estimateId: string;
  basePrice: number;           // cents
  adjustments: Array<{ reason: string; amount: number }>;
  totalPrice: number;          // cents
  sizeCategory: "small" | "medium" | "large" | "xlarge";
  explanation: string;
  imageUrl: string;
}
```

**Layout:** Card container with: header row (title + size badge), itemized list (base price + each adjustment), divider, total price row, AI explanation box.

**Size badge colors:**
- small → green (`#4ade80` on `rgba(22,163,74,0.2)`)
- medium → blue (`#60a5fa` on `rgba(37,99,235,0.2)`)
- large → orange (`#fb923c` on `rgba(234,88,12,0.2)`)
- xlarge → red (`#f87171` on `rgba(220,38,38,0.2)`)

**AI explanation box:** Inner card with `#38bdf8` "AI Analysis" label and `#94a3b8` explanation text.

---

### `src/components/SlotPicker.tsx`

**Purpose:** Displays available time slots grouped by date. Click a slot to select it.

**Props:**
```typescript
interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
}
// Where TimeSlot:
interface TimeSlot {
  slotId: string;
  startTime: string;  // ISO datetime
  endTime: string;    // ISO datetime
  groomer: string;
}
```

**Layout:** Groups slots by date. Each date has a header label + 2-column grid of slot cards.

**Selected slot style:** `border: "2px solid #38bdf8"`, `background: "rgba(37,99,235,0.15)"`, `boxShadow: "0 0 12px rgba(56,189,248,0.2)"`.

**Unselected slot style:** Standard card (`rgba(255,255,255,0.04)` bg, `rgba(255,255,255,0.08)` border).

---

### `src/components/ConfirmationDetails.tsx`

**Purpose:** Success confirmation card showing booking summary.

**Props:**
```typescript
interface ConfirmationDetailsProps {
  confirmation: AppointmentConfirmation;
}
// Where AppointmentConfirmation:
interface AppointmentConfirmation {
  appointmentId: string;
  status: "confirmed";
  startTime: string;
  endTime: string;
  groomer: string;
  totalPrice: number;    // cents
  confirmationNumber: string;  // e.g., "PAW-2026-0042"
}
```

**Layout:** Card with centered checkmark emoji, "Booking Confirmed!" heading, large monospace confirmation number in cyan. Divider. Row-by-row details: Date, Time, Groomer, Total.

---

## 7. Data Layer

### `src/lib/api.ts` — API Client

Mock mode controlled by `NEXT_PUBLIC_MOCK_API=true`. Exports:

```typescript
// Types
interface PricingEstimate { estimateId, basePrice, adjustments, totalPrice, sizeCategory, explanation, imageUrl }
interface TimeSlot { slotId, startTime, endTime, groomer }
interface AppointmentConfirmation { appointmentId, status, startTime, endTime, groomer, totalPrice, confirmationNumber }

// Functions
async function submitPricingEstimate(formData: FormData): Promise<PricingEstimate>
async function proposeAppointments(data: { estimateId, customerName, customerEmail, customerPhone, address, preferredDate }): Promise<{ slots: TimeSlot[] }>
async function confirmAppointment(data: { slotId, estimateId, customerName, customerEmail, customerPhone, address, petName, notes? }): Promise<AppointmentConfirmation>
function formatPrice(cents: number): string   // "$75.00"
```

**Mock data (NEXT_PUBLIC_MOCK_API=true):**
- Estimate: Large Golden Retriever, $55 base + $15 long coat + $5 large adjustment = $75 total
- Slots: 4 slots across March 15-16 with Alex Rivera, Jordan Lee, Casey Martinez
- Confirmation: PAW-2026-0042, March 15 9-10 AM, Alex Rivera, $75

### `src/lib/dashboard-data.ts` — Dashboard Static Data

All dashboard data is static mock data — no API calls. Exports:
- `KPIS: KPICard[]` — 4 KPI cards
- `AGENT_ACTIVITIES: AgentActivity[]` — 10 recent agent log entries
- `LEADS: Lead[]` — 8 leads in various funnel stages
- `APPOINTMENTS: Appointment[]` — 8 appointments (5 today, 3 tomorrow)
- `REVENUE_DATA` — weekly revenue (7 days), top markets (5 areas), groomer utilization (3 groomers), customer metrics
- `MARKETING_DATA` — SEO performance (5 keywords), recent actions (6 items), campaign ideas (3), website metrics

---

## 8. Customer Segments & Design Implications

From the marketing research reflected in the dashboard data, PawDispatch targets four distinct customer segments:

### Segment 1: Busy Families
- Parents with dogs who can't easily take pets to a groomer
- Value: convenience, reliability, "we come to you"
- Design implication: Clear CTAs, minimal friction in the booking flow, reassurance at every step
- Campaign: "Spring Shed Season" (Email + Social)

### Segment 2: Senior Pet Parents
- Older adults whose dogs are their primary companions; often have anxious dogs
- Value: trust, professional handling, gentle care
- Design implication: Trustworthy, calm aesthetic; anxiety/special handling as a visible feature
- Campaign: "Anxious Dog Awareness" (Blog + SEO)

### Segment 3: Premium/Affluent Dog Owners
- Owners who already spend heavily on their pets and want white-glove service
- Value: quality, exclusivity, AI-powered = cutting-edge
- Design implication: The bold premium dark UI is appropriate here; price is secondary
- Present in: Goldendoodle, Bernedoodle, French Bulldog owners in the lead data

### Segment 4: Tech-Forward Early Adopters
- Millennials/Gen Z who love the AI angle and the convenience of an app-like booking flow
- Value: the AI photo analysis feature, instant pricing, modern UX
- Design implication: AI-POWERED badge, gradient text, the photo upload flow itself is a differentiator — make it feel magical
- Campaign: "First Groom Free Referral" (Word of mouth)

---

## 9. What Needs Visual Polish (Specific Requests for Lovable)

These are the areas where the current implementation is functional but visually rough. Lovable should prioritize these:

### 9.1 Photo Drop Zone (`PhotoUpload.tsx`)

**Current state:** A plain dashed-border rectangle with a camera emoji and two lines of text. Minimal visual interest. When dragging over, border turns cyan — that's the extent of the interaction feedback.

**What would make it better:**
- More dramatic drag-over state: animated dashed border (dash-offset animation), stronger glow effect
- When empty: a more compelling illustration or icon setup — perhaps a stylized dog silhouette or a camera icon with a gradient treatment, not just a plain emoji
- Add a "or paste image" hint text
- When preview is showing: overlay controls (a small "x" to remove, a "change photo" button) — currently there's no way to remove a selected photo without refreshing
- A subtle pulsing/breathing animation on the empty state to draw attention

### 9.2 Value Prop Cards (Landing Page)

**Current state:** Three cards in a grid with an emoji in a gradient box, a title, and a short description. Functional but flat.

**What would make them better:**
- More visual differentiation between cards — hover states with subtle lift/glow
- The icon treatment could be more refined: custom SVG icons instead of emojis, or at minimum a larger more prominent icon area
- Consider a subtle border glow on hover that matches the card's conceptual color (cyan for AI, green for professional, blue for convenience)
- Add a subtle "→" or arrow indicator on hover to signal they might be interactive

### 9.3 Navbar (`Navbar.tsx`)

**Current state:** Single-line flex bar. Active/current page is not visually indicated. "Coming soon" links are slightly dimmer but not clearly disabled. The "HQ" pill is the only visual punctuation.

**What would make it better:**
- Active page indicator (underline, dot, or background highlight on the current route)
- "Coming soon" links should have a clear visual treatment — a tiny lock icon or "soon" badge instead of just being dimmer
- Consider adding a thin gradient line at the bottom of the navbar instead of a flat border
- The spacing between nav items could breathe more at larger viewports
- On mobile: hamburger menu or a collapsed treatment (currently overflows on small screens)

### 9.4 Dashboard Analytics Charts

**Current state:** The weekly revenue chart is hand-built CSS `div` elements with heights calculated as proportional pixels. It works but it's crude — no tooltips, no hover states, no Y-axis labels, no gridlines.

**What would make it better:**
- Replace the CSS bar chart with a proper chart (Recharts or Chart.js or Victory — all work in Next.js App Router)
- Add tooltips on hover showing the exact revenue value
- Add a thin horizontal gridline system
- For the top markets bars, the same applies — consider a horizontal bar chart with labels
- The groomer utilization could be animated (bars that fill in on mount with a transition)
- A line chart for the revenue trend would be more readable than bars

### 9.5 Mobile Responsiveness

**Current state:** The customer flow (upload → pricing → booking → confirmation) is reasonably mobile-friendly due to `max-w-2xl` constraints and responsive grid classes. The dashboard is NOT mobile-friendly — it uses hard-coded `grid-cols-4` and fixed sidebar widths.

**What would make it better:**
- Customer site: The booking form's 2-column grid should collapse to 1 column on mobile (already using `sm:grid-cols-2` but verify)
- The navbar should collapse to a hamburger on mobile
- Dashboard: Not a priority for mobile (internal tool), but at minimum should not completely break at tablet widths

### 9.6 Page Transitions & Loading States

**Current state:** Hard cuts between pages. Loading states are just plain text ("Loading estimate...", "Analyzing with AI..."). The submit button changes text when loading but has no animation.

**What would make it better:**
- The "Analyzing with AI..." state on the upload submit button deserves a visual treatment — a spinning icon, a progress indication, or a brief animated message since the mock adds a 1500ms delay
- Loading skeletons instead of blank pages while estimate/confirmation data loads from sessionStorage
- A subtle fade-in on page mount
- The slot cards appearing after clicking "Find Available Slots" could animate in (staggered fade-up)

### 9.7 Confirmation Page

**Current state:** The confirmation card uses a green checkmark emoji (✅) centered at the top. Functional but not celebratory enough for a booking confirmation.

**What would make it better:**
- A confetti burst or celebratory animation on mount
- The confirmation number deserves more visual prominence — maybe a distinct card treatment with a gradient border or a "copy to clipboard" button
- The success state should feel more emotionally satisfying

### 9.8 Dashboard Sidebar Active State

**Current state:** All sidebar nav links are the same color (`#94a3b8`). There's no visual indicator of which page is currently active.

**What would make it better:**
- Use Next.js `usePathname()` to detect active route
- Active item: white text + subtle `rgba(255,255,255,0.08)` background + left accent bar (2px cyan gradient)
- This is a common SaaS dashboard pattern and its absence is very noticeable

### 9.9 Hero Section (Landing Page)

**Current state:** The hero is clean and well-structured but could have more visual energy.

**What would make it better:**
- The radial glow orb is very subtle (8% opacity at center). Making it slightly more visible would add depth
- The "AI-POWERED GROOMING" badge could pulse gently on load
- Consider a subtle animated gradient border on the primary CTA button on hover
- A secondary decorative element (abstract dog silhouette, paw print pattern in the background at very low opacity)

---

## 10. API Contracts Summary

### Customer Flow APIs (connect frontend → backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/pricing/estimate` | POST | Submit photo + pet details, receive AI price estimate |
| `/api/pricing/estimate/[estimateId]` | GET | Retrieve estimate by ID (for page refresh persistence) |
| `/api/appointments/propose` | POST | Get available time slots for a date |
| `/api/appointments/confirm` | POST | Confirm booking, create customer/pet/appointment records |
| `/api/appointments/[appointmentId]` | GET | Retrieve appointment by ID |

### POST `/api/pricing/estimate` — Request/Response

```typescript
// Request (multipart/form-data)
{ image: File, petName: string, breed?: string, weight?: number, serviceType: "grooming" }

// Response
{
  estimateId: string,
  basePrice: number,          // cents
  adjustments: Array<{ reason: string, amount: number }>,
  totalPrice: number,         // cents
  sizeCategory: "small" | "medium" | "large" | "xlarge",
  explanation: string,
  imageUrl: string
}
```

### POST `/api/appointments/propose` — Request/Response

```typescript
// Request
{ estimateId, customerName, customerEmail, customerPhone, address, preferredDate: "2026-03-15" }

// Response
{ slots: Array<{ slotId, startTime, endTime, groomer }> }
```

### POST `/api/appointments/confirm` — Request/Response

```typescript
// Request
{ slotId, estimateId, customerName, customerEmail, customerPhone, address, petName, notes? }

// Response
{ appointmentId, status: "confirmed", startTime, endTime, groomer, totalPrice, confirmationNumber }
// Confirmation number format: "PD-2026-001234"
```

---

## 11. Database Schema (for backend context)

Five tables: `customers`, `pets`, `pricing_estimates`, `groomers`, `appointments`.

Key design decision: Customer and pet records are created only at booking confirmation time — NOT during the pricing estimate step. This avoids orphaned records from users who abandon after getting a price.

The `pricing_estimates.pet_id` is nullable initially and gets linked to a pet at confirmation.

Appointment status values: `confirmed`, `completed`, `cancelled`.

Confirmation number format: `PD-YYYY-XXXXXX` (e.g., `PD-2026-001234`).

---

## 12. File Structure

```
pawdispatch_podium_2026/
├── src/
│   ├── app/
│   │   ├── globals.css              ← Tailwind 4 import + CSS custom properties
│   │   ├── layout.tsx               ← Root layout: Navbar + main
│   │   ├── page.tsx                 ← Landing page (/)
│   │   ├── upload/
│   │   │   └── page.tsx             ← Photo upload + pet details (/upload)
│   │   ├── pricing/[estimateId]/
│   │   │   └── page.tsx             ← Price estimate result
│   │   ├── booking/[estimateId]/
│   │   │   └── page.tsx             ← Booking form + slot picker
│   │   ├── confirmation/[appointmentId]/
│   │   │   └── page.tsx             ← Booking confirmation
│   │   ├── coming-soon/
│   │   │   └── page.tsx             ← Coming soon placeholder
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           ← Dashboard shell: sidebar + main
│   │   │   ├── page.tsx             ← Command Center overview
│   │   │   ├── sdr/
│   │   │   │   └── page.tsx         ← SDR Agent lead pipeline
│   │   │   ├── scheduling/
│   │   │   │   └── page.tsx         ← Scheduling & Dispatch
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx         ← Analytics Dashboard
│   │   │   └── marketing/
│   │   │       └── page.tsx         ← AI Marketing Agent
│   │   └── api/                     ← (planned) Backend API routes
│   │       ├── pricing/estimate/route.ts
│   │       ├── appointments/propose/route.ts
│   │       └── appointments/confirm/route.ts
│   ├── components/
│   │   ├── Navbar.tsx               ← Top navigation (customer site)
│   │   ├── PhotoUpload.tsx          ← Drag-and-drop photo uploader
│   │   ├── PetDetailsForm.tsx       ← Pet name/breed/weight form
│   │   ├── PricingCard.tsx          ← AI estimate display card
│   │   ├── SlotPicker.tsx           ← Available time slot grid
│   │   └── ConfirmationDetails.tsx  ← Booking confirmed card
│   └── lib/
│       ├── api.ts                   ← Client API helpers + mock data
│       └── dashboard-data.ts        ← Static mock data for dashboard
├── docs/
│   └── superpowers/specs/
│       └── 2026-03-14-lead-to-booking-spec.md
└── public/
    └── uploads/                     ← (planned) Stored dog photos
```

---

## 13. Known Issues & Technical Notes

1. **Dashboard layout clash:** The root `layout.tsx` renders `<Navbar />` globally, but `src/app/dashboard/layout.tsx` creates its own full-screen layout with a sidebar. This means dashboard pages have BOTH the top navbar AND the sidebar, which looks wrong. The dashboard layout should conditionally suppress the top navbar, or the root layout should not render `<Navbar />` on dashboard routes.

2. **No active route highlighting:** Neither the top `<Navbar />` nor the dashboard sidebar uses `usePathname()` to highlight the current route. Both components are currently server components (no `"use client"`) so they can't call hooks — they'd need to be converted to client components or use a separate client wrapper to add active state.

3. **sessionStorage dependency:** The pricing and confirmation pages depend entirely on sessionStorage to pass data between pages. If a user refreshes the page, they get redirected. The GET API endpoints exist in the spec to handle this case but are not yet implemented.

4. **Service type selector is non-functional:** The 4-service grid on the upload page (Grooming, Walking, Boarding, Daycare) is static markup — Grooming is visually selected but there's no click handler to switch selection. This is intentional for the demo (only grooming is available) but the UI suggests interactivity that isn't there.

5. **No form validation feedback:** The booking form has `required` attributes but no inline validation messages or field-level error states. Errors only appear at the API call level.

6. **Price display bug:** `formatPrice(cents)` always returns 2 decimal places (e.g., "$75.00") but the dashboard's `formatCents()` function strips `.00` — these are inconsistent implementations of the same thing.
