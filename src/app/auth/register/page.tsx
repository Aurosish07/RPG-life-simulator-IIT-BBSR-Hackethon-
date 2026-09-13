'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'

export default function RegisterPage() {
  const router = useRouter()
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addToast({
        type: 'error',
        message: 'Passwords do not match',
      })
      return
    }

    if (password.length < 6) {
      addToast({
        type: 'error',
        message: 'Password must be at least 6 characters',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      addToast({
        type: 'success',
        message: 'Account created! Welcome to Life RPG!',
      })
      router.push('/auth/login')
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Something went wrong',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[rgb(var(--primary))]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[rgb(var(--secondary))]/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-6 text-center">
            <span className="text-4xl">🎮</span>
            <h1 className="mt-4 text-2xl font-bold text-[rgb(var(--text))]">Begin Your Quest</h1>
            <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
              Create your adventurer account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Character Name"
              placeholder="Hero of Light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="hero@adventure.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Create Character
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}