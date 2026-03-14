# Agents

Each agent lives in its own folder under `src/agents/`. Pricing is implemented in Python.

- **Invoked via HTTP** — Next.js API routes proxy to the agent (e.g. Python server).
- **Shared data** — Agents read/write through common data sources (CRM, DB, APIs).

## Pricing agent

**Folder:** `src/agents/pricing/`

Contains the full module: Python (FastAPI, rules, Claude Vision), `requirements.txt`, README.

- Run: from repo root, `PYTHONPATH=src uvicorn agents.pricing.server:app --reload --port 8000`. See `src/agents/pricing/README.md`.
- Set `PRICING_AGENT_PYTHON_URL=http://localhost:8000` so `POST /api/pricing/estimate` proxies to it.

Future agents: add sibling folders (e.g. `src/agents/scheduling/`) the same way.
