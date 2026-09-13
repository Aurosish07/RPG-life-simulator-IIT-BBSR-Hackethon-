'use client'

import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { useUIStore } from '@/store/uiStore'
import { ATTRIBUTE_LABELS, ATTRIBUTE_ICONS } from '@/lib/rpg'

export function LevelUpModal() {
  const { showLevelUp, setShowLevelUp, levelUpData } = useUIStore()

  return (
    <Modal
      isOpen={showLevelUp}
      onClose={() => setShowLevelUp(false)}
      size="md"
    >
      <div className="text-center">
        {/* Confetti particles */}
        <div className="relative">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-20, -100 - Math.random() * 100],
                x: [-50 + Math.random() * 100],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
              style={{
                backgroundColor: ['#fbbf24', '#c084fc', '#22c55e', '#ef4444', '#3b82f6'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="mb-4 text-6xl"
        >
          🎉
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-3xl font-bold text-gradient"
        >
          Level Up!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-lg text-[rgb(var(--text-muted))]"
        >
          You&apos;ve reached Level {levelUpData?.newLevel || 2}!
        </motion.p>

        {levelUpData?.statGains && Object.keys(levelUpData.statGains).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 rounded-lg bg-[rgb(var(--surface))] p-4"
          >
            <h3 className="mb-3 text-sm font-medium text-[rgb(var(--text-muted))]">
              Stat Increases
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(levelUpData.statGains).map(([stat, gain]) => {
                const key = stat.toUpperCase() as keyof typeof ATTRIBUTE_LABELS
                return (
                  <div
                    key={stat}
                    className="flex items-center gap-2 rounded-full bg-[rgb(var(--primary))]/20 px-3 py-1"
                  >
                    <span>{ATTRIBUTE_ICONS[key]}</span>
                    <span className="text-sm font-medium text-[rgb(var(--text))]">
                      {ATTRIBUTE_LABELS[key]} +{gain}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLevelUp(false)}
          className="rounded-lg bg-[rgb(var(--primary))] px-6 py-3 font-medium text-white transition-all hover:brightness-110"
        >
          Continue Adventure
        </motion.button>
      </div>
    </Modal>
  )
}