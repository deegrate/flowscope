## Overview

FlowScope is a full-stack observability console built for engineering teams 
that run AI workflows and agents in production. It provides a unified interface 
for tracing workflow executions end-to-end, inspecting individual LLM calls and 
tool invocations, comparing prompt versions across deployments, and monitoring 
reliability, latency, and cost over time.

Designed with the same attention to UX that engineers expect from tools like 
Linear and Vercel, FlowScope surfaces the operational data that matters — 
without the noise.

## Why FlowScope

Modern AI pipelines are opaque by default. A single workflow run may involve 
dozens of LLM calls, HTTP fetches,  tool invocations, and data transformations. 
When something goes wrong — or when you want to improve performance — you need 
to see exactly what happened at each step, which prompt version was active, how 
long each operation took, and what it cost.

FlowScope was built to answer those questions at a glance.

## Features

### Dashboard
- Real-time KPI cards: total runs, success rate, average latency, and estimated 
  daily cost.
- Runs over time chart (14-day rolling window).
- Failures by workflow bar chart.
- Per-workflow health cards with success rate progress bars and run statistics.
- Recent failures panel with direct links to trace detail views.

### Runs Explorer
- Paginated, filterable table of all workflow executions.
- Filter by status (success / error / degraded), workflow, model, and date range.
- Full-text search by run ID or workflow name.
- Color-coded status pills and model badges.
- One-click navigation to full trace detail.

### Run Detail (Trace View)
- Complete execution summary: model, prompt version, duration, token count, 
  estimated cost, and timestamps.
- Auto-generated run summary sentence based on execution outcome
- Step-by-step timeline with type icons (LLM / tool / HTTP / transform), 
  per-step duration, and status indicators.
- Live step inspector panel showing:
  - LLM steps: prompt text, model parameters, and output.
  - Tool steps: input arguments and output payload (pretty-printed JSON).
  - HTTP steps: method, URL, status code, and response preview.
  - Error steps: error message and failure context.
- Raw JSON toggle for full step metadata inspection.
- Copyable run ID.

### Prompt Versions
- Per-workflow prompt version history.
- Side-by-side line diff viewer with addition/removal highlighting.
- Per-version metrics: success rate, average latency, average cost.
- Metric delta comparison between any two versions.
- Current version badge.

### Settings
- Integration cards for n8n, Node Agent Runner, Gemini, Claude, and Ollama.
- Mocked ingestion API endpoint with sample JSON trace payload.
- Extensible architecture designed for real integration in v2.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | DM Sans + IBM Plex Mono |
| Data | Seeded in-memory store (80 runs, 3 workflows) |
| Runtime | Node.js / WSL2 |

## Architecture

FlowScope is built on a clean separation between the data layer and the UI layer.

The data layer (`lib/`) defines a typed domain model (workflows, runs, steps, 
prompt versions) and a set of pure query functions that simulate what a real 
backend would expose. This makes it straightforward to swap the seed data for 
a real database or API without changing any UI code.

The UI layer is organized around Next.js App Router pages, each composed from 
small, focused, fully-typed React components. Server components handle data 
fetching while client components handle interactivity. Framer Motion is used 
sparingly for transitions that communicate state changes without adding visual 
noise.

## Seed Data

The demo dataset includes:
- **3 workflows**: AutoMatch Catalog Pipeline, UGC Ad Generator, Research Agent.
- **80 runs** spread across the last 30 days with realistic status distributions.
- **4–8 steps per run** covering all step types (LLM, tool, HTTP, transform).
- **3 prompt versions per workflow** showing evolution from basic to refined.
- **Mixed models**: gemini-2.5-pro, claude-3-opus, ollama/llama3.

## Roadmap

- [ ] Real ingestion API (`POST /api/ingest`) for live trace data.
- [ ] Supabase/Postgres backend replacing seed data.
- [ ] Authentication and multi-tenant project support.
- [ ] n8n and LangChain native integrations.
- [ ] Alerting and anomaly detection.
- [ ] Shareable trace links.
- [ ] Astro-powered documentation site.

## Background

FlowScope was designed and built as part of the Millennium Technologies 
internal tooling portfolio — a suite of AI automation systems, workflow 
pipelines, and developer infrastructure built for real production use cases 
including catalog intelligence, automated content generation, and research 
agents.

---

© 2026 Millennium Technologies Inc. All rights reserved.