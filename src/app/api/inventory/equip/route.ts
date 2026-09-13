import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await req.json()

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Check if user owns this item
    const userItem = await prisma.userItem.findUnique({
      where: {
        userId_itemId: {
          userId: session.user.id,
          itemId,
        },
      },
      include: { item: true },
    })

    if (!userItem) {
      return NextResponse.json({ error: 'Item not owned' }, { status: 404 })
    }

    let updateData: any = {}

    // Apply effect based on item type
    if (userItem.item.type === 'THEME') {
      const effect = userItem.item.effect ? JSON.parse(userItem.item.effect) : null
      if (effect?.theme) {
        updateData.equippedTheme = effect.theme
      }
    } else if (userItem.item.type === 'BADGE') {
      const effect = userItem.item.effect ? JSON.parse(userItem.item.effect) : null
      if (effect?.badge) {
        // Add badge to equipped badges array
        const character = await prisma.character.findUnique({
          where: { userId: session.user.id },
        })
        const currentBadges = character?.badges ? JSON.parse(character.badges) : []
        if (!currentBadges.includes(effect.badge)) {
          updateData.badges = JSON.stringify([...currentBadges, effect.badge])
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.character.update({
        where: { userId: session.user.id },
        data: updateData,
      })
    }

    return NextResponse.json({
      message: 'Item equipped',
      theme: updateData.equippedTheme || null,
    })
  } catch (error) {
    console.error('Equip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}