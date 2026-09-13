import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { xpForLevel, levelFromXP, streakMultiplier } from '@/lib/rpg'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
    })

    if (!task || task.userId !== session.user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.completed) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Calculate streak bonus
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastActive = character.lastActiveDate
      ? new Date(character.lastActiveDate)
      : null
    lastActive?.setHours(0, 0, 0, 0)

    const isConsecutiveDay =
      lastActive && today.getTime() - lastActive.getTime() <= 24 * 60 * 60 * 1000
    const newStreak = isConsecutiveDay ? character.currentStreak + 1 : 1

    // Apply streak bonus to rewards
    const streakBonus = streakMultiplier(newStreak)
    const xpGained = Math.floor(task.xpReward * (1 + streakBonus))
    const goldGained = Math.floor(task.goldReward * (1 + streakBonus))

    // Calculate new XP and level
    const newXP = character.xp + xpGained
    const newLevel = levelFromXP(newXP)
    const levelUp = newLevel > character.level

    // Calculate attribute gains
    const attributeGains: Record<string, number> = {}
    const xpGainForAttribute = levelUp ? Math.floor(xpGained / 10) : Math.floor(xpGained / 20)
    attributeGains[task.attribute.toLowerCase()] = xpGainForAttribute

    // Update character
    const updatedCharacter = await prisma.character.update({
      where: { userId: session.user.id },
      data: {
        xp: newXP,
        level: newLevel,
        xpToNextLevel: xpForLevel(newLevel + 1),
        gold: character.gold + goldGained,
        currentStreak: newStreak,
        longestStreak: Math.max(character.longestStreak, newStreak),
        lastActiveDate: today,
        [task.attribute.toLowerCase()]: {
          increment: xpGainForAttribute,
        },
      },
    })

    // Mark task as completed
    await prisma.task.update({
      where: { id: params.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })

    // Record completion
    await prisma.taskCompletion.create({
      data: {
        taskId: params.id,
        userId: session.user.id,
        xpGained,
        goldGained,
      },
    })

    return NextResponse.json({
      xpGained,
      goldGained,
      levelUp,
      statGains: attributeGains,
      character: updatedCharacter,
    })
  } catch (error) {
    console.error('Complete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}