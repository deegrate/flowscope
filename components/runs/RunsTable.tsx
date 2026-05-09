'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusPill } from '@/components/ui/StatusPill'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { getRuns, getWorkflows, getUniqueModels } from '@/lib/data'
import { formatDuration, formatCost, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Run } from '@/lib/types'

export function RunsTable() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Run['status'] | 'all'>('all')
  const [workflowFilter, setWorkflowFilter] = useState<string>('all')
  const [modelFilter, setModelFilter] = useState<string>('all')
  const [loading] = useState(false)

  const workflows = getWorkflows()
  const models = getUniqueModels()

  const runs = useMemo(
    () =>
      getRuns({
        status: statusFilter,
        workflowId: workflowFilter,
        model: modelFilter,
        search,
      }),
    [search, statusFilter, workflowFilter, modelFilter]
  )

  const workflowMap = useMemo(
    () => Object.fromEntries(workflows.map((w) => [w.id, w])),
    [workflows]
  )

  return (
    <div>
      {/* Filters */}
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search run ID or workflow…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text3)] focus:border-[var(--border2)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Run['status'] | 'all')}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[12px] text-[var(--text2)] outline-none focus:border-[var(--border2)]"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="degraded">Degraded</option>
        </select>
        <select
          value={workflowFilter}
          onChange={(e) => setWorkflowFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[12px] text-[var(--text2)] outline-none focus:border-[var(--border2)]"
        >
          <option value="all">All Workflows</option>
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[12px] text-[var(--text2)] outline-none focus:border-[var(--border2)]"
        >
          <option value="all">All Models</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <span className="text-[12px] text-[var(--text3)]">
          {runs.length} run{runs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        {loading ? (
          <div>
            <div className="grid grid-cols-7 border-b border-[var(--border)] px-3 py-2">
              {['Run ID', 'Workflow', 'Status', 'Model', 'Duration', 'Est. Cost', 'Started'].map(
                (h) => (
                  <span key={h} className="text-[11px] font-medium uppercase tracking-[0.4px] text-[var(--text3)]">
                    {h}
                  </span>
                )
              )}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <EmptyState
            icon="◎"
            title="No runs found"
            description="Try adjusting your filters or search query"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Run ID', 'Workflow', 'Status', 'Model', 'Duration', 'Est. Cost', 'Started', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="sticky top-0 bg-[var(--card)] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-[var(--text3)]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {runs.map((run, i) => (
                    <motion.tr
                      key={run.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      onClick={() => router.push(`/runs/${run.id}`)}
                      className={cn(
                        'cursor-pointer border-b border-[rgba(255,255,255,0.03)] transition-colors last:border-0',
                        'hover:bg-white/[0.025]'
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-[12px] text-[var(--text2)]">
                          {run.id.slice(0, 12)}
                        </span>
                      </td>
                      <td className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5">
                        <span className="text-[12px] text-[var(--text2)]">
                          {workflowMap[run.workflowId]?.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusPill status={run.status} size="sm" />
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-block rounded border border-[var(--border)] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text2)]">
                          {run.modelPrimary}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-[var(--text2)]">
                        {formatDuration(run.durationMs)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-[var(--text2)]">
                        {formatCost(run.estimatedCost)}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-[var(--text3)]">
                        {formatDate(run.startedAt)}
                      </td>
                      <td className="px-3 py-2.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="var(--text3)"
                          strokeWidth="1.5"
                        >
                          <polyline points="5,2 10,7 5,12" />
                        </svg>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}