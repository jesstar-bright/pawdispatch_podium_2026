# Pricing Agent

Python pricing agent: dog photo + metadata → grooming estimate (Claude Vision + rules). All code for this agent lives in this folder.

**1. Start the pricing agent (Terminal 1, from repo root):**
```bash
PYTHONPATH=src uvicorn agents.pricing.server:app --port 8000
```

**2. Start Next.js (Terminal 2, from repo root):**
```bash
npm run dev
```

Then open http://localhost:3000/upload to test.

---

## Setup

From the **repo root**:

```bash
pip install -r src/agents/pricing/requirements.txt
```

Or from this folder:

```bash
cd src/agents/pricing
pip install -r requirements.txt
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=your_key_here
```

## Run

From the **repo root** (so the `agents.pricing` package resolves):

```bash
export PYTHONPATH=src
uvicorn agents.pricing.server:app --reload --port 8000
```

- **POST /estimate** — multipart: `image` (file), `petName` (required), `breed?`, `weight?`. Returns estimate.
- **POST /estimate/json** — JSON: `petName`, `breed?`, `weight?`, `image?` (base64).
- **GET /health** — health check.

## Integration

Set `PRICING_AGENT_PYTHON_URL=http://localhost:8000` (e.g. in `.env.local`). The Next.js app proxies `POST /api/pricing/estimate` to this service.
