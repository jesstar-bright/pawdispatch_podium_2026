# Agent test UIs

This folder contains **modular, per-agent test frontends** for development and QA. They are **not** the main product UI.

- **Purpose:** Test one agent in isolation (API contract, behavior, edge cases).
- **Consumption:**
  - Used by dedicated routes under `/agent-tests/<agent>/` (e.g. `/agent-tests/pricing/upload`).
  - Can be imported and embedded in the main app if the main frontend wants to reuse an agent test flow (e.g. `import { PricingAgentUploadForm } from '@/components/agent-tests/pricing'`).

## Structure

- **`pricing/`** — Test UI for the **Pricing Agent** (dog photo + pet details → estimate).
  - Components: `PricingAgentUploadForm`, `PricingAgentResultView`.
  - Types and storage: `PricingEstimateResult`, `getStoredEstimate`, `setStoredEstimate`, `PRICING_ESTIMATE_STORAGE_KEY`.

Other agents (scheduling, SDR, retention, etc.) can get their own sibling folders (e.g. `scheduling/`, `sdr/`) as needed.

## Main app frontend

The main user-facing frontend (all agents, full flow, branding) is owned separately. It may:

- Use different routes and layouts.
- Reuse these components where it makes sense (e.g. embed `PricingAgentUploadForm` in a wizard).
- Call the same APIs (`POST /api/pricing/estimate`, etc.) and use the same storage keys if integrating with the pricing agent test flow.

Avoid putting main-app–specific layout, nav, or flow logic inside this folder; keep agent-tests scoped to **testing a single agent**.
