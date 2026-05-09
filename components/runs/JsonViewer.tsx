'use client'

import { useState } from 'react'

interface JsonViewerProps {
  data: unknown
  initiallyExpanded?: boolean
}

export function JsonViewer({ data, initiallyExpanded = true }: JsonViewerProps) {
  const json = JSON.stringify(data, null, 2)

  return (
    <pre className="max-h-64 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text2)] whitespace-pre-wrap break-all">
      {json}
    </pre>
  )
}