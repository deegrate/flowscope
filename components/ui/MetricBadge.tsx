import { cn } from '@/lib/utils'

interface MetricBadgeProps {
  label: string
  value: string
  variant?: 'default' | 'teal' | 'warn' | 'error' | 'mono'
  className?: string
}

const VARIANTS = {
  default: 'bg-white/[0.06] text-[var(--text2)] border-[var(--border)]',
  teal: 'bg-[var(--teal-dim)] text-[var(--teal)] border-[rgba(45,212,191,0.2)]',
  warn: 'bg-[var(--warn-bg)] text-[var(--warn)] border-[rgba(245,158,11,0.2)]',
  error: 'bg-[var(--error-bg)] text-[var(--error)] border-[rgba(239,68,68,0.2)]',
  mono: 'bg-white/[0.06] text-[var(--text2)] border-[var(--border)] font-mono',
}

export function MetricBadge({ label, value, variant = 'default', className }: MetricBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px]',
        VARIANTS[variant],
        className
      )}
    >
      <span className="text-[var(--text3)]">{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  )
}