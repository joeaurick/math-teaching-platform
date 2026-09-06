'use client'

import { useState, useTransition } from 'react'
import {
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { toggleWorksheetPublish } from './actions'

type WorksheetPublishButtonProps = {
  organizationSlug: string
  worksheetId: string
  status: string
}

export function WorksheetPublishButton({
  organizationSlug,
  worksheetId,
  status,
}: WorksheetPublishButtonProps) {
  const [isPending, startTransition] =
    useTransition()

  const [showConfirm, setShowConfirm] =
    useState(false)

  const isPublished = status === 'published'

  function handleToggle() {
    const nextStatus = isPublished
      ? 'draft'
      : 'published'

    if (!isPublished && !showConfirm) {
      setShowConfirm(true)
      return
    }

    startTransition(async () => {
      const result =
        await toggleWorksheetPublish({
          organizationSlug,
          worksheetId,
          status: nextStatus,
        })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      setShowConfirm(false)

      toast.success(
        nextStatus === 'published'
          ? 'Worksheet berhasil dipublish.'
          : 'Worksheet dikembalikan ke draft.',
      )
    })
  }

  if (showConfirm && !isPublished) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() =>
            setShowConfirm(false)
          }
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          Batal
        </Button>

        <Button
          size="sm"
          disabled={isPending}
          onClick={handleToggle}
          className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Konfirmasi Publish
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={
        isPublished
          ? 'outline'
          : 'primary'
      }
      size="sm"
      disabled={isPending}
      onClick={handleToggle}
      className={
        isPublished
          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
      }
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <>
          <XCircle className="h-4 w-4" />
          Unpublish
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  )
}