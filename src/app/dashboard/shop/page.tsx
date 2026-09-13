'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ShoppingCart, Coins, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUIStore } from '@/store/uiStore'

interface ShopItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  icon: string
  rarity: string
  effect?: any
}

const rarityColors: Record<string, string> = {
  COMMON: 'border-gray-500 bg-gray-500/10',
  UNCOMMON: 'border-green-500 bg-green-500/10',
  RARE: 'border-blue-500 bg-blue-500/10',
  EPIC: 'border-purple-500 bg-purple-500/10',
  LEGENDARY: 'border-yellow-500 bg-yellow-500/10',
}

const SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: 'theme-fantasy',
    name: 'Fantasy Realm',
    description: 'Transform your interface into a medieval fantasy world.',
    type: 'THEME',
    price: 100,
    icon: '🏰',
    rarity: 'RARE',
    effect: { theme: 'fantasy' },
  },
  {
    id: 'theme-cyberpunk',
    name: 'Neon City',
    description: 'Enter the cyberpunk future with neon aesthetics.',
    type: 'THEME',
    price: 100,
    icon: '🌃',
    rarity: 'RARE',
    effect: { theme: 'cyberpunk' },
  },
  {
    id: 'theme-lofi',
    name: 'Cozy Study',
    description: 'Warm, relaxing atmosphere for focused work.',
    type: 'THEME',
    price: 80,
    icon: '☕',
    rarity: 'UNCOMMON',
    effect: { theme: 'lofi' },
  },
  // Consumables
  {
    id: 'streak-freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for one day of inactivity.',
    type: 'CONSUMABLE',
    price: 50,
    icon: '🧊',
    rarity: 'UNCOMMON',
    effect: { type: 'streakFreeze' },
  },
  {
    id: 'xp-boost',
    name: 'XP Boost',
    description: 'Double XP for your next 3 quest completions.',
    type: 'CONSUMABLE',
    price: 75,
    icon: '⚡',
    rarity: 'RARE',
    effect: { type: 'xpBoost', uses: 3 },
  },
  // Badges
  {
    id: 'badge-warrior',
    name: 'Warrior Badge',
    description: 'Proof of your dedication to physical quests.',
    type: 'BADGE',
    price: 150,
    icon: '⚔️',
    rarity: 'EPIC',
    effect: { badge: 'warrior' },
  },
  {
    id: 'badge-scholar',
    name: 'Scholar Badge',
    description: 'Recognition of intellectual achievements.',
    type: 'BADGE',
    price: 150,
    icon: '📚',
    rarity: 'EPIC',
    effect: { badge: 'scholar' },
  },
  {
    id: 'badge-legend',
    name: 'Legendary Hero',
    description: 'The ultimate badge of honor for true heroes.',
    type: 'BADGE',
    price: 500,
    icon: '👑',
    rarity: 'LEGENDARY',
    effect: { badge: 'legend' },
  },
]

export default function ShopPage() {
  const queryClient = useQueryClient()
  const { addToast, setTheme } = useUIStore()
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)

  const { data: character } = useQuery({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character')
      if (!res.ok) throw new Error('Failed to fetch character')
      return res.json()
    },
  })

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory')
      if (!res.ok) throw new Error('Failed to fetch inventory')
      return res.json()
    },
  })

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to purchase')
      }
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['character'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      setSelectedItem(null)
      addToast({ type: 'success', message: 'Item purchased!' })

      if (data.item?.effect?.theme) {
        setTheme(data.item.effect.theme)
      }
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message })
    },
  })

  const gold = character?.gold || 0
  const ownedItems = inventory?.map((i: any) => i.itemId) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Item Shop</h1>
          <p className="text-[rgb(var(--text-muted))]">Spend your gold on powerful items</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[rgb(var(--surface))] px-4 py-2">
          <Coins className="h-5 w-5 text-[rgb(var(--gold))]" />
          <span className="text-lg font-bold text-[rgb(var(--gold))]">{gold}</span>
        </div>
      </div>

      {/* Shop Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SHOP_ITEMS.map((item, index) => {
          const canAfford = gold >= item.price
          const isOwned = ownedItems.includes(item.id)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`card-hover cursor-pointer p-4 ${rarityColors[item.rarity]} border ${
                  !canAfford && !isOwned ? 'opacity-60' : ''
                }`}
                onClick={() => !isOwned && setSelectedItem(item)}
              >
                <div className="mb-3 text-center text-4xl">{item.icon}</div>
                <h3 className="text-center font-semibold text-[rgb(var(--text))]">{item.name}</h3>
                <p className="mt-1 text-center text-xs text-[rgb(var(--text-muted))]">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-[rgb(var(--surface))] px-2 py-0.5 text-xs">
                    {item.rarity}
                  </span>
                  {isOwned ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <Check className="h-3 w-3" /> Owned
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-bold text-[rgb(var(--gold))]">
                      <Coins className="h-4 w-4" /> {item.price}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Confirm Purchase"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-2 text-6xl">{selectedItem.icon}</div>
              <h3 className="text-xl font-bold text-[rgb(var(--text))]">{selectedItem.name}</h3>
              <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
                {selectedItem.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-lg">
              <Coins className="h-5 w-5 text-[rgb(var(--gold))]" />
              <span className="font-bold text-[rgb(var(--gold))]">{selectedItem.price} Gold</span>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button
                variant="gold"
                onClick={() => purchaseMutation.mutate(selectedItem.id)}
                loading={purchaseMutation.isPending}
                disabled={gold < selectedItem.price}
              >
                {gold < selectedItem.price ? 'Not Enough Gold' : 'Purchase'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}