import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const SHOP_ITEMS: Record<string, { name: string; description: string; type: string; price: number; icon: string; rarity: string; effect?: string }> = {
  'theme-fantasy': {
    name: 'Fantasy Realm',
    description: 'Transform your interface into a medieval fantasy world.',
    type: 'THEME',
    price: 100,
    icon: '🏰',
    rarity: 'RARE',
    effect: JSON.stringify({ theme: 'fantasy' }),
  },
  'theme-cyberpunk': {
    name: 'Neon City',
    description: 'Enter the cyberpunk future with neon aesthetics.',
    type: 'THEME',
    price: 100,
    icon: '🌃',
    rarity: 'RARE',
    effect: JSON.stringify({ theme: 'cyberpunk' }),
  },
  'theme-lofi': {
    name: 'Cozy Study',
    description: 'Warm, relaxing atmosphere for focused work.',
    type: 'THEME',
    price: 80,
    icon: '☕',
    rarity: 'UNCOMMON',
    effect: JSON.stringify({ theme: 'lofi' }),
  },
  'streak-freeze': {
    name: 'Streak Freeze',
    description: 'Protect your streak for one day of inactivity.',
    type: 'CONSUMABLE',
    price: 50,
    icon: '🧊',
    rarity: 'UNCOMMON',
    effect: JSON.stringify({ type: 'streakFreeze' }),
  },
  'xp-boost': {
    name: 'XP Boost',
    description: 'Double XP for your next 3 quest completions.',
    type: 'CONSUMABLE',
    price: 75,
    icon: '⚡',
    rarity: 'RARE',
    effect: JSON.stringify({ type: 'xpBoost', uses: 3 }),
  },
  'badge-warrior': {
    name: 'Warrior Badge',
    description: 'Proof of your dedication to physical quests.',
    type: 'BADGE',
    price: 150,
    icon: '⚔️',
    rarity: 'EPIC',
    effect: JSON.stringify({ badge: 'warrior' }),
  },
  'badge-scholar': {
    name: 'Scholar Badge',
    description: 'Recognition of intellectual achievements.',
    type: 'BADGE',
    price: 150,
    icon: '📚',
    rarity: 'EPIC',
    effect: JSON.stringify({ badge: 'scholar' }),
  },
  'badge-legend': {
    name: 'Legendary Hero',
    description: 'The ultimate badge of honor for true heroes.',
    type: 'BADGE',
    price: 500,
    icon: '👑',
    rarity: 'LEGENDARY',
    effect: JSON.stringify({ badge: 'legend' }),
  },
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await req.json()

    if (!itemId || !SHOP_ITEMS[itemId]) {
      return NextResponse.json({ error: 'Invalid item' }, { status: 400 })
    }

    const itemData = SHOP_ITEMS[itemId]

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.gold < itemData.price) {
      return NextResponse.json({ error: 'Not enough gold' }, { status: 400 })
    }

    // Check if already owned (for themes and badges)
    const existingItem = await prisma.userItem.findUnique({
      where: {
        userId_itemId: {
          userId: session.user.id,
          itemId,
        },
      },
    })

    if (existingItem && (itemData.type === 'THEME' || itemData.type === 'BADGE')) {
      return NextResponse.json({ error: 'Already owned' }, { status: 400 })
    }

    // Create or find item in database
    let item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item) {
      item = await prisma.item.create({
        data: {
          id: itemId,
          name: itemData.name,
          description: itemData.description,
          type: itemData.type,
          price: itemData.price,
          icon: itemData.icon,
          rarity: itemData.rarity,
          effect: itemData.effect || undefined,
        },
      })
    }

    // Deduct gold and add item
    await prisma.character.update({
      where: { userId: session.user.id },
      data: { gold: character.gold - itemData.price },
    })

    if (existingItem) {
      await prisma.userItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      })
    } else {
      await prisma.userItem.create({
        data: {
          userId: session.user.id,
          itemId,
          quantity: 1,
        },
      })
    }

    return NextResponse.json({
      message: 'Item purchased successfully',
      item: itemData,
      remainingGold: character.gold - itemData.price,
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}