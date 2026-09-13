import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateTaskReward } from '@/lib/rpg'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, attribute, difficulty, isRecurring, recurrenceRule, dueDate } =
      await req.json()

    if (!title || !attribute) {
      return NextResponse.json(
        { error: 'Title and attribute are required' },
        { status: 400 }
      )
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    })

    const { xp, gold } = calculateTaskReward(
      (difficulty || 'MEDIUM') as any,
      attribute as any,
      character?.currentStreak || 0
    )

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title,
        description,
        attribute,
        difficulty: difficulty || 'MEDIUM',
        isRecurring: isRecurring || false,
        recurrenceRule,
        dueDate: dueDate ? new Date(dueDate) : null,
        xpReward: xp,
        goldReward: gold,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}