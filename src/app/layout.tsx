import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life RPG - Gamify Your Life',
  description: 'Transform your daily tasks into epic adventures. Level up your character, complete quests, and become the hero of your own story.',
  keywords: ['productivity', 'gamification', 'rpg', 'habits', 'tasks', 'level up'],
  authors: [{ name: 'Life RPG Team' }],
  openGraph: {
    title: 'Life RPG - Gamify Your Life',
    description: 'Transform your daily tasks into epic adventures.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="default">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}