'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'

export const AlertDialog = AlertDialogPrimitive.Root

export const AlertDialogTrigger =
  AlertDialogPrimitive.Trigger

export const AlertDialogCancel =
  AlertDialogPrimitive.Cancel

export const AlertDialogAction =
  AlertDialogPrimitive.Action

export const AlertDialogPortal =
  AlertDialogPrimitive.Portal

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50',
        'bg-black/70 backdrop-blur-sm',
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
})

AlertDialogOverlay.displayName =
  AlertDialogPrimitive.Overlay.displayName

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />

      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50',
          'w-[calc(100%-2rem)] max-w-md',
          '-translate-x-1/2 -translate-y-1/2',
          'rounded-2xl',
          'border border-white/10',
          'bg-[#111111]',
          'p-5',
          'shadow-[0_24px_80px_rgba(0,0,0,0.45)]',
          'outline-none',
          'data-[state=open]:animate-in',
          'data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0',
          'data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=open]:zoom-in-95',
          'sm:p-6',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})

AlertDialogContent.displayName =
  AlertDialogPrimitive.Content.displayName

export function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        className,
      )}
      {...props}
    />
  )
}

export function AlertDialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        'text-lg font-semibold tracking-tight text-white',
        className,
      )}
      {...props}
    />
  )
}

export function AlertDialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        'text-sm leading-6 text-white/45',
        className,
      )}
      {...props}
    />
  )
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}