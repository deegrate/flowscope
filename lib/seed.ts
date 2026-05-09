import type { Workflow, Run, RunStep, PromptVersion } from './types'

export const WORKFLOWS: Workflow[] = [
  {
    id: 'wf1',
    name: 'AutoMatch Catalog Pipeline',
    description:
      'AI product matching and catalog enrichment with supplier normalization',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'wf2',
    name: 'UGC Ad Generator',
    description:
      'Automated UGC video ad script and asset generation for campaigns',
    status: 'active',
    createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'wf3',
    name: 'Research Agent',
    description:
      'Web research, summarization, and structured output extraction',
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
  },
]

const MODELS = ['gemini-2.5-pro', 'claude-3-opus', 'ollama/llama3'] as const
const PROMPT_VERSIONS = ['v1', 'v2', 'v3'] as const
const STATUS_POOL: Run['status'][] = [
  'success', 'success', 'success', 'success', 'success',
  'success', 'success', 'error', 'error', 'error',
  'degraded', 'degraded', 'degraded',
]

const STEP_DEFS: Record<string, { t: RunStep['type']; n: string }[]> = {
  wf1: [
    { t: 'http', n: 'retrieve_supplier_page' },
    { t: 'llm', n: 'extract_product_data' },
    { t: 'llm', n: 'llm_enrich_metadata' },
    { t: 'http', n: 'web_search_verify' },
    { t: 'transform', n: 'normalize_schema' },
    { t: 'tool', n: 'export_csv' },
  ],
  wf2: [
    { t: 'tool', n: 'fetch_product_brief' },
    { t: 'llm', n: 'llm_generate_script' },
    { t: 'llm', n: 'llm_refine_hook' },
    { t: 'tool', n: 'generate_image_prompt' },
    { t: 'http', n: 'http_submit_render' },
    { t: 'transform', n: 'transform_output' },
  ],
  wf3: [
    { t: 'transform', n: 'parse_query' },
    { t: 'http', n: 'http_fetch_sources' },
    { t: 'llm', n: 'llm_summarize' },
    { t: 'llm', n: 'llm_extract_entities' },
    { t: 'transform', n: 'transform_structure' },
    { t: 'tool', n: 'tool_save_result' },
  ],
}

// Deterministic pseudo-random seeded by index
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function buildStepMeta(
  type: RunStep['type'],
  name: string,
  model: string,
  status: RunStep['status'],
  rng: () => number
): Record<string, unknown> {
  const base: Record<string, unknown> = {}

  if (type === 'llm') {
    base.model = model
    base.temperature = parseFloat((0.5 + rng() * 0.5).toFixed(2))
    base.tokens = Math.floor(200 + rng() * 2800)
    base.prompt = `You are an AI assistant. Task: ${name.replace(/_/g, ' ')}.\n\nProcess the following input carefully and return a structured JSON response that conforms to the expected output schema.\n\nInput data will be provided in the user message. Ensure all required fields are populated and validated before returning.`
    base.output = JSON.stringify(
      {
        result: 'Processed successfully',
        confidence: parseFloat((0.7 + rng() * 0.29).toFixed(3)),
        items: Math.floor(1 + rng() * 20),
        processing_time_ms: Math.floor(100 + rng() * 900),
      },
      null,
      2
    )
  } else if (type === 'http') {
    const paths: Record<string, string> = {
      retrieve_supplier_page: 'https://suppliers.example.com/api/v2/products/catalog',
      web_search_verify: 'https://search-api.example.com/v1/verify?q=product_match',
      http_fetch_sources: 'https://research-api.example.com/v1/sources/fetch',
      http_submit_render: 'https://render.example.com/api/jobs/submit',
    }
    base.url = paths[name] || `https://api.example.com/${name.replace(/_/g, '/')}`
    base.method = rng() > 0.3 ? 'GET' : 'POST'
    base.status_code = status === 'error' ? (rng() > 0.5 ? 503 : 500) : 200
    base.latency_ms = Math.floor(80 + rng() * 400)
    base.response_preview = JSON.stringify(
      { status: 'ok', data: [{ id: 1, value: 'sample_result' }], count: 1 },
      null,
      2
    )
  } else if (type === 'tool') {
    base.tool_name = name
    base.input = JSON.stringify(
      { query: name.replace(/_/g, ' '), limit: 10, format: 'json' },
      null,
      2
    )
    base.output = JSON.stringify(
      {
        success: true,
        count: Math.floor(1 + rng() * 15),
        path: `/output/${name}_result.json`,
        bytes_written: Math.floor(1024 + rng() * 8192),
      },
      null,
      2
    )
  } else {
    // transform
    base.input_schema = JSON.stringify(
      { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } }, required: ['data'] },
      null,
      2
    )
    base.output_schema = JSON.stringify(
      { type: 'object', properties: { normalized: { type: 'array', items: { type: 'object' } }, count: { type: 'number' } }, required: ['normalized', 'count'] },
      null,
      2
    )
    base.rows_in = Math.floor(10 + rng() * 90)
    base.rows_out = Math.floor(8 + rng() * 85)
  }

  if (status === 'error') {
    const errors = [
      { message: 'Connection timeout: upstream service unavailable after 30s', code: 'ERR_TIMEOUT' },
      { message: 'Rate limit exceeded: 429 Too Many Requests from provider', code: 'ERR_RATE_LIMIT' },
      { message: 'Invalid response schema: expected array got null', code: 'ERR_SCHEMA_MISMATCH' },
      { message: 'Authentication failed: API key revoked or expired', code: 'ERR_AUTH_FAILED' },
    ]
    const err = errors[Math.floor(rng() * errors.length)]
    base.error_message = err.message
    base.error_code = err.code
    base.error_stack = `Error: ${err.message}\n    at StepRunner.execute (runner.ts:142)\n    at WorkflowEngine.run (engine.ts:89)`
  }

  if (status === 'degraded') {
    base.warning = 'Response latency exceeded threshold (>5s). Step completed but performance SLA violated.'
    base.latency_ms_actual = Math.floor(5000 + rng() * 15000)
  }

  return base
}

function generateRuns(): { runs: Run[]; steps: Record<string, RunStep[]> } {
  const runs: Run[] = []
  const steps: Record<string, RunStep[]> = {}
  const now = Date.now()
  const thirtyDays = 30 * 24 * 3600 * 1000

  for (let i = 0; i < 80; i++) {
    const rng = seededRng(i * 9973 + 1337)
    const wf = WORKFLOWS[i % 3]
    const status = STATUS_POOL[i % STATUS_POOL.length]
    const agoMs = rng() * thirtyDays
    const startedAt = new Date(now - agoMs)
    const durationMs = Math.floor(2000 + rng() * 43000)
    const finishedAt = new Date(startedAt.getTime() + durationMs)
    const totalTokens = Math.floor(800 + rng() * 17200)
    const estimatedCost = parseFloat(
      (totalTokens * 0.000004 + 0.001 + rng() * 0.075).toFixed(4)
    )
    const model = MODELS[i % MODELS.length]
    const promptVersion = PROMPT_VERSIONS[i % PROMPT_VERSIONS.length]

    const runId = `run-${(i + 1).toString().padStart(3, '0')}-${Math.abs(seededRng(i)() * 0xffffff | 0).toString(16).padStart(6, '0')}`

    const run: Run = {
      id: runId,
      workflowId: wf.id,
      status,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      modelPrimary: model,
      estimatedCost,
      promptVersion,
      totalTokens,
      durationMs,
    }
    runs.push(run)

    // Build steps
    const defs = STEP_DEFS[wf.id]
    const numSteps = Math.floor(4 + rng() * (defs.length - 3))
    const runSteps: RunStep[] = []
    let stepStart = startedAt.getTime()

    for (let j = 0; j < numSteps; j++) {
      const def = defs[j]
      const isLast = j === numSteps - 1
      const stepDur = Math.floor((durationMs / numSteps) * (0.5 + rng()))
      const stepEnd = stepStart + stepDur
      const stepStatus: RunStep['status'] =
        isLast && status === 'error'
          ? 'error'
          : isLast && status === 'degraded'
          ? 'degraded'
          : 'success'

      const stepRng = seededRng(i * 1000 + j * 97)
      const meta = buildStepMeta(def.t, def.n, model, stepStatus, stepRng)

      runSteps.push({
        id: `step-${runId}-${j}`,
        runId,
        index: j,
        type: def.t,
        name: def.n,
        status: stepStatus,
        startedAt: new Date(stepStart).toISOString(),
        finishedAt: new Date(stepEnd).toISOString(),
        durationMs: stepDur,
        meta,
      })
      stepStart = stepEnd
    }
    steps[runId] = runSteps
  }

  return { runs, steps }
}

const { runs: GENERATED_RUNS, steps: GENERATED_STEPS } = generateRuns()

export const RUNS: Run[] = GENERATED_RUNS
export const STEPS: Record<string, RunStep[]> = GENERATED_STEPS

export const PROMPT_VERSIONS_DATA: Record<string, PromptVersion[]> = {
  wf1: [
    {
      id: 'pv-wf1-v1',
      workflowId: 'wf1',
      version: 'v1',
      createdAt: '2025-01-15T10:00:00Z',
      promptText: `You are a product catalog assistant.
Given a supplier product page, extract the following fields:
- product_name
- sku
- price
- description

Return as JSON.`,
    },
    {
      id: 'pv-wf1-v2',
      workflowId: 'wf1',
      version: 'v2',
      createdAt: '2025-02-01T14:00:00Z',
      promptText: `You are an expert product catalog enrichment AI.
Given a supplier product page HTML and metadata, extract and enrich:
- product_name (normalized, title case)
- sku (standardized format)
- price (with currency code)
- description (cleaned, max 200 chars)
- category (inferred from content)
- attributes (key-value pairs)

Return valid JSON. If a field is missing, use null.
Prioritize accuracy over completeness.`,
    },
    {
      id: 'pv-wf1-v3',
      workflowId: 'wf1',
      version: 'v3',
      createdAt: '2025-03-01T09:00:00Z',
      promptText: `You are an expert product catalog enrichment AI with deep knowledge of e-commerce taxonomies.

Given supplier product page content, perform comprehensive extraction and enrichment:
- product_name: Normalized, title case, remove supplier codes
- sku: Standardize to format XXX-NNNNNN
- price: Include currency, handle ranges with min/max
- description: Cleaned prose, max 200 chars, no HTML
- category: Use Google Product Taxonomy (level 3)
- attributes: Structured key-value pairs (color, material, dimensions)
- confidence_score: 0.0-1.0 based on data completeness
- flags: Array of data quality issues found

Return valid JSON matching the ProductCatalogItem schema.
Validate all fields before returning.
If extraction confidence < 0.5, set needs_review: true.`,
    },
  ],
  wf2: [
    {
      id: 'pv-wf2-v1',
      workflowId: 'wf2',
      version: 'v1',
      createdAt: '2025-01-20T10:00:00Z',
      promptText: `Write a short ad script for the product.
Make it engaging and suitable for social media.
Length: 30-60 seconds.`,
    },
    {
      id: 'pv-wf2-v2',
      workflowId: 'wf2',
      version: 'v2',
      createdAt: '2025-02-10T12:00:00Z',
      promptText: `You are a UGC (User Generated Content) ad script specialist.

Given a product brief, write a compelling 30-45 second video script:
- Hook: First 3 seconds must grab attention (question, bold claim, or visual cue)
- Problem: Identify the pain point the product solves
- Solution: Demonstrate the product naturally
- CTA: Clear call-to-action

Tone: Authentic, conversational, not corporate.
Format: Include [VISUAL] and [VOICEOVER] markers.`,
    },
    {
      id: 'pv-wf2-v3',
      workflowId: 'wf2',
      version: 'v3',
      createdAt: '2025-03-05T15:00:00Z',
      promptText: `You are a senior UGC creative director specializing in high-conversion video ads.

Given a product brief and target audience data, craft a 25-40 second TikTok/Reels script:

Structure (time-coded):
[0-3s] HOOK: Pattern interrupt — use one of: surprising statistic, bold claim, question, or emotional trigger
[3-12s] PROBLEM: Visceral pain point articulation — make viewer feel seen
[12-25s] SOLUTION: Natural product integration — show, don't tell
[25-35s] PROOF: Quick social proof element (reviews, before/after, numbers)
[35-40s] CTA: Urgency-driven call to action

Format each section with:
- [SCENE]: Visual description for creator
- [AUDIO]: Voiceover or on-screen text
- [ENERGY]: Pacing note (fast/slow/dynamic)

Also output: hook_variants (3 alternative hooks), hashtag_suggestions (5 relevant tags)`,
    },
  ],
  wf3: [
    {
      id: 'pv-wf3-v1',
      workflowId: 'wf3',
      version: 'v1',
      createdAt: '2025-02-01T10:00:00Z',
      promptText: `Research the given topic and provide a summary.
Include key facts and findings.
Be concise and accurate.`,
    },
    {
      id: 'pv-wf3-v2',
      workflowId: 'wf3',
      version: 'v2',
      createdAt: '2025-02-20T11:00:00Z',
      promptText: `You are a research assistant AI.
Given a research query and source documents, produce:
- Executive summary (3-5 sentences)
- Key findings (bullet points)
- Named entities (people, organizations, locations)
- Confidence level for each claim

Cite sources inline using [Source N] notation.
Flag any conflicting information.`,
    },
    {
      id: 'pv-wf3-v3',
      workflowId: 'wf3',
      version: 'v3',
      createdAt: '2025-03-10T08:00:00Z',
      promptText: `You are an expert research analyst AI with rigorous standards for evidence-based synthesis.

Given a research query and multiple source documents:

1. EXECUTIVE SUMMARY (3-5 sentences): Synthesize the most important findings. Lead with the most significant insight.

2. KEY FINDINGS: Structured findings with:
   - claim: The specific finding
   - evidence: Supporting data/quotes
   - confidence: high/medium/low
   - sources: Array of source IDs

3. ENTITY EXTRACTION:
   - persons: Name, role, relevance
   - organizations: Name, type, relationship to topic
   - locations: Name, context
   - dates_events: Timeline of key events

4. KNOWLEDGE GAPS: What questions remain unanswered?

5. CONTRADICTIONS: Flag conflicting claims across sources

Output as structured JSON matching ResearchOutput schema.
Do not hallucinate. Use null for uncertain fields.`,
    },
  ],
}