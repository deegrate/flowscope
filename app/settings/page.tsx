const INTEGRATIONS = [
  {
    name: 'n8n',
    icon: '🔀',
    description:
      'Connect workflow automation and trigger FlowScope traces from n8n workflows.',
  },
  {
    name: 'Node Agent Runner',
    icon: '⬡',
    description:
      'Run and trace custom Node.js AI agents with built-in step observability and token tracking.',
  },
  {
    name: 'Gemini',
    icon: '◈',
    description:
      'Direct integration with Google Gemini API for automatic token counting and cost tracking.',
  },
  {
    name: 'Claude',
    icon: '◎',
    description:
      'Anthropic Claude API integration with prompt version management and run attribution.',
  },
  {
    name: 'Ollama',
    icon: '▣',
    description:
      'Local model observability for Ollama-hosted models including llama3, mistral, and custom checkpoints.',
  },
]

const SAMPLE_PAYLOAD = `{
  "workflow_id": "wf_abc123",
  "run_id": "run_xyz789",
  "status": "success",
  "started_at": "2025-03-15T10:30:00Z",
  "finished_at": "2025-03-15T10:30:14Z",
  "model_primary": "gemini-2.5-pro",
  "prompt_version": "v3",
  "total_tokens": 4821,
  "estimated_cost": 0.0193,
  "steps": [
    {
      "index": 0,
      "type": "llm",
      "name": "extract_product_data",
      "status": "success",
      "duration_ms": 3420,
      "meta": {
        "model": "gemini-2.5-pro",
        "temperature": 0.7,
        "tokens": 1840,
        "prompt": "Extract product fields from...",
        "output": "{ \\"product_name\\": \\"Widget Pro X\\" }"
      }
    }
  ]
}`

export default function SettingsPage() {
  return (
    <div>
      {/* Integrations */}
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)]">
        Integrations
      </div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {INTEGRATIONS.map((int) => (
          <div
            key={int.name}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[18px]">
              {int.icon}
            </div>
            <div className="mb-1 text-[13px] font-semibold text-[var(--text)]">{int.name}</div>
            <div className="mb-3 text-[11px] leading-snug text-[var(--text3)]">
              {int.description}
            </div>
            <button
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-[var(--border)] bg-white/[0.04] px-3 py-1.5 text-[12px] text-[var(--text3)]"
            >
              Configure
              <span className="rounded bg-[rgba(245,158,11,0.12)] px-1 py-px text-[10px] text-[var(--warn)]">
                Soon
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Ingestion API */}
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)]">
        Ingestion API
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[13px] text-[var(--text2)]">
          Send trace data to FlowScope programmatically via the REST API.
        </p>

        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5">
          <span className="rounded bg-[rgba(59,130,246,0.15)] px-2 py-px font-mono text-[11px] font-semibold text-[#60a5fa]">
            POST
          </span>
          <span className="flex-1 font-mono text-[13px] text-[var(--text2)]">
            https://flowscope.app/api/ingest
          </span>
          <span className="rounded bg-[rgba(245,158,11,0.12)] px-2 py-px text-[10px] font-semibold text-[var(--warn)]">
            DEMO ONLY
          </span>
        </div>

        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.4px] text-[var(--text3)]">
          Sample Payload
        </div>
        <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[11px] leading-relaxed text-[var(--text2)]">
          {SAMPLE_PAYLOAD}
        </pre>
      </div>
    </div>
  )
}