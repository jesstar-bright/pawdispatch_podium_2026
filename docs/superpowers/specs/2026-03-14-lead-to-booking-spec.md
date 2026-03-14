# PawDispatch: Lead-to-Booking Flow Spec

**Date:** 2026-03-14
**Deadline:** 4:00 PM MST, 2026-03-14
**Team:** Jess (Frontend/UI), Spencer Guo (Backend/API + Data), Sam Packham (LLM/AI Stack)

## Overview

Build the end-to-end Lead-to-Booking flow for PawDispatch, a mobile pet grooming business. A customer lands on the site, uploads a dog photo, gets an AI-generated price estimate via Claude Vision, picks a time slot, and confirms a booking. Judges will upload real data during the demo — this must work end-to-end.

## Scope

### In Scope (Must Ship by 4 PM)
- Landing page with clear CTA
- Dog photo upload with pet details form
- AI-powered pricing via Claude Vision (real, not mocked)
- Time slot selection from available appointments
- Booking confirmation with confirmation number
- Real database (all data persisted)
- Seed/mock data for groomers and time slots

### Out of Scope (Dead-End Buttons Only)
- Live Tracking agent — show button, links to "Coming Soon" page
- Retention/Survey agent — show button, links to "Coming Soon" page
- SDR Console — show nav item, links to "Coming Soon" page
- Analytics Dashboard — show nav item, links to "Coming Soon" page
- AI Marketing agent — not shown in UI
- Payment processing
- Email/SMS notifications
- Authentication/login

## Architecture: Vertical Slices (Approach 1)

Each person owns a horizontal layer. No file overlap, no merge conflicts.

```
┌─────────────────────────────────────────────────┐
│  JESS — Frontend (src/app/, src/components/)    │
│  Pages: Landing → Upload → Pricing → Slots →   │
│  Confirm + Dead-end nav for other agents        │
├─────────────────────────────────────────────────┤
│  SPENCER — Backend (src/app/api/, src/lib/db/)  │
│  API routes, DB schema, seed data, CRUD         │
├─────────────────────────────────────────────────┤
│  SAM — AI Stack (src/lib/ai/)                   │
│  Claude Vision integration, pricing engine,     │
│  structured JSON output, prompt engineering     │
└─────────────────────────────────────────────────┘
```

**Integration rule:** Sam's pricing engine is a standalone module. Spencer imports it into his API route. Jess calls Spencer's API routes. Everyone codes against the API contracts below.

## Directory Ownership

```
src/
├── app/
│   ├── page.tsx                    # Jess — Landing page
│   ├── layout.tsx                  # Jess — Root layout + nav
│   ├── upload/page.tsx             # Jess — Photo upload + pet details
│   ├── pricing/[estimateId]/page.tsx  # Jess — Pricing result display
│   ├── booking/[estimateId]/page.tsx  # Jess — Slot picker
│   ├── confirmation/[appointmentId]/page.tsx  # Jess — Booking confirmation
│   ├── coming-soon/page.tsx        # Jess — Dead-end page for future agents
│   └── api/
│       ├── pricing/
│       │   └── estimate/route.ts   # Spencer — Pricing API (calls Sam's module)
│       ├── appointments/
│       │   ├── propose/route.ts    # Spencer — Propose time slots
│       │   └── confirm/route.ts    # Spencer — Confirm booking
│       └── seed/route.ts           # Spencer — Seed data endpoint (dev only)
├── components/                     # Jess — All UI components
│   ├── Navbar.tsx
│   ├── PhotoUpload.tsx
│   ├── PetDetailsForm.tsx
│   ├── PricingCard.tsx
│   ├── SlotPicker.tsx
│   └── ConfirmationDetails.tsx
├── lib/
│   ├── db/                         # Spencer — Database layer
│   │   ├── schema.ts               # Drizzle/Prisma schema
│   │   ├── seed.ts                 # Seed data (groomers, sample slots)
│   │   └── index.ts                # DB client export
│   └── ai/                         # Sam — AI/LLM layer
│       ├── vision.ts               # Claude Vision API call
│       ├── pricing-engine.ts       # Price calculation from AI output
│       └── prompts.ts              # System prompts for Claude
```

## API Contracts

These are the exact request/response shapes. All three workstreams code against these.

### POST /api/pricing/estimate

**Request** (multipart/form-data):
```typescript
{
  image: File              // dog photo
  petName: string
  breed?: string           // optional, helps accuracy
  weight?: number          // lbs, optional
  serviceType: "grooming"  // only grooming for now
}
```

**Response** (200 OK):
```typescript
{
  estimateId: string
  basePrice: number                                    // cents (5500 = $55.00)
  adjustments: Array<{ reason: string, amount: number }>
  totalPrice: number                                   // cents
  sizeCategory: "small" | "medium" | "large" | "xlarge"
  explanation: string                                  // AI-generated, human-readable
  imageUrl: string                                     // stored image reference
}
```

**Error** (500):
```typescript
{
  error: string
  message: "Unable to generate pricing estimate. Please try again."
}
```

### POST /api/appointments/propose

**Request** (JSON):
```typescript
{
  estimateId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  preferredDate: string    // ISO date "2026-03-15"
  petId?: string           // if returning customer
}
```

**Response** (200 OK):
```typescript
{
  slots: Array<{
    slotId: string
    startTime: string      // ISO datetime
    endTime: string        // ISO datetime
    groomer: string        // groomer name
  }>
}
```

### POST /api/appointments/confirm

**Request** (JSON):
```typescript
{
  slotId: string
  estimateId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  petName: string
  notes?: string
}
```

**Response** (200 OK):
```typescript
{
  appointmentId: string
  status: "confirmed"
  startTime: string
  endTime: string
  groomer: string
  totalPrice: number       // cents
  confirmationNumber: string
}
```

## Database Schema (Spencer)

Core tables needed:

### customers
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | required |
| email | text | required |
| phone | text | required |
| address | text | required |
| created_at | timestamp | default now() |

### pets
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| customer_id | uuid | FK → customers |
| name | text | required |
| breed | text | nullable |
| weight | decimal | nullable, lbs |
| size_category | text | small/medium/large/xlarge |
| image_url | text | stored photo reference |
| created_at | timestamp | default now() |

### pricing_estimates
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| pet_id | uuid | FK → pets |
| base_price | integer | cents |
| adjustments | jsonb | array of {reason, amount} |
| total_price | integer | cents |
| explanation | text | AI-generated |
| created_at | timestamp | default now() |

### groomers
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | required |
| available | boolean | default true |

### appointments
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| customer_id | uuid | FK → customers |
| pet_id | uuid | FK → pets |
| estimate_id | uuid | FK → pricing_estimates |
| groomer_id | uuid | FK → groomers |
| start_time | timestamp | required |
| end_time | timestamp | required |
| status | text | confirmed/completed/cancelled |
| confirmation_number | text | unique, human-readable |
| notes | text | nullable |
| created_at | timestamp | default now() |

### Seed Data
Spencer should seed:
- 3-4 groomers with names
- Time slots for today and next 3 days (9 AM - 5 PM MST, 1-hour slots)

## AI Pricing Engine (Sam)

Sam's module at `src/lib/ai/pricing-engine.ts` must export:

```typescript
export async function analyzeDogPhoto(
  imageBuffer: Buffer,
  metadata: { petName: string; breed?: string; weight?: number }
): Promise<{
  sizeCategory: "small" | "medium" | "large" | "xlarge"
  basePrice: number           // cents
  adjustments: Array<{ reason: string; amount: number }>
  totalPrice: number          // cents
  explanation: string
}>
```

### Pricing Logic
| Size | Base Price | Examples |
|------|-----------|----------|
| Small (< 15 lbs) | $35 | Chihuahua, Yorkie |
| Medium (15-40 lbs) | $55 | Beagle, Cocker Spaniel |
| Large (40-80 lbs) | $75 | Lab, Golden Retriever |
| XLarge (80+ lbs) | $95 | Great Dane, Saint Bernard |

### Adjustments
- Long/thick coat: +$15
- Matted fur: +$20
- Special handling (anxious/aggressive): +$10

### Claude Vision Prompt Requirements
- Send the dog photo to Claude with a system prompt requesting structured JSON
- Claude should classify: size category, coat type, visible matting, breed guess
- Sam's code combines Claude's classification with the pricing table above
- Must return structured JSON (use tool_use or JSON mode)

## Frontend Pages (Jess)

### Page Flow
```
Landing (/) → Upload (/upload) → Pricing (/pricing/[estimateId]) → Booking (/booking/[estimateId]) → Confirmation (/confirmation/[appointmentId])
```

### Landing Page (/)
- Hero section: "Mobile Pet Grooming, At Your Door"
- Primary CTA button: "Get a Price Estimate" → /upload
- Nav bar with dead-end links: "Track Appointment", "My Appointments", "SDR Console", "Analytics"
- Brief value props (3 cards): convenience, AI-powered pricing, professional groomers

### Upload Page (/upload)
- Dog photo upload (drag & drop or click)
- Photo preview after upload
- Pet details form: name (required), breed (optional), weight (optional)
- Service type selector (only "grooming" enabled, others greyed out with "Coming Soon")
- Submit button → calls POST /api/pricing/estimate → redirects to /pricing/[estimateId]

### Pricing Result (/pricing/[estimateId])
- Display uploaded dog photo
- Size category badge
- Price breakdown: base price, adjustments, total
- AI explanation text
- "Book Now" CTA → navigates to /booking/[estimateId]

### Booking Page (/booking/[estimateId])
- Customer info form: name, email, phone, address
- Date picker (today + next 3 days)
- On date select → calls POST /api/appointments/propose → shows available slots
- Slot cards showing time + groomer name
- Select slot + "Confirm Booking" → calls POST /api/appointments/confirm → redirects to /confirmation/[appointmentId]

### Confirmation Page (/confirmation/[appointmentId])
- Confirmation number (large, prominent)
- Appointment summary: date, time, groomer, pet, price
- "Track Appointment" button → /coming-soon
- "Book Another" button → /upload

### Coming Soon Page (/coming-soon)
- Simple page: "This feature is coming soon!"
- Mention which agent it belongs to (Live Tracking, Retention, SDR, Analytics)
- Back to home button

## Integration Notes

### How the pieces connect at runtime:
1. Jess's upload form sends multipart form data to Spencer's `/api/pricing/estimate`
2. Spencer's route saves the image, creates customer + pet records, calls Sam's `analyzeDogPhoto()`
3. Sam's function calls Claude Vision API, applies pricing logic, returns structured result
4. Spencer saves the estimate to DB, returns the response to Jess's frontend
5. Jess displays the result, user clicks "Book Now"
6. Jess's booking form calls Spencer's `/api/appointments/propose` with customer info + date
7. Spencer queries available groomers/slots, returns options
8. User picks a slot, Jess calls Spencer's `/api/appointments/confirm`
9. Spencer creates the appointment record, returns confirmation number
10. Jess displays the confirmation page

### Working in Parallel
- **Jess** can mock API responses locally to build UI without waiting for Spencer/Sam
- **Spencer** can test his API routes with curl/Postman using hardcoded pricing data before Sam's module is ready
- **Sam** can test his pricing engine standalone with test images before Spencer integrates it

### Branch Strategy
- Each person works on their own branch: `jess-frontend`, `spencer-backend`, `sam-ai`
- Merge to `main` when ready to integrate
- Avoid editing each other's directories to prevent conflicts

## Tech Decisions

- **Database:** SQLite via better-sqlite3 (or Prisma with SQLite) — zero setup, ships with the app, good enough for hackathon
- **Image Storage:** Local filesystem (`public/uploads/`) — simplest option for hackathon
- **AI:** Anthropic Claude API with vision (claude-sonnet-4-5-20250514 or claude-haiku-4-5-20251001 for speed)
- **Styling:** Tailwind CSS 4 (already configured)
- **No auth** — not needed for demo
