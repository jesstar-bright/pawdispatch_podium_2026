# Pricing Agent

Frontend uploads image → Next.js API → this agent → **Claude** (API key from `secrets/.env`) → price. Range **$50–$1000**.

**Features that set the price:** size (small/medium/large/xlarge) from the photo, plus add-ons: long or thick coat, matted fur, special handling (anxious/extra care). Total is clamped to $50–$1000.

---

## Run (from repo root)

Install once:

```bash
pip install -r src/agents/pricing/requirements.txt
```

Terminal 1 — start agent (API key in `secrets/.env`):

```bash
set -a && source secrets/.env && set +a && PYTHONPATH=src uvicorn agents.pricing.server:app --port 8000
```

Terminal 2 — start frontend (`.env.local`: `PRICING_AGENT_PYTHON_URL=http://localhost:8000`, `NEXT_PUBLIC_MOCK_API=false`):

```bash
npm run dev
```

Browser: **http://localhost:3000/upload**

---

Test without frontend (photo in `data/dog.jpg`):

```bash
curl -X POST http://localhost:8000/estimate -F "image=@data/dog.jpg" -F "petName=Buddy"
```
