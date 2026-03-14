# Secrets

Add a `.env` file here with your API keys. It is **not** committed to git.

Example:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

The app expects `ANTHROPIC_API_KEY` in the **repo root** `.env.local` when running Next.js and the Python agent. You can copy from here or set it in `.env.local` directly.
