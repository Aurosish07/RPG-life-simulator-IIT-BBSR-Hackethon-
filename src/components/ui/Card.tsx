'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow' | 'gold'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border p-4',
          {
            'border-[rgb(var(--border))] bg-[rgb(var(--surface))]': variant === 'default',
            'border-[rgb(var(--border))] glass': variant === 'glass',
            'border-[rgb(var(--primary))] bg-[rgb(var(--surface))] pulse-glow': variant === 'glow',
            'border-[rgb(var(--gold))] bg-gradient-to-br from-[rgb(var(--surface))] to-[rgb(var(--gold))]/10':
              variant === 'gold',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }