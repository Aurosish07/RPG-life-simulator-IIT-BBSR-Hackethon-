'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'

export default function LoginPage() {
  const router = useRouter()
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        addToast({
          type: 'error',
          message: 'Invalid email or password',
        })
      } else {
        addToast({
          type: 'success',
          message: 'Welcome back, adventurer!',
        })
        router.push('/dashboard')
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Something went wrong. Please try again.',
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
            <span className="text-4xl">⚔️</span>
            <h1 className="mt-4 text-2xl font-bold text-[rgb(var(--text))]">Welcome Back</h1>
            <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
              Continue your adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[rgb(var(--text-muted))]">
              New to the adventure?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}