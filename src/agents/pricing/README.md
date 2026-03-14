# Pricing Agent

Python pricing agent: dog photo + metadata → grooming estimate (Claude Vision + rules). All code for this agent lives in this folder.

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
