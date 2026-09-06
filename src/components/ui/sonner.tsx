'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'border-white/10 bg-[#151515] text-white shadow-[0_16px_50px_rgba(0,0,0,0.4)]',
          title: 'text-sm font-medium text-white',
          description: 'text-xs text-white/45',
          actionButton:
            'rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black',
          cancelButton:
            'rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white/60',
          closeButton:
            'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white',
        },
      }}
    />
  )
}