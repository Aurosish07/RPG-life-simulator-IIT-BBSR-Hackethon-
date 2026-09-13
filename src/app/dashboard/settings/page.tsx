'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'

const themes = [
  { id: 'default', name: 'Dark Default', icon: '🌙' },
  { id: 'fantasy', name: 'Fantasy Realm', icon: '🏰' },
  { id: 'cyberpunk', name: 'Neon City', icon: '🌃' },
  { id: 'lofi', name: 'Cozy Study', icon: '☕' },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useUIStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Settings</h1>
        <p className="text-[rgb(var(--text-muted))]">Customize your experience</p>
      </div>

      {/* Account Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[rgb(var(--text-muted))]">Name</label>
            <p className="font-medium text-[rgb(var(--text))]">{session?.user?.name || 'Adventurer'}</p>
          </div>
          <div>
            <label className="text-sm text-[rgb(var(--text-muted))]">Email</label>
            <p className="font-medium text-[rgb(var(--text))]">{session?.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Theme Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Theme</h2>
        <p className="mb-4 text-sm text-[rgb(var(--text-muted))]">
          Choose your visual theme. Some themes can be purchased in the shop.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                theme === t.id
                  ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                  : 'border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50'
              }`}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="text-sm font-medium text-[rgb(var(--text))]">{t.name}</span>
              {theme === t.id && (
                <span className="text-xs text-[rgb(var(--primary))]">Active</span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[rgb(var(--text))]">Quest Reminders</p>
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Get reminded about daily quests
              </p>
            </div>
            <div className="h-6 w-11 rounded-full bg-[rgb(var(--primary))]">
              <div className="ml-auto h-5 w-5 translate-y-0.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[rgb(var(--text))]">Streak Alerts</p>
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Warn when streak might break
              </p>
            </div>
            <div className="h-6 w-11 rounded-full bg-[rgb(var(--primary))]">
              <div className="ml-auto h-5 w-5 translate-y-0.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[rgb(var(--text))]">Level Up Celebrations</p>
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Show animations on level up
              </p>
            </div>
            <div className="h-6 w-11 rounded-full bg-[rgb(var(--primary))]">
              <div className="ml-auto h-5 w-5 translate-y-0.5 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Keyboard Shortcuts</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[rgb(var(--text-muted))]">Complete task</span>
            <kbd className="rounded bg-[rgb(var(--surface))] px-2 py-1 font-mono">Enter</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgb(var(--text-muted))]">Delete task</span>
            <kbd className="rounded bg-[rgb(var(--surface))] px-2 py-1 font-mono">Backspace</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgb(var(--text-muted))]">New quest</span>
            <kbd className="rounded bg-[rgb(var(--surface))] px-2 py-1 font-mono">N</kbd>
          </div>
        </div>
      </Card>
    </div>
  )
}