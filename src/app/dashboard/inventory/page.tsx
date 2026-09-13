'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Backpack, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const { addToast, setTheme, theme } = useUIStore()

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory')
      if (!res.ok) throw new Error('Failed to fetch inventory')
      return res.json()
    },
  })

  const equipMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/inventory/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) throw new Error('Failed to equip')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['character'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      if (data.theme) {
        setTheme(data.theme)
      }
      addToast({ type: 'success', message: 'Item equipped!' })
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-40 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const themes = inventory?.filter((i: any) => i.item.type === 'THEME') || []
  const badges = inventory?.filter((i: any) => i.item.type === 'BADGE') || []
  const consumables = inventory?.filter((i: any) => i.item.type === 'CONSUMABLE') || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Inventory</h1>
        <p className="text-[rgb(var(--text-muted))]">Your collected items and gear</p>
      </div>

      {inventory?.length === 0 ? (
        <Card className="p-12 text-center">
          <Backpack className="mx-auto h-16 w-16 text-[rgb(var(--text-muted))]" />
          <h3 className="mt-4 text-xl font-semibold text-[rgb(var(--text))]">Inventory Empty</h3>
          <p className="mt-2 text-[rgb(var(--text-muted))]">
            Visit the shop to purchase your first items!
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Themes */}
          {themes.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Themes</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {themes.map((inv: any) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card
                      className={`p-4 ${
                        theme === inv.item.effect?.theme
                          ? 'border-[rgb(var(--primary))] pulse-glow'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{inv.item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[rgb(var(--text))]">{inv.item.name}</h3>
                          <p className="text-xs text-[rgb(var(--text-muted))]">{inv.item.description}</p>
                        </div>
                        {theme === inv.item.effect?.theme ? (
                          <span className="flex items-center gap-1 text-sm text-green-400">
                            <Check className="h-4 w-4" /> Active
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => equipMutation.mutate(inv.item.id)}
                          >
                            Equip
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Badges</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((inv: any) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="p-4 text-center">
                      <div className="mb-2 text-4xl">{inv.item.icon}</div>
                      <h3 className="font-semibold text-[rgb(var(--text))]">{inv.item.name}</h3>
                      <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
                        {inv.item.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Consumables */}
          {consumables.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[rgb(var(--text))]">Consumables</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {consumables.map((inv: any) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{inv.item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[rgb(var(--text))]">{inv.item.name}</h3>
                          <p className="text-xs text-[rgb(var(--text-muted))]">
                            {inv.item.description}
                          </p>
                          <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
                            Qty: {inv.quantity}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}