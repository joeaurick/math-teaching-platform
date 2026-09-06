import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'icon'

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  }

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    [
      'border border-primary',
      'bg-primary',
      'text-primary-foreground',
      'shadow-sm shadow-primary/20',
      'hover:bg-primary/90',
      'hover:shadow-md hover:shadow-primary/20',
      'active:scale-[0.98]',
    ].join(' '),

  secondary:
    [
      'border border-violet-200',
      'bg-violet-50',
      'text-violet-700',
      'shadow-sm',
      'hover:border-violet-300',
      'hover:bg-violet-100',
      'active:scale-[0.98]',
    ].join(' '),

  outline:
    [
      'border border-slate-200',
      'bg-white',
      'text-slate-700',
      'shadow-sm',
      'hover:border-slate-300',
      'hover:bg-slate-50',
      'hover:text-slate-900',
      'active:scale-[0.98]',
    ].join(' '),

  ghost:
    [
      'border border-transparent',
      'bg-transparent',
      'text-slate-500',
      'hover:bg-slate-100',
      'hover:text-slate-900',
      'active:scale-[0.98]',
    ].join(' '),

  danger:
    [
      'border border-rose-200',
      'bg-rose-50',
      'text-rose-600',
      'shadow-sm',
      'hover:border-rose-300',
      'hover:bg-rose-100',
      'hover:text-rose-700',
      'active:scale-[0.98]',
    ].join(' '),
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
        'inline-flex items-center justify-center gap-2',
        'rounded-xl',
        'font-medium',
        'whitespace-nowrap',
        'select-none',
        'cursor-pointer',
        'transition-all duration-200 ease-out',
        'outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-primary/30',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        'disabled:pointer-events-none',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}