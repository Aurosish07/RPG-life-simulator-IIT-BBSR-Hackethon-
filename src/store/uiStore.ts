import { create } from 'zustand'

interface UIState {
  theme: string
  setTheme: (theme: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  showLevelUp: boolean
  setShowLevelUp: (show: boolean) => void
  levelUpData: {
    newLevel: number
    statGains: Record<string, number>
  } | null
  triggerLevelUp: (data: { newLevel: number; statGains: Record<string, number> }) => void
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'default',
  setTheme: (theme) => {
    set({ theme })
    if (typeof window !== 'undefined') {
      localStorage.setItem('life-rpg-theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  },
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  showLevelUp: false,
  setShowLevelUp: (show) => set({ showLevelUp: show }),
  levelUpData: null,
  triggerLevelUp: (data) => set({ showLevelUp: true, levelUpData: data }),
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, toast.duration || 3000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))