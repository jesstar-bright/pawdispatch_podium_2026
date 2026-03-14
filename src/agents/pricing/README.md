# Pricing Agent

Python pricing agent: dog photo + metadata → grooming estimate (Claude Vision + rules). **No Node.js, no browser, no extra installs** — just Python and curl.

---

## 1. Install Python dependencies (repo root)

```bash
pip install -r src/agents/pricing/requirements.txt
```

---

## 2. API key

The API key lives in **`secrets/.env`** (e.g. `ANTHROPIC_API_KEY=...`). You don’t need to copy it anywhere else.

---

## 3. Start the agent (from repo root)

Load the key and start the server:

```bash
set -a && source secrets/.env && set +a
PYTHONPATH=src uvicorn agents.pricing.server:app --port 8000
```

Leave this running.

---

## 4. Test with curl (no Node)

Put your dog photo in the **`data/`** folder (e.g. `data/dog.jpg`). From repo root:

```bash
curl -X POST http://localhost:8000/estimate \
  -F "image=@data/dog.jpg" \
  -F "petName=Buddy"
```

You’ll get a JSON estimate (size category, base price, total, explanation).

---

## API (reference)

- **POST /estimate** — multipart: `image` (file), `petName` (required), `breed?`, `weight?`. Returns estimate.
- **POST /estimate/json** — JSON: `petName`, `breed?`, `weight?`, `image?` (base64).
- **GET /health** — health check.

---

## Optional: web UI (Node.js)

If you have Node.js and want the upload page at http://localhost:3000/upload:

1. In repo root `.env.local`: `PRICING_AGENT_PYTHON_URL=http://localhost:8000`, `NEXT_PUBLIC_MOCK_API=false`.
2. Run `npm run dev`, then open the upload page.

The agent works fully without this; curl is enough.
