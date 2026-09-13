'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Swords, Flame, TrendingUp, Coins } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CharacterCard } from '@/components/character/CharacterCard'
import { QuickQuestForm } from '@/components/quests/QuickQuestForm'
import { TodayQuests } from '@/components/quests/TodayQuests'

export default function DashboardPage() {
  const { data: session } = useSession()

  const { data: character, isLoading } = useQuery({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character')
      if (!res.ok) throw new Error('Failed to fetch character')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="shimmer h-64 rounded-xl" />
          <div className="shimmer h-64 rounded-xl" />
          <div className="shimmer h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[rgb(var(--border))] bg-gradient-to-r from-[rgb(var(--primary))]/20 to-[rgb(var(--secondary))]/20 p-6"
      >
        <h2 className="text-2xl font-bold text-[rgb(var(--text))]">
          Welcome back, {session?.user?.name || 'Adventurer'}! ⚔️
        </h2>
        <p className="mt-2 text-[rgb(var(--text-muted))]">
          Your quest log awaits. Complete tasks to earn XP and level up!
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Character Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CharacterCard character={character} />
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--primary))]/20">
                <Flame className="h-5 w-5 text-[rgb(var(--primary))]" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">Current Streak</p>
                <p className="text-xl font-bold text-[rgb(var(--text))]">
                  {character?.currentStreak || 0} days
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--gold))]/20">
                <Coins className="h-5 w-5 text-[rgb(var(--gold))]" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">Gold</p>
                <p className="text-xl font-bold text-[rgb(var(--gold))]">
                  {character?.gold || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">Longest Streak</p>
                <p className="text-xl font-bold text-[rgb(var(--text))]">
                  {character?.longestStreak || 0} days
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Quest Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickQuestForm />
        </motion.div>
      </div>

      {/* Today's Quests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Today&apos;s Quests</h3>
        <TodayQuests />
      </motion.div>
    </div>
  )
}