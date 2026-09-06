import * as React from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-col items-center justify-center',
        'rounded-2xl border border-dashed border-white/10',
        'bg-white/[0.015]',
        'px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/45">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}