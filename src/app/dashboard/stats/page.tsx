'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function StatsPage() {
  const { data: character, isLoading: characterLoading } = useQuery({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character')
      if (!res.ok) throw new Error('Failed to fetch character')
      return res.json()
    },
  })

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
    },
  })

  if (characterLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer h-32 rounded-xl" />
          ))}
        </div>
        <div className="shimmer h-64 rounded-xl" />
      </div>
    )
  }

  const completedTasks = tasks?.filter((t: any) => t.completed) || []
  const totalXP = completedTasks.reduce((sum: number, t: any) => sum + t.xpGained, 0)
  const totalGold = completedTasks.reduce((sum: number, t: any) => sum + t.goldGained, 0)

  const attributeStats = ['strength', 'intellect', 'agility', 'vitality', 'charisma', 'wisdom'].map(
    (attr) => ({
      name: attr.charAt(0).toUpperCase() + attr.slice(1),
      value: character?.[attr] || 0,
    })
  )

  const maxStat = Math.max(...attributeStats.map((s) => s.value), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Statistics</h1>
        <p className="text-[rgb(var(--text-muted))]">Track your progress over time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--primary))]/20">
                <Target className="h-6 w-6 text-[rgb(var(--primary))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--text))]">{completedTasks.length}</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">Quests Completed</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--gold))]/20">
                <TrendingUp className="h-6 w-6 text-[rgb(var(--gold))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--gold))]">{totalXP}</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">Total XP Earned</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--gold))]/20">
                <BarChart3 className="h-6 w-6 text-[rgb(var(--gold))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--gold))]">{totalGold}</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">Gold Earned</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                <Calendar className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--text))]">
                  {character?.currentStreak || 0}
                </p>
                <p className="text-sm text-[rgb(var(--text-muted))]">Current Streak</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Attribute Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-[rgb(var(--text))]">
            Attribute Distribution
          </h3>
          <div className="space-y-4">
            {attributeStats.map((stat, index) => (
              <div key={stat.name} className="flex items-center gap-4">
                <span className="w-20 text-sm text-[rgb(var(--text-muted))]">{stat.name}</span>
                <div className="flex-1">
                  <div className="h-6 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / maxStat) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-medium text-[rgb(var(--text))]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Recent Activity</h3>
          {completedTasks.length === 0 ? (
            <p className="text-center text-[rgb(var(--text-muted))]">
              Complete some quests to see your activity!
            </p>
          ) : (
            <div className="space-y-3">
              {completedTasks.slice(0, 10).map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg bg-[rgb(var(--surface))] p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </div>
                    <span className="text-sm text-[rgb(var(--text))]">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[rgb(var(--gold))]">+{task.xpGained} XP</span>
                    <span className="text-[rgb(var(--gold))]">+{task.goldGained} Gold</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}