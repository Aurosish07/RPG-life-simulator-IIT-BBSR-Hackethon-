'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="lg:hidden w-10" />

        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-[rgb(var(--text))]">
            Welcome, {session?.user?.name || 'Adventurer'}!
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[rgb(var(--primary))]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}