'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Loader2,
  FilePlus2,
  AlignLeft,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
    <Card className="overflow-hidden border-sky-300/10 bg-gradient-to-br from-sky-400/[0.05] via-white/[0.025] to-violet-400/[0.04]">
      <CardContent className="p-6 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* Title */}

          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10">
                <FilePlus2 className="h-4 w-4 text-sky-300" />
              </div>

              <label
                htmlFor="title"
                className="text-sm font-semibold text-white"
              >
                Worksheet Title
              </label>
            </div>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Berikan nama yang jelas untuk
              worksheet.
            </p>

            <Input
              id="title"
              type="text"
              value={title}
              disabled={isPending}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Contoh: Latihan Persamaan Linear"
              className="mt-3"
            />
          </div>

          {/* Description */}

          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10">
                <AlignLeft className="h-4 w-4 text-violet-300" />
              </div>

              <label
                htmlFor="description"
                className="text-sm font-semibold text-white"
              >
                Description
              </label>
            </div>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Deskripsi worksheet bersifat
              opsional.
            </p>

            <Textarea
              id="description"
              value={description}
              disabled={isPending}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Contoh: Latihan mandiri materi persamaan linear."
              rows={5}
              className="mt-3"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm leading-5 text-rose-300">
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
                <>
                  <FilePlus2 className="h-4 w-4" />
                  Create Worksheet
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}