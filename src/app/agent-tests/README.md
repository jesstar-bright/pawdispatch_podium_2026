# Agent test routes

Routes under `/agent-tests/*` are **isolated test UIs** for individual agents. They are not the main product flow.

- **`/agent-tests`** — Index of all agent tests.
- **`/agent-tests/pricing/upload`** — Test the Pricing agent: upload dog photo + pet details, submit to `POST /api/pricing/estimate`.
- **`/agent-tests/pricing/result/[estimateId]`** — Display stored estimate (after upload).

The **main app frontend** (all agents, full journey, branding) is built elsewhere. It can reuse components from `@/components/agent-tests/pricing` or call the same APIs; these routes stay focused on testing one agent at a time.
