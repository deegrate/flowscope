import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  icon: ReactNode
  accentColor?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  delta,
  deltaUp,
  icon,
  accentColor = 'rgba(45,212,191,0.15)',
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4',
        className
      )}
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />
      <div
        className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-sm"
        style={{ background: accentColor }}
      >
        {icon}
      </div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-[var(--text3)]">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--text)]">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            'mt-1 text-[11px] font-medium',
            deltaUp ? 'text-[var(--success)]' : 'text-[var(--error)]'
          )}
        >
          {delta}
        </div>
      )}
    </div>
  )
}