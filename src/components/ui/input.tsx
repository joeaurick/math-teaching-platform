import * as React from 'react'

import { cn } from '@/lib/utils'

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-11 w-full rounded-xl',
          'border border-white/12',
          'bg-white/4',
          'px-3.5 text-sm text-white',
          'placeholder:text-white/30',
          'outline-none',
          'transition-all duration-200',
          'hover:border-white/18',
          'focus:border-white/30',
          'focus:bg-white/6',
          'focus:ring-2 focus:ring-white/6',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'