'use client'

import { StatusPill } from '@/components/ui/StatusPill'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { RunStep } from '@/lib/types'

const TYPE_ICONS: Record<RunStep['type'], string> = {
  llm: '◈',
  tool: '⬡',
  http: '↗',
  transform: '⇄',
}

const TYPE_BG: Record<RunStep['type'], string> = {
  llm: 'rgba(59,130,246,0.18)',
  tool: 'rgba(45,212,191,0.15)',
  http: 'rgba(245,158,11,0.15)',
  transform: 'rgba(168,85,247,0.15)',
}

const TYPE_COLOR: Record<RunStep['type'], string> = {
  llm: '#60a5fa',
  tool: 'var(--teal)',
  http: 'var(--warn)',
  transform: '#c084fc',
}

function getPreview(step: RunStep): string {
  const m = step.meta
  if (step.type === 'llm' && typeof m.prompt === 'string') {
    return m.prompt.slice(0, 72) + (m.prompt.length > 72 ? '…' : '')
  }
  if (step.type === 'http' && typeof m.url === 'string') return m.url
  if (step.type === 'tool' && typeof m.tool_name === 'string') return m.tool_name
  if (step.type === 'transform') return `${m.rows_in ?? '?'} → ${m.rows_out ?? '?'} rows`
  return '—'
}

interface StepTimelineProps {
  steps: RunStep[]
  selectedStepId: string | null
  onSelectStep: (id: string) => void
}

export function StepTimeline({ steps, selectedStepId, onSelectStep }: StepTimelineProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)]">
        Step Timeline · {steps.length} steps
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {steps.map((step) => {
          const isActive = step.id === selectedStepId
          const isError = step.status === 'error'

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={cn(
                'mb-1 flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all',
                isActive
                  ? 'border-[rgba(45,212,191,0.3)] bg-[rgba(45,212,191,0.06)]'
                  : isError
                  ? 'border-l-[3px] border-l-[var(--error)] border-transparent hover:bg-white/[0.03]'
                  : 'border-transparent hover:bg-white/[0.03]'
              )}
            >
              {/* Step number */}
              <span className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-[var(--text3)]">
                {step.index + 1}
              </span>

              {/* Type icon */}
              <span
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[12px]"
                style={{ background: TYPE_BG[step.type], color: TYPE_COLOR[step.type] }}
              >
                {TYPE_ICONS[step.type]}
              </span>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium text-[var(--text)]">
                  {step.name}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--text3)]">
                  {getPreview(step)}
                </div>
              </div>

              {/* Right meta */}
              <div className="flex flex-shrink-0 flex-col items-end gap-1">
                <StatusPill status={step.status} size="sm" />
                <span className="font-mono text-[11px] tabular-nums text-[var(--text3)]">
                  {formatDuration(step.durationMs)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}