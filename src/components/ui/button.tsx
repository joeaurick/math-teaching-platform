import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-white/10 bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(255,255,255,0.08)] active:scale-[0.98]',

  secondary:
    'border border-white/[0.10] bg-white/[0.07] text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:border-white/[0.16] hover:bg-white/[0.11] active:scale-[0.98]',

  outline:
    'border border-white/[0.14] bg-transparent text-white/80 hover:border-white/[0.22] hover:bg-white/[0.06] hover:text-white active:scale-[0.98]',

  ghost:
    'border border-transparent bg-transparent text-white/60 hover:bg-white/[0.06] hover:text-white active:scale-[0.98]',

  danger:
    'border border-red-500/20 bg-red-500/[0.08] text-red-300 hover:border-red-500/30 hover:bg-red-500/[0.13] hover:text-red-200 active:scale-[0.98]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-10 w-10 p-0',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'whitespace-nowrap select-none cursor-pointer',
        'transition-all duration-200 ease-out',
        'outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/30',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}