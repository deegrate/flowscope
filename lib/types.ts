export type WorkflowStatus = 'active' | 'inactive'
export type RunStatus = 'success' | 'error' | 'degraded'
export type StepType = 'llm' | 'tool' | 'http' | 'transform'
export type StepStatus = 'success' | 'error' | 'degraded'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  createdAt: string
}

export interface Run {
  id: string
  workflowId: string
  status: RunStatus
  startedAt: string
  finishedAt: string
  modelPrimary: string
  estimatedCost: number
  promptVersion: string
  totalTokens: number
  durationMs: number
}

export interface RunStep {
  id: string
  runId: string
  index: number
  type: StepType
  name: string
  status: StepStatus
  startedAt: string
  finishedAt: string
  durationMs: number
  meta: Record<string, unknown>
}

export interface PromptVersion {
  id: string
  workflowId: string
  version: string
  promptText: string
  createdAt: string
}

export interface WorkflowMetrics {
  workflowId: string
  successRate: number
  avgLatencyMs: number
  avgCost: number
  totalRuns: number
  lastRunAt: string | null
}

export interface DashboardMetrics {
  totalRuns: number
  successRate: number
  avgLatencyMs: number
  totalCostToday: number
  totalCostAll: number
}

export interface RunsOverTimePoint {
  date: string
  count: number
  success: number
  error: number
  degraded: number
}

export interface FailuresByWorkflow {
  workflowId: string
  workflowName: string
  failures: number
}

export interface DiffLine {
  type: 'add' | 'remove' | 'unchanged'
  text: string
  lineNum: number
}