'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { createWorksheet } from './actions'

type WorksheetFormProps = {
  organizationSlug: string
}

export function WorksheetForm({
  organizationSlug,
}: WorksheetFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      const result = await createWorksheet({
        organizationSlug,
        title,
        description,
      })

      if (!result.success) {
        setError(
          result.error ?? 'Gagal membuat worksheet.',
        )
        return
      }

      router.push(
        `/${organizationSlug}/worksheets/${result.worksheetId}`,
      )
    })
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-white"
            >
              Worksheet Title
            </label>

            <p className="mt-1 text-xs text-white/40">
              Berikan nama yang jelas untuk worksheet.
            </p>

            <input
              id="title"
              type="text"
              value={title}
              disabled={isPending}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Contoh: Latihan Persamaan Linear"
              className="mt-3 h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-white"
            >
              Description
            </label>

            <p className="mt-1 text-xs text-white/40">
              Deskripsi worksheet bersifat opsional.
            </p>

            <textarea
              id="description"
              value={description}
              disabled={isPending}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Contoh: Latihan mandiri materi persamaan linear."
              rows={5}
              className="mt-3 w-full resize-y rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                router.push(
                  `/${organizationSlug}/worksheets`,
                )
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Worksheet'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}