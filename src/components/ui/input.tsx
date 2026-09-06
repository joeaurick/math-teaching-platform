import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full',
        'rounded-xl',
        'border border-slate-200',
        'bg-white',
        'px-3.5 py-2',
        'text-sm text-slate-900',
        'shadow-sm shadow-slate-200/40',
        'outline-none',
        'transition-all duration-200',
        'placeholder:text-slate-400',
        'hover:border-slate-300',
        'focus:border-primary',
        'focus:ring-2 focus:ring-primary/15',
        'disabled:cursor-not-allowed',
        'disabled:bg-slate-50',
        'disabled:text-slate-400',
        'disabled:opacity-70',
        'file:mr-3',
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium',
        'file:text-slate-700',
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }