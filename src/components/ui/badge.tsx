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
    'border border-blue-200 bg-blue-50 text-blue-700',

  muted:
    'border border-slate-200 bg-slate-100 text-slate-600',

  success:
    'border border-emerald-200 bg-emerald-50 text-emerald-700',

  warning:
    'border border-amber-200 bg-amber-50 text-amber-700',

  danger:
    'border border-rose-200 bg-rose-50 text-rose-700',

  info:
    'border border-cyan-200 bg-cyan-50 text-cyan-700',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-full',
        'border',
        'px-2.5 py-1',
        'text-xs font-medium',
        'leading-none',
        'whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}