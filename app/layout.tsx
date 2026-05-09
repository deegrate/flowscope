import type { Metadata } from 'next'
import { IBM_Plex_Mono, DM_Sans } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'FlowScope — AI Workflow Observability',
  description: 'Observability console for AI workflows and agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}