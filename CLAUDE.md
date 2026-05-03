# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

**NiCE Media Processing Center of Excellence** — a Next.js dashboard for evaluating and tracking speech/voice AI vendors (STT, TTS, STS/Speech-to-Speech). It helps NICE CXone teams benchmark vendors like Deepgram, AssemblyAI, OpenAI Whisper, ElevenLabs, etc., track industry news, generate AI-powered deployment guidelines, and run live evaluations.

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack at http://localhost:3000
npm run build        # Prisma generate + Next.js build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check

# Testing
npm run test         # Vitest (watch mode)
npm run test:run     # Vitest (single run, CI-friendly)
npm run test:e2e     # Playwright E2E tests (requires running server or starts it)
npm run test:a11y    # Accessibility tests via Playwright

# Run a single Vitest test file
npx vitest run __tests__/unit/my-file.test.ts

# Database
npm run db:migrate   # Run Prisma migrations (dev)
npm run db:push      # Push schema to DB without migration
npm run db:seed      # Seed core data
npm run db:studio    # Open Prisma Studio
npm run db:seed-benchmarks   # Seed benchmark results
npm run db:seed-registry     # Seed vendor registry
npm run db:seed-evaluations  # Seed evaluation datasets
npm run db:seed-reports      # Seed reports

# Data fetching
npm run fetch-benchmarks       # Fetch benchmark data (cached)
npm run fetch-benchmarks:force # Fetch and override cache
```

## Environment Setup

Copy `.env.example` to `.env`. Required keys:
- `DATABASE_URL` — PostgreSQL Transaction Pooler URL (port 6543, Supabase)
- `DIRECT_URL` — PostgreSQL Direct URL (port 5432, for Prisma migrate)
- `ANTHROPIC_API_KEY` — Required for all AI agent features

Optional vendor API keys (`DEEPGRAM_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, etc.) are used in the Evaluate wizard for live evaluations; without them only simulation mode works.

## Architecture

### Routing
Uses Next.js App Router. All dashboard pages live under `app/(dashboard)/` and share the sidebar+topbar layout in `app/(dashboard)/layout.tsx`. The root `app/layout.tsx` is a minimal shell.

Main dashboard sections: `architecture`, `benchmarks`, `datasets`, `evaluate`, `generate-lab`, `news`, `reports`, `standards`, `tts-audio-lab`, `vendors`.

### API Routes (`app/api/`)
Each subdirectory is a REST endpoint:
- `agents/[agentId]/` — trigger/status for long-running AI agents (news-scout, benchmark-collector, vendor-registry, deployment-guidelines, report-generator, evaluation-runner)
- `benchmarks/` — benchmark results CRUD
- `evaluations/` — evaluation management + batch evaluate
- `news/` — news items CRUD
- `stt/` — STT evaluation endpoints (`evaluate`, `batch-evaluate`)
- `vendors/` — vendor registry CRUD
- `datasets/`, `reports/`, `generate-lab/`, `debug/`, `overview/` — feature-specific endpoints

### AI Agents (`lib/agents/`)
Six long-running agents powered by Claude (via `lib/anthropic-client.ts`):
- `news-scout.ts` — scrapes speech AI news from configured sources using Claude's web_search tool
- `benchmark-collector.ts` — fetches benchmark data from leaderboard sources
- `vendor-registry.ts` — updates vendor metadata via Claude
- `deployment-guidelines.ts` — generates vendor deployment docs via Claude
- `report-generator.ts` — generates landscape/comparison reports via Claude
- `evaluation-runner.ts` — orchestrates STT/TTS evaluations

Agents are triggered via `POST /api/agents/[agentId]` and can be polled for status. The `createAnthropicClient()` in `lib/anthropic-client.ts` handles proxy support (`GLOBAL_AGENT_HTTP_PROXY`) for sandboxed environments.

### Database
PostgreSQL via Prisma with `@prisma/adapter-pg`. Schema in `prisma/schema.prisma` covers: Vendors, BenchmarkResults, News, VendorRegistry (products, deployment options, security certs, languages, pricing tiers, NICE compatibility), Evaluations/EvaluationResults, EvaluationDatasets, DeploymentGuidelines, Reports.

The Prisma client singleton (`lib/prisma.ts`) creates a fresh client in dev to pick up newly generated models without restart.

### Python STT Evaluator
`stt_evaluate.py` is a Python script invoked by `lib/stt-runner.ts` via `child_process.spawn`. It runs actual STT API calls against audio files and returns JSON results. The `tts-audio-lab` page generates audio (TTS) and then evaluates it with STT — results are persisted to the Evaluations tables.

### Frontend Stack
- **UI components**: shadcn/ui pattern in `components/ui/` (Radix UI primitives + Tailwind CSS v4)
- **Charts**: Recharts for benchmark visualizations
- **Styling**: Tailwind CSS v4 + CSS variables for theming
- **Path alias**: `@/` maps to the project root

### Testing Structure
- `__tests__/unit/` — unit tests (Vitest + jsdom)
- `__tests__/integration/` — integration tests
- `__tests__/accessibility/` — a11y tests
- `e2e/` — Playwright end-to-end tests
- Vitest setup in `vitest.setup.ts` (includes `@testing-library/jest-dom`)

### Deployment
- Docker via `docker-compose.yml` (port 3000, audio files persisted in named volume)
- Vercel via `vercel.json` (uses `npm run vercel-build`)
- Build runs `prisma generate` before `next build`
- ESLint and TypeScript errors are **ignored during builds** (`next.config.ts`)
