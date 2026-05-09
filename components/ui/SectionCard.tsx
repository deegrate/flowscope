import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
  noPadding = false,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--card)]',
        !noPadding && 'p-4',
        className
      )}
    >
      {(title || action) && (
        <div className={cn('flex items-center justify-between', noPadding ? 'px-4 pt-4 pb-3' : 'mb-3.5')}>
          <div>
            {title && (
              <h3 className="text-[13px] font-semibold text-[var(--text)]">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-[var(--text3)]">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}