'use client'

import { cn } from '@/lib/utils'
import { formatDateShort, formatDuration, formatCost } from '@/lib/format'
import { getRuns } from '@/lib/data'
import type { PromptVersion } from '@/lib/types'

interface PromptVersionListProps {
  versions: PromptVersion[]
  leftVersion: string
  rightVersion: string
  onToggleVersion: (ver: string) => void
}

export function PromptVersionList({
  versions,
  leftVersion,
  rightVersion,
  onToggleVersion,
}: PromptVersionListProps) {
  return (
    <div className="flex flex-col gap-1">
      {versions.map((v, i) => {
        const isCurrent = i === versions.length - 1
        const isLeft = leftVersion === v.version
        const isRight = rightVersion === v.version
        const isSelected = isLeft || isRight

        const wfRuns = getRuns({ workflowId: v.workflowId, search: '' }).filter(
          (r) => r.promptVersion === v.version
        )
        const sr = wfRuns.length
          ? Math.round(
              (wfRuns.filter((r) => r.status === 'success').length / wfRuns.length) * 100
            )
          : 0
        const avgDur = wfRuns.length
          ? Math.round(wfRuns.reduce((a, r) => a + r.durationMs, 0) / wfRuns.length)
          : 0

        return (
          <button
            key={v.id}
            onClick={() => onToggleVersion(v.version)}
            className={cn(
              'w-full rounded-lg border p-3 text-left transition-all',
              isSelected
                ? 'border-[rgba(45,212,191,0.25)] bg-[var(--teal-dim)]'
                : 'border-transparent hover:bg-white/[0.03]'
            )}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[13px] font-semibold text-[var(--text)]">
                {v.version}
              </span>
              <div className="flex items-center gap-1.5">
                {isCurrent && (
                  <span className="rounded bg-[var(--teal-dim)] px-1.5 py-px text-[10px] font-semibold text-[var(--teal)]">
                    CURRENT
                  </span>
                )}
                {isLeft && (
                  <span className="text-[10px] font-medium text-[var(--text3)]">L</span>
                )}
                {isRight && (
                  <span className="text-[10px] font-medium text-[var(--teal)]">R</span>
                )}
              </div>
            </div>
            <div className="flex gap-3 text-[11px] text-[var(--text3)]">
              <span>{formatDateShort(v.createdAt)}</span>
              <span>SR: {sr}%</span>
              <span>{formatDuration(avgDur)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
