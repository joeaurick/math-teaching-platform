'use client'

import { useState, useTransition } from 'react'
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Loader2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import {
  moveWorksheetQuestion,
  removeQuestionFromWorksheet,
} from './actions'

type WorksheetQuestion = {
  id: string
  question_id: string
  sort_order: number
  question: {
    id: string
    title: string
    question_type: string
    status: string
  } | null
}

type WorksheetQuestionListProps = {
  organizationSlug: string
  worksheetId: string
  questions: WorksheetQuestion[]
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  numeric: 'Numeric',
  essay: 'Essay',
}

export function WorksheetQuestionList({
  organizationSlug,
  worksheetId,
  questions,
}: WorksheetQuestionListProps) {
  const [isPending, startTransition] =
    useTransition()

  const [pendingAction, setPendingAction] =
    useState<string | null>(null)

  function handleMove(
    worksheetQuestionId: string,
    direction: 'up' | 'down',
  ) {
    const actionKey = `${worksheetQuestionId}-${direction}`

    setPendingAction(actionKey)

    startTransition(async () => {
      const result =
        await moveWorksheetQuestion({
          organizationSlug,
          worksheetId,
          worksheetQuestionId,
          direction,
        })

      setPendingAction(null)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        direction === 'up'
          ? 'Soal dipindahkan ke atas.'
          : 'Soal dipindahkan ke bawah.',
      )
    })
  }

  function handleRemove(
    worksheetQuestionId: string,
    questionTitle: string,
  ) {
    const confirmed = window.confirm(
      `Hapus soal "${questionTitle}" dari worksheet ini?`,
    )

    if (!confirmed) {
      return
    }

    setPendingAction(
      `${worksheetQuestionId}-remove`,
    )

    startTransition(async () => {
      const result =
        await removeQuestionFromWorksheet({
          organizationSlug,
          worksheetId,
          worksheetQuestionId,
        })

      setPendingAction(null)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        'Soal berhasil dihapus dari worksheet.',
      )
    })
  }

  if (questions.length === 0) {
    return (
      <Card className="overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm shadow-violet-100">
        <CardContent className="flex flex-col items-center justify-center !p-6 py-16 text-center sm:!p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
            <FileText className="h-6 w-6 text-violet-600" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            Belum ada soal
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Tambahkan soal dari Question Bank untuk mulai
            menyusun worksheet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((item, index) => {
        const question = item.question

        if (!question) {
          return null
        }

        const questionType =
          questionTypeLabels[
            question.question_type
          ] ?? question.question_type

        const isFirst = index === 0
        const isLast =
          index === questions.length - 1

        const moveUpKey = `${item.id}-up`
        const moveDownKey = `${item.id}-down`
        const removeKey = `${item.id}-remove`

        const isMovingUp =
          isPending &&
          pendingAction === moveUpKey

        const isMovingDown =
          isPending &&
          pendingAction === moveDownKey

        const isRemoving =
          isPending &&
          pendingAction === removeKey

        return (
          <Card
            key={item.id}
            className="group overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50/70 via-white to-white transition-all duration-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100/60"
          >
            <CardContent className="!p-4 sm:!p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sm font-semibold text-sky-700">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {question.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="info"
                        className="border-violet-200 bg-violet-50 text-violet-700"
                      >
                        {questionType}
                      </Badge>

                      <Badge
                        variant={
                          question.status ===
                          'published'
                            ? 'success'
                            : 'warning'
                        }
                        className="capitalize"
                      >
                        {question.status ===
                        'published'
                          ? 'Published'
                          : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={
                      isPending ||
                      isFirst
                    }
                    onClick={() =>
                      handleMove(
                        item.id,
                        'up',
                      )
                    }
                    aria-label="Pindahkan soal ke atas"
                    className="border-sky-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {isMovingUp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={
                      isPending ||
                      isLast
                    }
                    onClick={() =>
                      handleMove(
                        item.id,
                        'down',
                      )
                    }
                    aria-label="Pindahkan soal ke bawah"
                    className="border-sky-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {isMovingDown ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="danger"
                    size="icon"
                    disabled={isPending}
                    onClick={() =>
                      handleRemove(
                        item.id,
                        question.title,
                      )
                    }
                    aria-label="Hapus soal dari worksheet"
                    className="border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700"
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}