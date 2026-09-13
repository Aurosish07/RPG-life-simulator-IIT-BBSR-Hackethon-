'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const saved = localStorage.getItem('life-rpg-theme') || 'default'
    setTheme(saved)
  }, [setTheme])

  return <>{children}</>
}