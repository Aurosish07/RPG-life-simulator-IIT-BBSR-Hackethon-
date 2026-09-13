'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUIStore } from '@/store/uiStore'
import { ATTRIBUTE_LABELS, ATTRIBUTE_ICONS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/rpg'

type AttributeType = 'STRENGTH' | 'INTELLECT' | 'AGILITY' | 'VITALITY' | 'CHARISMA' | 'WISDOM'
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC'

export function QuickQuestForm() {
  const queryClient = useQueryClient()
  const { addToast } = useUIStore()
  const [title, setTitle] = useState('')
  const [attribute, setAttribute] = useState<AttributeType>('INTELLECT')
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM')

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; attribute: AttributeType; difficulty: Difficulty }) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create quest')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setTitle('')
      addToast({ type: 'success', message: 'Quest created!' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to create quest' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({ title, attribute, difficulty })
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Quick Quest</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="What's your quest?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="mb-2 block text-sm text-[rgb(var(--text-muted))]">Attribute</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ATTRIBUTE_LABELS) as AttributeType[]).map((attr) => (
              <button
                key={attr}
                type="button"
                onClick={() => setAttribute(attr)}
                className={`rounded-lg p-2 text-xs transition-all ${
                  attribute === attr
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
                }`}
              >
                {ATTRIBUTE_ICONS[attr]} {ATTRIBUTE_LABELS[attr].slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[rgb(var(--text-muted))]">Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`rounded-lg p-2 text-xs transition-all ${
                  difficulty === diff
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
                }`}
              >
                {DIFFICULTY_LABELS[diff]}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" loading={createMutation.isPending}>
          Create Quest
        </Button>
      </form>
    </Card>
  )
}