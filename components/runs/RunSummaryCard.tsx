import { CopyButton } from '@/components/ui/CopyButton'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDuration, formatCost, formatTokens, formatDate } from '@/lib/format'
import { getWorkflow, getSteps } from '@/lib/data'
import Link from 'next/link'
import type { Run } from '@/lib/types'

interface RunSummaryCardProps {
  run: Run
}

function buildSummary(run: Run, stepCount: number, failedStepName?: string): string {
  if (run.status === 'success') {
    return `Run completed successfully in ${formatDuration(run.durationMs)} across ${stepCount} steps using ${run.modelPrimary}. Total cost: ${formatCost(run.estimatedCost)}.`
  }
  if (run.status === 'error') {
    return `Run failed after ${formatDuration(run.durationMs)}${failedStepName ? ` in step "${failedStepName}"` : ''}. Check the step inspector for error details.`
  }
  return `Run completed with degraded performance in ${formatDuration(run.durationMs)}. Some steps exceeded latency thresholds — review timeline for details.`
}

export function RunSummaryCard({ run }: RunSummaryCardProps) {
  const workflow = getWorkflow(run.workflowId)
  const steps = getSteps(run.id)
  const failedStep = steps.find((s) => s.status === 'error')
  const summary = buildSummary(run, steps.length, failedStep?.name)

  const META = [
    { label: 'Model', value: run.modelPrimary, mono: true },
    { label: 'Prompt Version', value: run.promptVersion, mono: true },
    { label: 'Duration', value: formatDuration(run.durationMs), mono: true },
    { label: 'Est. Cost', value: formatCost(run.estimatedCost), mono: true },
    { label: 'Total Tokens', value: formatTokens(run.totalTokens), mono: true },
    { label: 'Steps', value: String(steps.length), mono: false },
    { label: 'Started', value: formatDate(run.startedAt), mono: false },
    { label: 'Finished', value: formatDate(run.finishedAt), mono: false },
  ]

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-3.5">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <span className="font-mono text-[13px] text-[var(--text2)]">{run.id}</span>
        <CopyButton text={run.id} />
        <StatusPill status={run.status} />
        <div className="flex-1" />
        <Link
          href="/runs"
          className="text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
        >
          ← Back to Runs
        </Link>
      </div>

      {/* Workflow link */}
      <div className="mb-3 text-[12px] text-[var(--text3)]">
        Workflow:{' '}
        <Link
          href="/runs"
          className="text-[var(--teal)] hover:underline"
        >
          {workflow?.name ?? '—'}
        </Link>
        <span className="ml-2 inline-block rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text3)]">
          {run.promptVersion}
        </span>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {META.map(({ label, value, mono }) => (
          <div
            key={label}
            className="rounded-lg bg-[var(--card2)] px-3 py-2.5"
          >
            <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.5px] text-[var(--text3)]">
              {label}
            </div>
            <div
              className={`text-[13px] font-semibold tabular-nums text-[var(--text)] ${
                mono ? 'font-mono' : ''
              }`}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Auto summary */}
      <div className="mt-3 rounded-lg border border-[rgba(45,212,191,0.15)] bg-[rgba(45,212,191,0.06)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--text2)]">
        ◈ {summary}
      </div>
    </div>
  )
}