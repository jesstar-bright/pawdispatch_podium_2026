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
│       │   └── estimate/
│       │       ├── route.ts        # Spencer — POST pricing estimate
│       │       └── [estimateId]/route.ts  # Spencer — GET estimate by ID
│       ├── appointments/
│       │   ├── propose/route.ts    # Spencer — Propose time slots
│       │   ├── confirm/route.ts    # Spencer — Confirm booking
│       │   └── [appointmentId]/route.ts  # Spencer — GET appointment by ID
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

**Implementation Notes:**
- Saves uploaded image to `public/uploads/[estimateId].jpg`
- Calls Sam's `analyzeDogPhoto()` function with image buffer and metadata
- Creates `pricing_estimates` record in DB (pet_id may be null initially, linked later at booking)
- Does NOT create customer/pet records yet (those are created at booking time)
- Returns `estimateId` for use in subsequent booking flow

### GET /api/pricing/estimate/[estimateId]

**Response** (200 OK):
```typescript
{
  estimateId: string
  basePrice: number
  adjustments: Array<{ reason: string, amount: number }>
  totalPrice: number
  sizeCategory: "small" | "medium" | "large" | "xlarge"
  explanation: string
  imageUrl: string
}
```

**Error** (404):
```typescript
{
  error: string
  message: "Estimate not found"
}
```

**Implementation Notes:**
- Retrieves pricing estimate from database by ID
- Used by frontend to display estimate details (e.g., on page refresh)

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
    slotId: string         // Format: "groomerId-startTime" (e.g., "uuid-2026-03-15T09:00:00Z")
    startTime: string      // ISO datetime
    endTime: string        // ISO datetime
    groomer: string        // groomer name
  }>
}
```

**Error** (400):
```typescript
{
  error: string
  message: "Invalid estimate ID or date"
}
```

**Implementation Notes:**
- Validates `estimateId` exists in database
- Validates `preferredDate` is not in the past and within allowed range (today + next 3 days)
- Queries available groomers (where `available = true`)
- Generates time slots dynamically (9 AM - 5 PM MST, 1-hour blocks) for the requested date
- Excludes slots already booked in `appointments` table (where `status = 'confirmed'`)
- `slotId` format: `{groomerId}-{startTime}` (e.g., "550e8400-e29b-41d4-a716-446655440000-2026-03-15T09:00:00Z")
- Does NOT create customer/pet records yet (those are created in `/confirm`)

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
  confirmationNumber: string  // Format: "PD-YYYY-XXXXXX" (e.g., "PD-2026-001234")
}
```

**Error** (400):
```typescript
{
  error: string
  message: "Slot no longer available" | "Invalid estimate ID" | "Missing required fields"
}
```

**Error** (409):
```typescript
{
  error: string
  message: "This time slot has already been booked. Please select another slot."
}
```

**Implementation Notes:**
- **Race condition handling:** Use database transaction/lock to check slot availability and create appointment atomically
- Validates `estimateId` exists and retrieves pricing estimate
- Creates or finds customer record (check by email, create if not exists)
- Creates pet record linked to customer (using petName from request + estimate data)
- Updates `pricing_estimates.pet_id` to link estimate to pet
- Validates slot is still available (parse `slotId` to extract groomer + startTime, check against existing appointments)
- If slot is taken, return 409 Conflict error
- Generates unique `confirmation_number` in format: `PD-YYYY-XXXXXX` (e.g., "PD-2026-001234")
- Creates `appointments` record with status "confirmed"
- Returns full appointment details including confirmation number

### GET /api/appointments/[appointmentId]

**Response** (200 OK):
```typescript
{
  appointmentId: string
  status: "confirmed" | "completed" | "cancelled"
  startTime: string
  endTime: string
  groomer: string
  totalPrice: number
  confirmationNumber: string
  customerName: string
  petName: string
  address: string
}
```

**Error** (404):
```typescript
{
  error: string
  message: "Appointment not found"
}
```

**Implementation Notes:**
- Retrieves appointment from database by ID
- Includes related customer and pet information
- Used by frontend to display confirmation details (e.g., on page refresh)

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
| pet_id | uuid | FK → pets, nullable initially (set at booking time) |
| base_price | integer | cents |
| adjustments | jsonb | array of {reason, amount} |
| total_price | integer | cents |
| explanation | text | AI-generated |
| image_url | text | stored photo reference |
| created_at | timestamp | default now() |

**Note:** `pet_id` is nullable because customer/pet records are created at booking time, not at estimate time.

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
| start_time | timestamp | required, indexed for availability queries |
| end_time | timestamp | required |
| status | text | confirmed/completed/cancelled |
| confirmation_number | text | unique, human-readable, indexed |
| notes | text | nullable |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now(), updated on changes |

**Indexes:**
- `appointments.start_time` - for availability queries
- `appointments.confirmation_number` - for lookups
- `customers.email` - for duplicate detection
- `pricing_estimates.pet_id` - for linking estimates to pets

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

**Pricing Flow:**
1. Jess's upload form sends multipart form data to Spencer's `POST /api/pricing/estimate`
2. Spencer's route saves the image to `public/uploads/[estimateId].jpg`
3. Spencer calls Sam's `analyzeDogPhoto()` function with image buffer and metadata
4. Sam's function calls Claude Vision API, applies pricing logic, returns structured result
5. Spencer creates `pricing_estimates` record in DB (pet_id is null at this stage)
6. Spencer returns response with `estimateId` to Jess's frontend
7. Jess stores estimate in sessionStorage and redirects to `/pricing/[estimateId]`
8. Jess's pricing page can optionally call `GET /api/pricing/estimate/[estimateId]` to retrieve from DB (for persistence across page refreshes)

**Booking Flow:**
9. User clicks "Book Now" → navigates to `/booking/[estimateId]`
10. User fills customer info form (name, email, phone, address) and selects preferred date
11. Jess calls Spencer's `POST /api/appointments/propose` with customer info + date
12. Spencer validates estimateId exists, queries available groomers, generates time slots, excludes booked slots
13. Spencer returns available slots to frontend
14. User selects a slot, clicks "Confirm Booking"
15. Jess calls Spencer's `POST /api/appointments/confirm` with slotId, estimateId, customer info, petName
16. Spencer uses database transaction to:
    - Check slot is still available (race condition protection)
    - Create or find customer record (by email)
    - Create pet record linked to customer
    - Update `pricing_estimates.pet_id` to link estimate to pet
    - Create appointment record with unique confirmation number
17. Spencer returns appointment details with `appointmentId` and `confirmationNumber`
18. Jess stores confirmation in sessionStorage and redirects to `/confirmation/[appointmentId]`
19. Jess's confirmation page can optionally call `GET /api/appointments/[appointmentId]` to retrieve from DB (for persistence)

**Key Design Decisions:**
- Customer/pet records are created at booking time (step 16), not at pricing time
- This avoids orphaned records if users abandon the flow after getting a price estimate
- All data is persisted in database for demo/judging purposes
- Frontend can use sessionStorage for immediate display, but should fall back to GET endpoints for persistence

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

## Implementation Requirements (Spencer)

### Database Setup
- Use Drizzle ORM or Prisma with SQLite
- Create all 5 tables with proper foreign keys
- Add indexes on frequently queried columns (see schema section)
- Make seed endpoint idempotent (safe to run multiple times)

### API Route Requirements
- All POST endpoints must validate required fields
- All endpoints must return consistent error format: `{ error: string, message: string }`
- Use database transactions for `/api/appointments/confirm` to prevent race conditions
- Implement proper error handling (try/catch, return appropriate HTTP status codes)

### Validation Rules
- Email format validation (basic regex)
- Phone number format validation (allow flexible formats for hackathon)
- Date validation: not in past, within allowed range (today + next 3 days)
- Estimate ID existence check in `/propose` and `/confirm`
- Slot availability check in `/confirm` (with transaction/lock)

### Confirmation Number Generation
- Format: `PD-YYYY-XXXXXX` where XXXXXX is a 6-digit sequential number
- Must be unique (check against existing appointments)
- Example: "PD-2026-001234"
- Store in database for lookups

### Slot ID Format
- Generated on-the-fly in `/propose` endpoint
- Format: `{groomerId}-{startTime}` (e.g., "550e8400-e29b-41d4-a716-446655440000-2026-03-15T09:00:00Z")
- Parsed in `/confirm` to extract groomer ID and start time
- No separate "slots" table needed (slots are generated dynamically)
