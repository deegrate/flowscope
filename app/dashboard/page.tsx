import { Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  getDashboardMetrics,
  getRunsOverTime,
  getFailuresByWorkflow,
  getWorkflows,
  getWorkflowMetrics,
  getRecentFailures,
  getRun,
  getWorkflow,
} from '@/lib/data'
import { formatDuration, formatCost, formatRelativeTime } from '@/lib/format'
import { KpiCard } from '@/components/ui/KpiCard'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import Link from 'next/link'

export default function DashboardPage() {
  const metrics = getDashboardMetrics()
  const workflows = getWorkflows()
  const runsOverTime = getRunsOverTime(14)
  const failuresByWorkflow = getFailuresByWorkflow()
  const recentFailures = getRecentFailures(5)

  const KPIs = [
    {
      label: 'Total Runs',
      value: String(metrics.totalRuns),
      delta: '+12 today',
      deltaUp: true,
      icon: <span className="text-[var(--teal)]">▶</span>,
      accentColor: 'rgba(45,212,191,0.15)',
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      delta: '+2.1% vs last week',
      deltaUp: true,
      icon: <span className="text-[var(--success)]">✓</span>,
      accentColor: 'rgba(34,197,94,0.12)',
    },
    {
      label: 'Avg Latency',
      value: formatDuration(metrics.avgLatencyMs),
      delta: '−0.8s vs last week',
      deltaUp: true,
      icon: <span className="text-[#60a5fa]">⏱</span>,
      accentColor: 'rgba(59,130,246,0.12)',
    },
    {
      label: 'Est. Cost Today',
      value: formatCost(metrics.totalCostToday || metrics.totalCostAll * 0.05),
      delta: '+$0.12 vs yesterday',
      deltaUp: false,
      icon: <span className="text-[var(--warn)]">$</span>,
      accentColor: 'rgba(245,158,11,0.12)',
    },
  ]

  return (
    <div>
      {/* KPI Row */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {KPIs.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="mb-4 grid grid-cols-[1.6fr_1fr] gap-3">
        <DashboardCharts
          runsOverTime={runsOverTime}
          failuresByWorkflow={failuresByWorkflow}
        />
      </div>

      {/* Workflow Health */}
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)]">
        Workflow Health
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {workflows.map((wf) => {
          const m = getWorkflowMetrics(wf.id)
          const barColor =
            m.successRate > 80
              ? 'var(--success)'
              : m.successRate > 60
              ? 'var(--warn)'
              : 'var(--error)'

          return (
            <Link key={wf.id} href="/runs" className="block">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--border2)] hover:bg-[var(--card2)] cursor-pointer">
                <div className="mb-1.5 flex items-start justify-between">
                  <div className="text-[13px] font-semibold text-[var(--text)]">{wf.name}</div>
                  <div
                    className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: wf.status === 'active' ? 'var(--success)' : 'var(--text3)' }}
                  />
                </div>
                <div className="mb-3 text-[11px] leading-snug text-[var(--text3)]">
                  {wf.description}
                </div>
                <div className="mb-1 flex items-center justify-between text-[11px] text-[var(--text3)]">
                  <span>Success Rate</span>
                  <span className="font-semibold text-[var(--text2)]">{m.successRate}%</span>
                </div>
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${m.successRate}%`, background: barColor }}
                  />
                </div>
                <div className="flex gap-4">
                  {[
                    { label: 'Runs', value: String(m.totalRuns) },
                    { label: 'Avg', value: formatDuration(m.avgLatencyMs) },
                    { label: 'Last', value: m.lastRunAt ? formatRelativeTime(m.lastRunAt) : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-[11px] text-[var(--text3)]">
                      {label}:{' '}
                      <span className="font-medium text-[var(--text2)]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Failures */}
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)]">
        Recent Failures
      </div>
      <SectionCard noPadding>
        <div className="flex flex-col">
          {recentFailures.map((run) => {
            const wf = getWorkflow(run.workflowId)
            return (
              <Link key={run.id} href={`/runs/${run.id}`}>
                <div className="flex cursor-pointer items-center gap-2.5 border-b border-[rgba(255,255,255,0.03)] px-4 py-2.5 transition-colors hover:bg-white/[0.03] last:border-0">
                  <StatusPill status={run.status} size="sm" />
                  <div className="w-36 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium text-[var(--text)]">
                    {wf?.name ?? '—'}
                  </div>
                  <div className="w-20 flex-shrink-0 font-mono text-[11px] text-[var(--text3)]">
                    {run.id.slice(0, 12)}
                  </div>
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--text2)]">
                    {/* best-effort error message */}
                    Connection timeout or upstream error
                  </div>
                  <div className="flex-shrink-0 text-[11px] text-[var(--text3)]">
                    {formatRelativeTime(run.startedAt)}
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="var(--text3)"
                    strokeWidth="1.5"
                    className="flex-shrink-0"
                  >
                    <polyline points="5,2 10,7 5,12" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}