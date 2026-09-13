'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { xpProgressInLevel } from '@/lib/rpg'

interface Character {
  level: number
  xp: number
  xpToNextLevel: number
  strength: number
  intellect: number
  agility: number
  vitality: number
  charisma: number
  wisdom: number
}

interface CharacterCardProps {
  character: Character | null
}

const attributes = [
  { key: 'strength', label: 'STR', color: 'bg-red-500' },
  { key: 'intellect', label: 'INT', color: 'bg-blue-500' },
  { key: 'agility', label: 'AGI', color: 'bg-green-500' },
  { key: 'vitality', label: 'VIT', color: 'bg-pink-500' },
  { key: 'charisma', label: 'CHA', color: 'bg-yellow-500' },
  { key: 'wisdom', label: 'WIS', color: 'bg-purple-500' },
]

export function CharacterCard({ character }: CharacterCardProps) {
  const level = character?.level || 1
  const xp = character?.xp || 0
  const { current, needed, percent } = xpProgressInLevel(xp)

  return (
    <Card variant="glow" className="p-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--primary))]/20 text-3xl">
            🧙
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(var(--gold))] text-xs font-bold text-black">
            {level}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[rgb(var(--text))]">Adventurer</h3>
          <p className="text-sm text-[rgb(var(--text-muted))]">Level {level}</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[rgb(var(--text-muted))]">Experience</span>
          <span className="text-[rgb(var(--text))]">
            {current} / {needed} XP
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[rgb(var(--border))]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
          />
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-2">
        {attributes.map((attr) => {
          const value = character?.[attr.key as keyof Character] || 0
          return (
            <div key={attr.key} className="flex items-center gap-2">
              <span className="w-8 text-xs font-bold text-[rgb(var(--text-muted))]">
                {attr.label}
              </span>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(value, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${attr.color}`}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-xs text-[rgb(var(--text-muted))]">
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}