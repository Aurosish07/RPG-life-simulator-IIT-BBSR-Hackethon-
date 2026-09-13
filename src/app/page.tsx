'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Swords, Shield, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: Swords,
    title: 'Epic Quests',
    description: 'Transform daily tasks into challenging quests with XP and gold rewards.',
  },
  {
    icon: Shield,
    title: 'Level Up',
    description: 'Watch your character grow stronger as you complete challenges.',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Unlock badges and rare items as you build streaks.',
  },
  {
    icon: Sparkles,
    title: 'Custom Themes',
    description: 'Personalize your adventure with unique visual themes.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 lg:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[rgb(var(--primary))]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[rgb(var(--secondary))]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-[rgb(var(--primary))]/20 px-4 py-2 text-sm font-medium text-[rgb(var(--primary))]">
              🎮 Gamify Your Life
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-5xl font-bold tracking-tight text-[rgb(var(--text))] lg:text-7xl"
          >
            Transform Tasks Into{' '}
            <span className="text-gradient">Epic Adventures</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-[rgb(var(--text-muted))] lg:text-xl"
          >
            Stop treating your goals like chores. Life RPG turns your daily tasks into quests,
            your progress into character stats, and your achievements into legendary loot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/register">
              <Button size="lg" className="text-lg">
                Start Your Adventure
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg" className="text-lg">
                Continue Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-[rgb(var(--text))] lg:text-4xl">
              Your Adventure Awaits
            </h2>
            <p className="mt-4 text-[rgb(var(--text-muted))]">
              Everything you need to turn life into a game worth playing.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hover rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--primary))]/20">
                  <feature.icon className="h-6 w-6 text-[rgb(var(--primary))]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[rgb(var(--text))]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[rgb(var(--text-muted))]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgb(var(--border))] px-4 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Built with ⚔️ for adventurers everywhere
          </p>
        </div>
      </footer>
    </div>
  )
}