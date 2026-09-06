'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  FileQuestion,
  Loader2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { addQuestionsToWorksheet } from './actions'

type Question = {
  id: string
  title: string
  question_type: string
  content: string
  status: string
  module_id: string
  modules:
    | {
        id: string
        title: string
      }
    | {
        id: string
        title: string
      }[]
    | null
}

type QuestionPickerProps = {
  organizationSlug: string
  worksheetId: string
  questions: Question[]
  existingQuestionIds: string[]
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  numeric: 'Numeric',
  essay: 'Essay',
}

export function QuestionPicker({
  organizationSlug,
  worksheetId,
  questions,
  existingQuestionIds,
}: QuestionPickerProps) {
  const router = useRouter()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  function toggleQuestion(questionId: string) {
    setSelectedIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    )
  }

  function handleAdd() {
    if (selectedIds.length === 0) {
      setError('Pilih minimal satu question.')
      return
    }

    setError('')

    startTransition(async () => {
      const result = await addQuestionsToWorksheet({
        organizationSlug,
        worksheetId,
        questionIds: selectedIds,
      })

      if (!result.success) {
        setError(
          result.error ??
            'Gagal menambahkan questions.',
        )
        return
      }

      router.push(
        `/${organizationSlug}/worksheets/${worksheetId}`,
      )
      router.refresh()
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10">
              <FileQuestion className="h-4 w-4 text-violet-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Question Bank
              </h2>

              <p className="mt-0.5 text-sm text-white/40">
                {questions.length} question tersedia
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={
            isPending ||
            selectedIds.length === 0
          }
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menambahkan...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Add Selected
              {selectedIds.length > 0 &&
                ` (${selectedIds.length})`}
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-5 border-rose-400/20 bg-rose-400/[0.06]">
          <CardContent className="px-4 py-3">
            <p className="text-sm text-rose-300">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((question) => {
          const alreadyAdded =
            existingQuestionIds.includes(
              question.id,
            )

          const selected =
            selectedIds.includes(question.id)

          const module = Array.isArray(
            question.modules,
          )
            ? question.modules[0]
            : question.modules

          const questionType =
            questionTypeLabels[
              question.question_type
            ] ?? question.question_type

          return (
            <button
              key={question.id}
              type="button"
              disabled={
                alreadyAdded || isPending
              }
              onClick={() =>
                toggleQuestion(question.id)
              }
              className="block w-full text-left disabled:cursor-default"
            >
              <Card
                className={`overflow-hidden transition-all duration-200 ${
                  alreadyAdded
                    ? 'border-emerald-400/10 bg-emerald-400/[0.025] opacity-60'
                    : selected
                      ? 'border-sky-300/30 bg-gradient-to-r from-sky-400/[0.08] via-violet-400/[0.05] to-transparent shadow-lg shadow-sky-950/10'
                      : 'border-white/[0.08] bg-white/[0.025] hover:border-sky-300/20 hover:bg-white/[0.045]'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Selection indicator */}
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                        alreadyAdded ||
                        selected
                          ? 'border-sky-300 bg-sky-300 text-slate-950'
                          : 'border-white/[0.18] bg-white/[0.02] text-transparent'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex ${
                          alreadyAdded
                            ? 'bg-emerald-400/10'
                            : selected
                              ? 'bg-sky-400/10'
                              : 'bg-violet-400/10'
                        }`}
                      >
                        <FileQuestion
                          className={`h-4 w-4 ${
                            alreadyAdded
                              ? 'text-emerald-300'
                              : selected
                                ? 'text-sky-300'
                                : 'text-violet-300'
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {question.title}
                          </h3>

                          {alreadyAdded && (
                            <Badge variant="success">
                              Added
                            </Badge>
                          )}

                          {selected &&
                            !alreadyAdded && (
                              <Badge variant="info">
                                Selected
                              </Badge>
                            )}
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/40">
                          {question.content}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge variant="info">
                            {questionType}
                          </Badge>

                          <span className="text-xs text-white/35">
                            {module?.title ??
                              'Unknown module'}
                          </span>

                          <span className="text-xs capitalize text-white/30">
                            {question.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>

      {/* Floating selection bar */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border border-sky-300/15 bg-slate-950/95 p-4 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <div>
            <p className="text-sm font-medium text-white">
              {selectedIds.length} question dipilih
            </p>

            <p className="mt-0.5 text-xs text-white/35">
              Siap ditambahkan ke worksheet
            </p>
          </div>

          <Button
            onClick={handleAdd}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menambahkan...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Add Selected
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}