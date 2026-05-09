import { cn } from '@/lib/utils'
import type { RunStatus, StepStatus } from '@/lib/types'

type Status = RunStatus | StepStatus

interface StatusPillProps {
  status: Status
  size?: 'sm' | 'md'
  className?: string
}

const CONFIG: Record<Status, { label: string; dot: string; pill: string }> = {
  success: {
    label: 'success',
    dot: 'bg-[var(--success)]',
    pill: 'bg-[var(--success-bg)] text-[var(--success)]',
  },
  error: {
    label: 'error',
    dot: 'bg-[var(--error)]',
    pill: 'bg-[var(--error-bg)] text-[var(--error)]',
  },
  degraded: {
    label: 'degraded',
    dot: 'bg-[var(--warn)]',
    pill: 'bg-[var(--warn-bg)] text-[var(--warn)]',
  },
}

export function StatusPill({ status, size = 'md', className }: StatusPillProps) {
  const config = CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded font-semibold uppercase tracking-[0.3px]',
        size === 'sm' ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-[11px]',
        config.pill,
        className
      )}
    >
      <span className={cn('inline-block rounded-full', size === 'sm' ? 'h-1 w-1' : 'h-[5px] w-[5px]', config.dot)} />
      {config.label}
    </span>
  )
}