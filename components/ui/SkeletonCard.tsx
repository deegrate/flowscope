import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-white/5 h-24 w-full', className)} />
  )
}

export function SkeletonRow({ className }: SkeletonCardProps) {
  return (
    <tr className={cn('animate-pulse', className)}>
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-white/5" /></td>
    </tr>
  )
}