'use client'

import React, { useState } from 'react'
import { notFound } from 'next/navigation'
import { getRun, getSteps } from '@/lib/data'
import { RunSummaryCard } from '@/components/runs/RunSummaryCard'
import { StepTimeline } from '@/components/runs/StepTimeline'
import { StepInspector } from '@/components/runs/StepInspector'

interface RunDetailPageProps {
  params: { id: string }
}

export default function RunDetailPage({ params }: RunDetailPageProps) {
  const { id } = React.use(params as any)
  const run = getRun(id)
  if (!run) notFound()

  const steps = getSteps(run.id)
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    steps[0]?.id ?? null
  )

  const selectedStep = steps.find((s) => s.id === selectedStepId) ?? null

  return (
    <div>
      <RunSummaryCard run={run} />
      <div className="grid h-[calc(100vh-380px)] min-h-[400px] grid-cols-[1fr_1.2fr] gap-3.5">
        <StepTimeline
          steps={steps}
          selectedStepId={selectedStepId}
          onSelectStep={setSelectedStepId}
        />
        <StepInspector step={selectedStep} />
      </div>
    </div>
  )
}