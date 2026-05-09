import {
  WORKFLOWS,
  RUNS,
  STEPS,
  PROMPT_VERSIONS_DATA,
} from './seed'
import type {
  Workflow,
  Run,
  RunStep,
  PromptVersion,
  WorkflowMetrics,
  DashboardMetrics,
  RunsOverTimePoint,
  FailuresByWorkflow,
} from './types'

// ─── Workflows ────────────────────────────────────────────────────────────────

export function getWorkflows(): Workflow[] {
  return WORKFLOWS
}

export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((w) => w.id === id)
}

// ─── Runs ─────────────────────────────────────────────────────────────────────

export interface RunFilters {
  status?: Run['status'] | 'all'
  workflowId?: string | 'all'
  model?: string | 'all'
  search?: string
  startDate?: Date
  endDate?: Date
}

export function getRuns(filters?: RunFilters): Run[] {
  let result = [...RUNS]

  if (filters) {
    if (filters.status && filters.status !== 'all') {
      result = result.filter((r) => r.status === filters.status)
    }
    if (filters.workflowId && filters.workflowId !== 'all') {
      result = result.filter((r) => r.workflowId === filters.workflowId)
    }
    if (filters.model && filters.model !== 'all') {
      result = result.filter((r) => r.modelPrimary === filters.model)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((r) => {
        const wf = WORKFLOWS.find((w) => w.id === r.workflowId)
        return (
          r.id.toLowerCase().includes(q) ||
          (wf && wf.name.toLowerCase().includes(q))
        )
      })
    }
    if (filters.startDate) {
      result = result.filter(
        (r) => new Date(r.startedAt) >= filters.startDate!
      )
    }
    if (filters.endDate) {
      result = result.filter(
        (r) => new Date(r.startedAt) <= filters.endDate!
      )
    }
  }

  return result.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
}

export function getRun(id: string): Run | undefined {
  return RUNS.find((r) => r.id === id)
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export function getSteps(runId: string): RunStep[] {
  return (STEPS[runId] ?? []).sort((a, b) => a.index - b.index)
}

// ─── Prompt Versions ──────────────────────────────────────────────────────────

export function getPromptVersions(workflowId: string): PromptVersion[] {
  return (PROMPT_VERSIONS_DATA[workflowId] ?? []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export function getWorkflowMetrics(workflowId: string): WorkflowMetrics {
  const runs = RUNS.filter((r) => r.workflowId === workflowId)
  const successCount = runs.filter((r) => r.status === 'success').length
  const successRate = runs.length ? Math.round((successCount / runs.length) * 100) : 0
  const avgLatencyMs = runs.length
    ? Math.round(runs.reduce((acc, r) => acc + r.durationMs, 0) / runs.length)
    : 0
  const avgCost = runs.length
    ? runs.reduce((acc, r) => acc + r.estimatedCost, 0) / runs.length
    : 0
  const sorted = [...runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
  return {
    workflowId,
    successRate,
    avgLatencyMs,
    avgCost,
    totalRuns: runs.length,
    lastRunAt: sorted[0]?.startedAt ?? null,
  }
}

export function getDashboardMetrics(): DashboardMetrics {
  const total = RUNS.length
  const success = RUNS.filter((r) => r.status === 'success').length
  const successRate = total ? Math.round((success / total) * 100) : 0
  const avgLatencyMs = total
    ? Math.round(RUNS.reduce((acc, r) => acc + r.durationMs, 0) / total)
    : 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRuns = RUNS.filter((r) => new Date(r.startedAt) >= today)
  const totalCostToday = todayRuns.reduce((acc, r) => acc + r.estimatedCost, 0)
  const totalCostAll = RUNS.reduce((acc, r) => acc + r.estimatedCost, 0)
  return { totalRuns: total, successRate, avgLatencyMs, totalCostToday, totalCostAll }
}

export function getRunsOverTime(days: number): RunsOverTimePoint[] {
  const points: RunsOverTimePoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const next = new Date(date)
    next.setDate(next.getDate() + 1)

    const dayRuns = RUNS.filter((r) => {
      const d = new Date(r.startedAt)
      return d >= date && d < next
    })

    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: dayRuns.length,
      success: dayRuns.filter((r) => r.status === 'success').length,
      error: dayRuns.filter((r) => r.status === 'error').length,
      degraded: dayRuns.filter((r) => r.status === 'degraded').length,
    })
  }
  return points
}

export function getFailuresByWorkflow(): FailuresByWorkflow[] {
  return WORKFLOWS.map((wf) => ({
    workflowId: wf.id,
    workflowName: wf.name,
    failures: RUNS.filter(
      (r) => r.workflowId === wf.id && r.status !== 'success'
    ).length,
  }))
}

export function getUniqueModels(): string[] {
  return [...new Set(RUNS.map((r) => r.modelPrimary))].sort()
}

export function getRecentFailures(limit = 5): Run[] {
  return RUNS.filter((r) => r.status !== 'success')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit)
}