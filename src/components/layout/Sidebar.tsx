'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Backpack,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/quests', label: 'Quests', icon: Swords },
  { href: '/dashboard/character', label: 'Character', icon: User },
  { href: '/dashboard/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Backpack },
  { href: '/dashboard/stats', label: 'Stats', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[rgb(var(--surface))] p-2 text-[rgb(var(--text))] lg:hidden"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))]',
          'lg:translate-x-0',
          !sidebarOpen && 'max-lg:hidden'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-[rgb(var(--border))] px-4">
          <span className="text-2xl">⚔️</span>
          <span className="text-xl font-bold text-gradient">Life RPG</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  'hover:bg-[rgb(var(--border))] hover:text-[rgb(var(--text))]',
                  isActive
                    ? 'bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))]'
                    : 'text-[rgb(var(--text-muted))]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-[rgb(var(--primary))]"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[rgb(var(--border))] p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center">
              <span className="text-sm">🎮</span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-[rgb(var(--text))]">Adventurer</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">Level 1</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}