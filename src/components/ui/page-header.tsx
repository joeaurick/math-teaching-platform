import * as React from 'react'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p
            className={cn(
              'mb-2',
              'text-xs font-semibold uppercase tracking-[0.12em]',
              'text-primary',
            )}
          >
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={cn(
            'text-2xl font-semibold tracking-tight',
            'text-slate-900',
            'sm:text-3xl',
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              'mt-2 max-w-2xl',
              'text-sm leading-relaxed',
              'text-slate-500',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}