'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have expired or already been used.',
    Default: 'An unexpected error occurred.',
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-[rgb(var(--text))]">Authentication Error</h1>
          <p className="mt-2 text-[rgb(var(--text-muted))]">
            {errorMessages[error || 'Default']}
          </p>
          <Link href="/auth/login" className="mt-6 block">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--primary))] border-t-transparent" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}