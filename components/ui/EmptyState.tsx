import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-14 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-3 text-4xl opacity-30">{icon}</div>
      )}
      <p className="mb-1 text-sm font-medium text-[var(--text2)]">{title}</p>
      {description && (
        <p className="text-[12px] text-[var(--text3)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}