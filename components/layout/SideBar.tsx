'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    href: '/runs',
    label: 'Runs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6.5" />
        <polyline points="6,8 8,10 11,6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/prompts',
    label: 'Prompts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h12M2 6h8M2 9h10M2 12h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="2.5" />
        <path
          d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l-1.06 1.06M4.11 11.89l-1.06 1.06"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-[220px] min-w-[220px] flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-4 py-5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[var(--teal)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#0a0a0f" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#0a0a0f" opacity="0.65" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#0a0a0f" opacity="0.65" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#0a0a0f" opacity="0.3" />
          </svg>
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.3px] text-[var(--text)]">
            FlowScope
          </div>
          <div className="text-[10px] uppercase tracking-[0.5px] text-[var(--text3)]">
            Observability
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all',
              isActive(item.href)
                ? 'bg-[var(--teal-dim)] font-medium text-[var(--teal)]'
                : 'font-normal text-[var(--text2)] hover:bg-white/[0.05] hover:text-[var(--text)]'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-[rgba(245,158,11,0.15)] px-2 py-0.5 text-[11px] font-medium text-[var(--warn)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Demo Mode
        </div>
        <div className="flex gap-3">
          <span className="cursor-pointer text-[11px] text-[var(--text3)] hover:text-[var(--text2)]">
            GitHub
          </span>
          <span className="cursor-pointer text-[11px] text-[var(--text3)] hover:text-[var(--text2)]">
            Docs
          </span>
          <span className="cursor-pointer text-[11px] text-[var(--text3)] hover:text-[var(--text2)]">
            ◑ Theme
          </span>
        </div>
      </div>
    </aside>
  )
}