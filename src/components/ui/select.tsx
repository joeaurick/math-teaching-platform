'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '@/lib/utils'

export const Select = SelectPrimitive.Root

export const SelectGroup = SelectPrimitive.Group

export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex h-11 w-full items-center justify-between',
        'rounded-xl',
        'border border-white/12',
        'bg-white/4',
        'px-3.5',
        'text-sm text-white',
        'outline-none',
        'transition-all duration-200',
        'hover:border-white/18',
        'focus:border-white/30',
        'focus:ring-2 focus:ring-white/6',
        'data-[placeholder]:text-white/30',
        'disabled:cursor-not-allowed disabled:opacity-40',
        '[&>span]:truncate',
        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-white/40"
          aria-hidden="true"
        >
          <path
            d="m7 10 5 5 5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

SelectTrigger.displayName =
  SelectPrimitive.Trigger.displayName

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'relative z-50 max-h-80 min-w-[8rem]',
          'overflow-hidden',
          'rounded-xl',
          'border border-white/10',
          'bg-[#151515]',
          'text-white',
          'shadow-[0_16px_50px_rgba(0,0,0,0.4)]',
          'data-[state=open]:animate-in',
          'data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0',
          'data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=open]:zoom-in-95',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1.5',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})

SelectContent.displayName =
  SelectPrimitive.Content.displayName

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none',
        'items-center rounded-lg',
        'py-2 pl-3 pr-9',
        'text-sm text-white/70',
        'outline-none',
        'transition-colors',
        'focus:bg-white/8 focus:text-white',
        'data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-35',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>

      <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="m5 12 4 4L19 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
})

SelectItem.displayName = SelectPrimitive.Item.displayName

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn(
        'my-1 h-px bg-white/8',
        className,
      )}
      {...props}
    />
  )
})

SelectSeparator.displayName =
  SelectPrimitive.Separator.displayName