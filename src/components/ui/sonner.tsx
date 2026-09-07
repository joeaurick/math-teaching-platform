'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'border border-slate-200 bg-white text-slate-900 shadow-[0_16px_50px_rgba(15,23,42,0.12)]',
          title:
            'text-sm font-medium text-slate-900',
          description:
            'text-xs leading-5 text-slate-500',
          actionButton:
            'rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800',
          cancelButton:
            'rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50',
          closeButton:
            'border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700',
        },
      }}
    />
  )
}