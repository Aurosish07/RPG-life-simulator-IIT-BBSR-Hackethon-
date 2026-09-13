'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Check, Trash2, Edit2, Swords } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useUIStore } from '@/store/uiStore'
import { ATTRIBUTE_LABELS, ATTRIBUTE_ICONS, DIFFICULTY_LABELS } from '@/lib/rpg'

type AttributeType = 'STRENGTH' | 'INTELLECT' | 'AGILITY' | 'VITALITY' | 'CHARISMA' | 'WISDOM'
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC'

export default function QuestsPage() {
  const queryClient = useQueryClient()
  const { addToast, triggerLevelUp } = useUIStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterAttribute, setFilterAttribute] = useState<AttributeType | 'ALL'>('ALL')

  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    attribute: 'INTELLECT' as AttributeType,
    difficulty: 'MEDIUM' as Difficulty,
  })

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof newQuest) => {
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
      setShowCreateModal(false)
      setNewQuest({
        title: '',
        description: '',
        attribute: 'INTELLECT',
        difficulty: 'MEDIUM',
      })
      addToast({ type: 'success', message: 'Quest created!' })
    },
  })

  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to complete task')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['character'] })

      if (data.levelUp) {
        triggerLevelUp({
          newLevel: data.character.level,
          statGains: data.statGains || {},
        })
      }

      addToast({
        type: 'success',
        message: `+${data.xpGained} XP, +${data.goldGained} Gold`,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete task')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      addToast({ type: 'info', message: 'Quest deleted' })
    },
  })

  const filteredTasks = tasks?.filter((task: any) => {
    if (filterAttribute === 'ALL') return true
    return task.attribute === filterAttribute
  }) || []

  const pendingTasks = filteredTasks.filter((t: any) => !t.completed)
  const completedTasks = filteredTasks.filter((t: any) => t.completed)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Quest Log</h1>
          <p className="text-[rgb(var(--text-muted))]">Manage your epic quests</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Quest
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterAttribute('ALL')}
          className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
            filterAttribute === 'ALL'
              ? 'bg-[rgb(var(--primary))] text-white'
              : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
          }`}
        >
          All
        </button>
        {(Object.keys(ATTRIBUTE_LABELS) as AttributeType[]).map((attr) => (
          <button
            key={attr}
            onClick={() => setFilterAttribute(attr)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
              filterAttribute === attr
                ? 'bg-[rgb(var(--primary))] text-white'
                : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
            }`}
          >
            {ATTRIBUTE_ICONS[attr]} {ATTRIBUTE_LABELS[attr]}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer h-24 rounded-xl" />
          ))}
        </div>
      ) : pendingTasks.length === 0 && completedTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <Swords className="mx-auto h-16 w-16 text-[rgb(var(--text-muted))]" />
          <h3 className="mt-4 text-xl font-semibold text-[rgb(var(--text))]">No Quests Found</h3>
          <p className="mt-2 text-[rgb(var(--text-muted))]">
            {filterAttribute !== 'ALL'
              ? 'No quests for this attribute. Try a different filter.'
              : 'Create your first quest to begin your adventure!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {pendingTasks.map((task: any) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
              >
                <Card className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => completeMutation.mutate(task.id)}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--border))] text-[rgb(var(--text-muted))] transition-all hover:border-green-500 hover:bg-green-500/20 hover:text-green-400"
                    aria-label={`Complete ${task.title}`}
                  >
                    <Check className="h-6 w-6" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[rgb(var(--text))]">{task.title}</h4>
                    {task.description && (
                      <p className="mt-1 text-sm text-[rgb(var(--text-muted))] truncate">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[rgb(var(--primary))]/20 px-2 py-0.5">
                        {ATTRIBUTE_ICONS[task.attribute as AttributeType]} {ATTRIBUTE_LABELS[task.attribute as AttributeType]}
                      </span>
                      <span className="rounded-full bg-[rgb(var(--surface))] px-2 py-0.5">
                        {DIFFICULTY_LABELS[task.difficulty as Difficulty]}
                      </span>
                      <span className="text-[rgb(var(--gold))]">+{task.xpReward} XP</span>
                      <span className="text-[rgb(var(--gold))]">+{task.goldReward} Gold</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {completedTasks.length > 0 && (
            <>
              <h3 className="pt-4 text-sm font-medium text-[rgb(var(--text-muted))]">
                Completed ({completedTasks.length})
              </h3>
              {completedTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/50 p-4 opacity-60"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[rgb(var(--text))] line-through">{task.title}</h4>
                  </div>
                  <span className="text-sm text-[rgb(var(--gold))]">+{task.xpReward} XP</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Create Quest Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Quest"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate(newQuest)
          }}
          className="space-y-4"
        >
          <Input
            label="Quest Title"
            placeholder="Slay the Dragon (or finish homework)"
            value={newQuest.title}
            onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--text-muted))]">
              Description (optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
              rows={3}
              placeholder="Add details about this quest..."
              value={newQuest.description}
              onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--text-muted))]">
              Attribute
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ATTRIBUTE_LABELS) as AttributeType[]).map((attr) => (
                <button
                  key={attr}
                  type="button"
                  onClick={() => setNewQuest({ ...newQuest, attribute: attr })}
                  className={`rounded-lg p-3 text-sm transition-all ${
                    newQuest.attribute === attr
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
                  }`}
                >
                  {ATTRIBUTE_ICONS[attr]} {ATTRIBUTE_LABELS[attr]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--text-muted))]">
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setNewQuest({ ...newQuest, difficulty: diff })}
                  className={`rounded-lg p-3 text-sm transition-all ${
                    newQuest.difficulty === diff
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))]'
                  }`}
                >
                  {DIFFICULTY_LABELS[diff]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Quest
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}