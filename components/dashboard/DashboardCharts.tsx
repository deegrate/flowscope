'use client'

import { useEffect, useRef } from 'react'
import type { RunsOverTimePoint, FailuresByWorkflow } from '@/lib/types'

interface DashboardChartsProps {
  runsOverTime: RunsOverTimePoint[]
  failuresByWorkflow: FailuresByWorkflow[]
}

declare global {
  interface Window {
    Chart: any
  }
}

export function DashboardCharts({ runsOverTime, failuresByWorkflow }: DashboardChartsProps) {
  const lineRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const lineChart = useRef<any>(null)
  const barChart = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const init = () => {
      if (!window.Chart) return

      // Destroy existing
      lineChart.current?.destroy()
      barChart.current?.destroy()

      if (lineRef.current) {
        lineChart.current = new window.Chart(lineRef.current, {
          type: 'line',
          data: {
            labels: runsOverTime.map((p) => p.date),
            datasets: [
              {
                label: 'Total',
                data: runsOverTime.map((p) => p.count),
                borderColor: '#2dd4bf',
                backgroundColor: 'rgba(45,212,191,0.08)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
              },
              {
                label: 'Errors',
                data: runsOverTime.map((p) => p.error),
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.4,
                borderDash: [4, 3],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 7 },
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#64748b', font: { size: 10 } },
              },
            },
          },
        })
      }

      if (barRef.current) {
        barChart.current = new window.Chart(barRef.current, {
          type: 'bar',
          data: {
            labels: failuresByWorkflow.map((f) =>
              f.workflowName.split(' ').slice(0, 2).join(' ')
            ),
            datasets: [
              {
                label: 'Failures',
                data: failuresByWorkflow.map((f) => f.failures),
                backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.5)'],
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 } },
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#64748b', font: { size: 10 } },
              },
            },
          },
        })
      }
    }

    if (window.Chart) {
      init()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      script.onload = init
      document.head.appendChild(script)
    }

    return () => {
      lineChart.current?.destroy()
      barChart.current?.destroy()
    }
  }, [runsOverTime, failuresByWorkflow])

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-3.5">
          <div className="text-[13px] font-semibold text-[var(--text)]">Runs Over Time</div>
          <div className="text-[11px] text-[var(--text3)]">Last 14 days</div>
        </div>
        <div className="relative h-[180px]">
          <canvas ref={lineRef} role="img" aria-label="Line chart showing run volume over the last 14 days">
            Run volume trend data.
          </canvas>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-3.5">
          <div className="text-[13px] font-semibold text-[var(--text)]">Failures by Workflow</div>
          <div className="text-[11px] text-[var(--text3)]">All time</div>
        </div>
        <div className="relative h-[180px]">
          <canvas ref={barRef} role="img" aria-label="Bar chart showing failure counts grouped by workflow">
            Failure counts per workflow.
          </canvas>
        </div>
      </div>
    </>
  )
}