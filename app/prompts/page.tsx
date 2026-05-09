'use client'

import { useState, useMemo } from 'react'
import { getWorkflows, getPromptVersions, getRuns } from '@/lib/data'
import { formatDuration, formatCost } from '@/lib/format'
import { PromptVersionList } from '@/components/prompts/PromptVersionList'
import { PromptDiffPanel } from '@/components/prompts/PromptDiffPanel'

export default function PromptsPage() {
  const workflows = getWorkflows()
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflows[0]?.id ?? '')

  const versions = useMemo(
    () => getPromptVersions(selectedWorkflowId),
    [selectedWorkflowId]
  )

  const defaultLeft = versions[versions.length - 2]?.version ?? versions[0]?.version ?? 'v1'
  const defaultRight = versions[versions.length - 1]?.version ?? 'v1'

  const [leftVersion, setLeftVersion] = useState(defaultLeft)
  const [rightVersion, setRightVersion] = useState(defaultRight)

  const handleWorkflowChange = (id: string) => {
    setSelectedWorkflowId(id)
    const vv = getPromptVersions(id)
    setLeftVersion(vv[vv.length - 2]?.version ?? vv[0]?.version ?? 'v1')
    setRightVersion(vv[vv.length - 1]?.version ?? 'v1')
  }

  const handleToggleVersion = (ver: string) => {
    if (leftVersion === ver) {
      setLeftVersion(rightVersion === 'v1' ? 'v2' : 'v1')
    } else if (rightVersion === ver) {
      setRightVersion(versions[versions.length - 1]?.version ?? 'v3')
    } else {
      setRightVersion(ver)
    }
  }

  // Compute metrics for diff panel
  const metrics = useMemo(() => {
    const leftRuns = getRuns({ workflowId: selectedWorkflowId }).filter(
      (r) => r.promptVersion === leftVersion
    )
    const rightRuns = getRuns({ workflowId: selectedWorkflowId }).filter(
      (r) => r.promptVersion === rightVersion
    )

    const lSr = leftRuns.length
      ? Math.round((leftRuns.filter((r) => r.status === 'success').length / leftRuns.length) * 100)
      : 0
    const rSr = rightRuns.length
      ? Math.round((rightRuns.filter((r) => r.status === 'success').length / rightRuns.length) * 100)
      : 0

    const lAvgDur = leftRuns.length
      ? Math.round(leftRuns.reduce((a, r) => a + r.durationMs, 0) / leftRuns.length)
      : 0
    const rAvgDur = rightRuns.length
      ? Math.round(rightRuns.reduce((a, r) => a + r.durationMs, 0) / rightRuns.length)
      : 0

    const lAvgCost = leftRuns.length
      ? leftRuns.reduce((a, r) => a + r.estimatedCost, 0) / leftRuns.length
      : 0
    const rAvgCost = rightRuns.length
      ? rightRuns.reduce((a, r) => a + r.estimatedCost, 0) / rightRuns.length
      : 0

    const srDelta = rSr - lSr
    const durDelta = rAvgDur - lAvgDur
    const costDelta = rAvgCost - lAvgCost

    return [
      {
        label: 'Success Rate',
        leftVal: `${lSr}%`,
        rightVal: `${rSr}%`,
        delta: `${srDelta >= 0 ? '+' : ''}${srDelta}%`,
        positive: srDelta >= 0,
      },
      {
        label: 'Avg Latency',
        leftVal: formatDuration(lAvgDur),
        rightVal: formatDuration(rAvgDur),
        delta: `${durDelta >= 0 ? '+' : ''}${formatDuration(Math.abs(durDelta))}`,
        positive: durDelta <= 0,
      },
      {
        label: 'Avg Cost',
        leftVal: formatCost(lAvgCost),
        rightVal: formatCost(rAvgCost),
        delta: `${costDelta >= 0 ? '+' : ''}${formatCost(Math.abs(costDelta))}`,
        positive: costDelta <= 0,
      },
    ]
  }, [selectedWorkflowId, leftVersion, rightVersion])

  const leftVerObj = versions.find((v) => v.version === leftVersion)
  const rightVerObj = versions.find((v) => v.version === rightVersion)

  return (
    <div
      className="grid gap-3.5"
      style={{ gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 130px)' }}
    >
      {/* Left panel */}
      <div className="flex flex-col gap-3 overflow-hidden">
        <select
          value={selectedWorkflowId}
          onChange={(e) => handleWorkflowChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card2)] px-2.5 py-2 text-[13px] text-[var(--text)] outline-none"
        >
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <div className="mb-2.5 text-[12px] font-semibold text-[var(--text)]">Versions</div>
          <PromptVersionList
            versions={versions}
            leftVersion={leftVersion}
            rightVersion={rightVersion}
            onToggleVersion={handleToggleVersion}
          />
        </div>
      </div>

      {/* Right panel */}
      <PromptDiffPanel
        leftVersion={leftVerObj}
        rightVersion={rightVerObj}
        leftLabel={leftVersion}
        rightLabel={rightVersion}
        onLeftChange={setLeftVersion}
        onRightChange={setRightVersion}
        versions={versions}
        metrics={metrics}
      />
    </div>
  )
}