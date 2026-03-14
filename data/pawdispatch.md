# PawDispatch

PawDispatch is a web app for a mobile pet grooming business. It turns a photo of a dog into a price estimate and lets the customer book a time slot — no phone call required.

## What it does

1. **Landing** — Customer visits the site and clicks through to get a price.
2. **Upload** — Customer uploads a photo of their dog and enters the pet’s name (and optional breed/weight).
3. **AI pricing** — The app sends the photo to an AI pricing agent (Claude Vision). The agent classifies the dog (size, coat type, color, matting, special handling) and returns a grooming price between $50 and $1,000.
4. **Booking** — Customer sees the estimate, picks an available time slot, and confirms. They get a confirmation number.
5. **Confirmation** — Booking is stored; the customer can return to the confirmation page to see their appointment details.

So in one flow: **photo → AI price → pick slot → booked.**

## How it’s built

- **Frontend** — Next.js (React). Pages: landing, upload, pricing result, slot picker, confirmation. Upload and booking are wired to the backend.
- **Backend** — Next.js API routes for pricing estimates and appointments. They talk to a database and to the pricing agent.
- **Pricing agent** — Standalone Python service (FastAPI). It receives the image, calls Claude Vision to classify the dog, applies pricing rules (size + add-ons like long coat, matting, special handling), and returns the estimate. The frontend calls this via the Next.js API, which proxies to the Python service.
- **Data** — Estimates and appointments are persisted so customers can revisit their estimate or confirmation.

## Who it’s for

- **Pet owners** — Get a quick grooming price from a photo and book a slot.
- **Grooming business** — Capture leads and bookings without manual quoting.

## Tech in short

- Next.js, React, TypeScript
- Python pricing agent (FastAPI, Claude Vision, rules-based pricing)
- Database for estimates and appointments
- Optional backend test: run the pricing agent on a photo in `data/` without the frontend

This is the Podium 2026 hackathon project: lead-to-booking flow with real AI-powered pricing.
