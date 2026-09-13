import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventory = await prisma.userItem.findMany({
      where: { userId: session.user.id },
      include: { item: true },
      orderBy: { purchasedAt: 'desc' },
    })

    return NextResponse.json(inventory)
  } catch (error) {
    console.error('Get inventory error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}