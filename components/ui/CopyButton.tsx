'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export function CopyButton({ text, className, label = 'copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded border border-[var(--border)] px-1.5 py-0.5 text-[11px] transition-colors',
        copied
          ? 'border-[rgba(45,212,191,0.4)] text-[var(--teal)]'
          : 'text-[var(--text3)] hover:border-[var(--border2)] hover:text-[var(--teal)]',
        className
      )}
    >
      {copied ? '✓ copied' : label}
    </button>
  )
}