import * as React from 'react'

import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'default'
  | 'muted'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'border-white/[0.12] bg-white/[0.08] text-white/80',

  muted:
    'border-white/[0.08] bg-white/[0.04] text-white/50',

  success:
    'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',

  warning:
    'border-amber-400/20 bg-amber-400/10 text-amber-300',

  danger:
    'border-red-400/20 bg-red-400/10 text-red-300',

  info:
    'border-blue-400/20 bg-blue-400/10 text-blue-300',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full',
        'border px-2.5 py-1',
        'text-xs font-medium',
        'leading-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}