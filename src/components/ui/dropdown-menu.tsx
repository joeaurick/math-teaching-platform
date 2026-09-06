'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'

export const DropdownMenu =
  DropdownMenuPrimitive.Root

export const DropdownMenuTrigger =
  DropdownMenuPrimitive.Trigger

export const DropdownMenuGroup =
  DropdownMenuPrimitive.Group

export const DropdownMenuPortal =
  DropdownMenuPrimitive.Portal

export const DropdownMenuSub =
  DropdownMenuPrimitive.Sub

export const DropdownMenuRadioGroup =
  DropdownMenuPrimitive.RadioGroup

export const DropdownMenuSubTrigger =
  DropdownMenuPrimitive.SubTrigger

export const DropdownMenuSubContent =
  DropdownMenuPrimitive.SubContent

export const DropdownMenuRadioItem =
  DropdownMenuPrimitive.RadioItem

export const DropdownMenuCheckboxItem =
  DropdownMenuPrimitive.CheckboxItem

export const DropdownMenuLabel =
  DropdownMenuPrimitive.Label

export const DropdownMenuSeparator =
  DropdownMenuPrimitive.Separator

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center',
        'rounded-lg px-3 py-2',
        'text-sm text-white/75',
        'outline-none',
        'transition-colors',
        'focus:bg-white/8 focus:text-white',
        'data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-35',
        className,
      )}
      {...props}
    />
  )
})

DropdownMenuItem.displayName =
  DropdownMenuPrimitive.Item.displayName

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-44 overflow-hidden',
          'rounded-xl',
          'border border-white/10',
          'bg-[#151515]',
          'p-1.5',
          'shadow-[0_16px_50px_rgba(0,0,0,0.4)]',
          'data-[state=open]:animate-in',
          'data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0',
          'data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
})

DropdownMenuContent.displayName =
  DropdownMenuPrimitive.Content.displayName

export function DropdownMenuLabelStyled({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'px-3 py-2 text-xs font-medium text-white/35',
        className,
      )}
      {...props}
    />
  )
}

export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto pl-4 text-xs tracking-widest text-white/25',
        className,
      )}
      {...props}
    />
  )
}