'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Swords } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'
import { ATTRIBUTE_LABELS, ATTRIBUTE_ICONS, DIFFICULTY_LABELS } from '@/lib/rpg'

export function TodayQuests() {
  const queryClient = useQueryClient()
  const { addToast, triggerLevelUp } = useUIStore()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
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
    onError: () => {
      addToast({ type: 'error', message: 'Failed to complete quest' })
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  const pendingTasks = tasks?.filter((t: any) => !t.completed) || []
  const completedTasks = tasks?.filter((t: any) => t.completed) || []

  if (pendingTasks.length === 0 && completedTasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Swords className="mx-auto h-12 w-12 text-[rgb(var(--text-muted))]" />
        <h3 className="mt-4 text-lg font-semibold text-[rgb(var(--text))]">No Quests Yet</h3>
        <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
          Create your first quest to start earning XP!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {pendingTasks.map((task: any) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            layout
          >
            <Card className="flex items-center gap-4 p-4">
              <button
                onClick={() => completeMutation.mutate(task.id)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--border))] text-[rgb(var(--text-muted))] transition-all hover:border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/20 hover:text-[rgb(var(--primary))]"
                aria-label={`Complete ${task.title}`}
              >
                <Check className="h-5 w-5" />
              </button>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[rgb(var(--text))] truncate">{task.title}</h4>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span>{ATTRIBUTE_ICONS[task.attribute as keyof typeof ATTRIBUTE_ICONS]} {ATTRIBUTE_LABELS[task.attribute as keyof typeof ATTRIBUTE_LABELS]}</span>
                  <span className="text-[rgb(var(--text-muted))]">•</span>
                  <span>{DIFFICULTY_LABELS[task.difficulty as keyof typeof DIFFICULTY_LABELS]}</span>
                  <span className="text-[rgb(var(--text-muted))]">•</span>
                  <span className="text-[rgb(var(--gold))]">+{task.xpReward} XP</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(task.id)}
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="h-4 w-4 text-[rgb(var(--text-muted))]" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {completedTasks.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-[rgb(var(--text-muted))]">
            Completed Today ({completedTasks.length})
          </h4>
          {completedTasks.slice(0, 5).map((task: any) => (
            <div
              key={task.id}
              className="flex items-center gap-4 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/50 p-3 opacity-60"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <Check className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-[rgb(var(--text))] line-through truncate">{task.title}</h4>
              </div>
              <span className="text-xs text-[rgb(var(--gold))]">+{task.xpReward} XP</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}