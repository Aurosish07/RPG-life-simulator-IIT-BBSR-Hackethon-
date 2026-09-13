'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { xpProgressInLevel, ATTRIBUTE_LABELS, ATTRIBUTE_ICONS } from '@/lib/rpg'

const attributeColors: Record<string, string> = {
  strength: 'from-red-500 to-red-600',
  intellect: 'from-blue-500 to-blue-600',
  agility: 'from-green-500 to-green-600',
  vitality: 'from-pink-500 to-pink-600',
  charisma: 'from-yellow-500 to-yellow-600',
  wisdom: 'from-purple-500 to-purple-600',
}

export default function CharacterPage() {
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
        <div className="shimmer h-48 rounded-xl" />
        <div className="shimmer h-64 rounded-xl" />
      </div>
    )
  }

  if (!character) return null

  const { current, needed, percent } = xpProgressInLevel(character.xp)
  const totalAttributes =
    character.strength +
    character.intellect +
    character.agility +
    character.vitality +
    character.charisma +
    character.wisdom

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Character Sheet</h1>
        <p className="text-[rgb(var(--text-muted))]">View your progress and attributes</p>
      </div>

      {/* Main Character Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="glow" className="p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-6xl shadow-lg">
                🧙
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--gold))] text-xl font-bold text-black shadow-lg">
                {character.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-[rgb(var(--text))]">Adventurer</h2>
              <p className="mt-1 text-[rgb(var(--text-muted))]">Level {character.level} Hero</p>

              {/* XP Bar */}
              <div className="mt-4 max-w-md">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[rgb(var(--text-muted))]">Experience Points</span>
                  <span className="font-medium text-[rgb(var(--text))]">
                    {current} / {needed} XP
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[rgb(var(--gold))]">{character.gold}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">Gold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{character.currentStreak}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{totalAttributes}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">Total Stats</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Attributes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Attributes</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(ATTRIBUTE_LABELS).map(([key, label], index) => {
            const value = character[key.toLowerCase()] || 0
            const attrPercent = Math.min(value, 100)
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ATTRIBUTE_ICONS[key as keyof typeof ATTRIBUTE_ICONS]}</span>
                      <span className="font-semibold text-[rgb(var(--text))]">{label}</span>
                    </div>
                    <span className="text-2xl font-bold text-[rgb(var(--text))]">{value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${attrPercent}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${attributeColors[key.toLowerCase()]}`}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[rgb(var(--text-muted))]">
                    {value >= 100 ? 'MAX' : `${100 - value} to next milestone`}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Achievements</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 text-center">
            <p className="text-3xl">🏆</p>
            <p className="mt-2 font-semibold text-[rgb(var(--text))]">{character.level}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Level Reached</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl">🔥</p>
            <p className="mt-2 font-semibold text-[rgb(var(--text))]">{character.longestStreak}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Longest Streak</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl">⭐</p>
            <p className="mt-2 font-semibold text-[rgb(var(--text))]">{character.xp}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Total XP Earned</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl">💰</p>
            <p className="mt-2 font-semibold text-[rgb(var(--gold))]">{character.gold}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Gold Earned</p>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}