import type { ReactNode } from 'react'
import { Sidebar } from './SideBar'
import { TopBar } from './TopBar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-5 py-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}