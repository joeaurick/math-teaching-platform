import * as React from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full resize-y rounded-xl',
        'border border-white/12',
        'bg-white/4',
        'px-3.5 py-3',
        'text-sm leading-6 text-white',
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
})

Textarea.displayName = 'Textarea'