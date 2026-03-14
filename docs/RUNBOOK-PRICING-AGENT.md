# Pricing agent – runbook (4 PM MST deadline)

You're in the repo root (e.g. `/Users/<you>/Projects/pawdispatch_podium_2026`). Pull main first:

```bash
git pull origin main
```

The pricing agent lives in **`src/agents/pricing/`**. Follow these steps to run it end-to-end.

---

## 1. Add env vars to `.env.local`

Create or edit `.env.local` in the **repo root**:

```
ANTHROPIC_API_KEY=<your real key>
PRICING_AGENT_PYTHON_URL=http://localhost:8000
NEXT_PUBLIC_MOCK_API=false
```

---

## 2. Install Python dependencies

Either from repo root:

```bash
pip install -r src/agents/pricing/requirements.txt
```

Or from the agent folder:

```bash
cd src/agents/pricing
pip install -r requirements.txt
cd ../..
```

---

## 3. Start the Python pricing agent (Terminal 1)

In a **separate terminal**, from the repo root (e.g. `cd /path/to/pawdispatch_podium_2026`):

```bash
PYTHONPATH=src uvicorn agents.pricing.server:app --port 8000
```

Leave this running.

---

## 4. Start Next.js (Terminal 2)

In **another terminal**, from the **repo root**:

```bash
npm run dev
```

---

## 5. Test it

1. Go to **http://localhost:3000/upload**
2. Upload a **real dog photo**
3. Fill in **pet name**, optionally breed/weight
4. Hit **Get Price Estimate**
5. You should see a **real Claude Vision** response with size classification and price

---

## 6. If it works

Push any fixes to `main`. If the API response shape doesn't match what the frontend expects, use the format below.

### Expected response from `POST /api/pricing/estimate`

The Next.js route proxies to the Python agent and returns this shape:

```json
{
  "estimateId": "string (UUID)",
  "basePrice": 5500,
  "adjustments": [{ "reason": "string", "amount": 5500 }],
  "totalPrice": 5500,
  "sizeCategory": "small" | "medium" | "large" | "xlarge",
  "explanation": "string",
  "imageUrl": "string (e.g. /uploads/xxx.jpg)"
}
```

- All monetary values are **cents** (e.g. 5500 = $55).
- The Python agent in `src/agents/pricing/server.py` already returns this shape; `route.ts` at `src/app/api/pricing/estimate/route.ts` adds `estimateId` and `imageUrl` for multipart uploads.

---

## Troubleshooting

- **503 "Pricing agent not configured"** — Set `PRICING_AGENT_PYTHON_URL=http://localhost:8000` in `.env.local` and ensure the Python agent is running on port 8000.
- **ModuleNotFoundError: agents.pricing** — Run uvicorn from the **repo root** with `PYTHONPATH=src`.
- **No price / wrong shape** — Confirm the Python `/estimate` response has `basePrice`, `adjustments`, `totalPrice`, `sizeCategory`, `explanation`. The Next.js route maps these through.

Once pricing works end-to-end, help Jess and Spencer debug the full flow (booking, confirmation, etc.).
