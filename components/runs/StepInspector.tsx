'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { JsonViewer } from './JsonViewer'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { RunStep } from '@/lib/types'

const TYPE_ICONS: Record<RunStep['type'], string> = {
  llm: '◈',
  tool: '⬡',
  http: '↗',
  transform: '⇄',
}

const TYPE_LABELS: Record<RunStep['type'], string> = {
  llm: 'LLM',
  tool: 'Tool',
  http: 'HTTP',
  transform: 'Transform',
}

function LLMInspector({ step }: { step: RunStep }) {
  const m = step.meta
  return (
    <>
      <div className="insp-field">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.5px] text-[var(--text3)]">Model</span>
          <span className="inline-block rounded border border-[var(--border)] bg-white/[0.06] px-1.5 py-px font-mono text-[11px] text-[var(--text2)]">
            {String(m.model ?? '—')}
          </span>
          <span className="inline-block rounded border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.12)] px-1.5 py-px font-mono text-[11px] text-[var(--warn)]">
            temp {String(m.temperature ?? 0.7)}
          </span>
        </div>
      </div>

      <Field label="Prompt">
        <CodeBlock>{String(m.prompt ?? '—')}</CodeBlock>
      </Field>

      <Field label="Output">
        <CodeBlock>{String(m.output ?? '—')}</CodeBlock>
      </Field>

      <Field label="Tokens">
        <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--text)]">
          {String(m.tokens ?? 0)}
        </span>
      </Field>
    </>
  )
}

function HTTPInspector({ step }: { step: RunStep }) {
  const m = step.meta
  const sc = Number(m.status_code ?? 200)
  const isErr = sc >= 400
  const method = String(m.method ?? 'GET')

  return (
    <>
      <Field label="Method & URL">
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              'rounded px-2 py-px font-mono text-[11px] font-semibold',
              method === 'GET'
                ? 'bg-[rgba(34,197,94,0.15)] text-[var(--success)]'
                : 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa]'
            )}
          >
            {method}
          </span>
          <span className="overflow-hidden text-ellipsis font-mono text-[11px] text-[var(--text2)]">
            {String(m.url ?? '—')}
          </span>
        </div>
      </Field>

      <Field label="Status Code">
        <span
          className={cn(
            'font-mono text-[13px] font-semibold tabular-nums',
            isErr ? 'text-[var(--error)]' : 'text-[var(--success)]'
          )}
        >
          {sc}
        </span>
        {m.latency_ms && (
          <span className="ml-2 text-[11px] text-[var(--text3)]">
            in {formatDuration(Number(m.latency_ms))}
          </span>
        )}
      </Field>

      <Field label="Response Preview">
        <CodeBlock>{String(m.response_preview ?? '—')}</CodeBlock>
      </Field>
    </>
  )
}

function ToolInspector({ step }: { step: RunStep }) {
  const m = step.meta
  return (
    <>
      <Field label="Tool Name">
        <span className="font-mono text-[13px] text-[var(--teal)]">
          {String(m.tool_name ?? '—')}
        </span>
      </Field>

      <Field label="Input">
        <CodeBlock>{String(m.input ?? '—')}</CodeBlock>
      </Field>

      <Field label="Output">
        <CodeBlock>{String(m.output ?? '—')}</CodeBlock>
      </Field>
    </>
  )
}

function TransformInspector({ step }: { step: RunStep }) {
  const m = step.meta
  return (
    <>
      <Field label="Input Schema">
        <CodeBlock>{String(m.input_schema ?? '—')}</CodeBlock>
      </Field>

      <Field label="Output Schema">
        <CodeBlock>{String(m.output_schema ?? '—')}</CodeBlock>
      </Field>

      <div className="flex gap-4">
        <div>
          <div className="mb-0.5 text-[10px] uppercase tracking-[0.5px] text-[var(--text3)]">Rows In</div>
          <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--text)]">
            {String(m.rows_in ?? '—')}
          </span>
        </div>
        <div>
          <div className="mb-0.5 text-[10px] uppercase tracking-[0.5px] text-[var(--text3)]">Rows Out</div>
          <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--text)]">
            {String(m.rows_out ?? '—')}
          </span>
        </div>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.5px] text-[var(--text3)]">{label}</div>
      {children}
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="max-h-44 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text2)] whitespace-pre-wrap break-all">
      {children}
    </pre>
  )
}

interface StepInspectorProps {
  step: RunStep | null
}

export function StepInspector({ step }: StepInspectorProps) {
  const [showRaw, setShowRaw] = useState(false)

  if (!step) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[13px] text-[var(--text3)]">
        Select a step to inspect
      </div>
    )
  }

  const hasError = step.status === 'error'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <span className="text-[14px]">{TYPE_ICONS[step.type]}</span>
        <span className="text-[12px] font-semibold text-[var(--text)]">{step.name}</span>
        <span className="ml-1 rounded bg-white/[0.06] px-1.5 py-px text-[10px] text-[var(--text3)]">
          {TYPE_LABELS[step.type]}
        </span>
        <div className="flex-1" />
        <span className="font-mono text-[11px] tabular-nums text-[var(--text3)]">
          {formatDuration(step.durationMs)}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {/* Error block */}
            {hasError && (
              <div className="mb-3.5 rounded-lg border border-[rgba(239,68,68,0.3)] bg-[var(--error-bg)] p-3 font-mono text-[12px] text-[var(--error)]">
                <span className="mr-2">✕</span>
                {String(step.meta.error_message ?? 'Unknown error')}
                {step.meta.error_code && (
                  <span className="ml-2 opacity-60">({String(step.meta.error_code)})</span>
                )}
              </div>
            )}

            {/* Warning block */}
            {step.status === 'degraded' && step.meta.warning && (
              <div className="mb-3.5 rounded-lg border border-[rgba(245,158,11,0.3)] bg-[var(--warn-bg)] p-3 font-mono text-[12px] text-[var(--warn)]">
                ⚠ {String(step.meta.warning)}
              </div>
            )}

            {step.type === 'llm' && <LLMInspector step={step} />}
            {step.type === 'http' && <HTTPInspector step={step} />}
            {step.type === 'tool' && <ToolInspector step={step} />}
            {step.type === 'transform' && <TransformInspector step={step} />}

            {/* Raw JSON toggle */}
            <button
              onClick={() => setShowRaw((v) => !v)}
              className="mt-1 text-[11px] text-[var(--teal)] hover:underline bg-transparent border-0 cursor-pointer p-0"
            >
              {showRaw ? '▲ Hide' : '▼ View'} Raw JSON
            </button>
            {showRaw && (
              <div className="mt-2">
                <JsonViewer data={step.meta} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}