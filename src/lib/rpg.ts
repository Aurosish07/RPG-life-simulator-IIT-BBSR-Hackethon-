export type AttributeType = 'STRENGTH' | 'INTELLECT' | 'AGILITY' | 'VITALITY' | 'CHARISMA' | 'WISDOM'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC'

const XP_BASE = 100

export function xpForLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(level, 1.5))
}

export function levelFromXP(xp: number): number {
  let level = 1
  let xpNeeded = xpForLevel(level + 1)
  while (xp >= xpNeeded) {
    level++
    xpNeeded = xpForLevel(level + 1)
  }
  return level
}

export function xpProgressInLevel(xp: number): { current: number; needed: number; percent: number } {
  const level = levelFromXP(xp)
  const xpForCurrent = xpForLevel(level)
  const xpForNext = xpForLevel(level + 1)
  const current = xp - xpForCurrent
  const needed = xpForNext - xpForCurrent
  return { current, needed, percent: Math.floor((current / needed) * 100) }
}

const DIFFICULTY_MULTIPLIERS: Record<Difficulty, { xp: number; gold: number }> = {
  EASY: { xp: 10, gold: 5 },
  MEDIUM: { xp: 25, gold: 10 },
  HARD: { xp: 50, gold: 20 },
  EPIC: { xp: 100, gold: 50 },
}

export function calculateTaskReward(difficulty: Difficulty, attribute: AttributeType, streakBonus: number = 0): { xp: number; gold: number } {
  const base = DIFFICULTY_MULTIPLIERS[difficulty]
  const streakMultiplier = 1 + Math.min(streakBonus, 1)
  return {
    xp: Math.floor(base.xp * streakMultiplier),
    gold: Math.floor(base.gold * streakMultiplier),
  }
}

export function streakMultiplier(streak: number): number {
  return Math.min(streak * 0.1, 1.0)
}

export const ATTRIBUTE_LABELS: Record<AttributeType, string> = {
  STRENGTH: 'Strength',
  INTELLECT: 'Intellect',
  AGILITY: 'Agility',
  VITALITY: 'Vitality',
  CHARISMA: 'Charisma',
  WISDOM: 'Wisdom',
}

export const ATTRIBUTE_ICONS: Record<AttributeType, string> = {
  STRENGTH: '💪',
  INTELLECT: '🧠',
  AGILITY: '⚡',
  VITALITY: '❤️',
  CHARISMA: '✨',
  WISDOM: '🔮',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EPIC: 'Epic',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'text-green-400',
  MEDIUM: 'text-yellow-400',
  HARD: 'text-orange-400',
  EPIC: 'text-red-400',
}

export const ATTRIBUTE_ASSIGNMENTS: Record<AttributeType, string[]> = {
  STRENGTH: ['Gym', 'Calisthenics', 'Heavy Lifting', 'Martial Arts', 'Weight Training'],
  INTELLECT: ['Coding', 'Reading', 'Learning', 'Study', 'Puzzles', 'Writing'],
  AGILITY: ['Running', 'Yoga', 'Sports', 'Dance', 'Cycling', 'Swimming'],
  VITALITY: ['Sleep', 'Hydration', 'Meditation', 'Diet', 'Stretching', 'Rest'],
  CHARISMA: ['Socializing', 'Networking', 'Public Speaking', 'Meetups', 'Communication'],
  WISDOM: ['Journaling', 'Planning', 'Reflection', 'Therapy', 'Mindfulness', 'Review'],
}