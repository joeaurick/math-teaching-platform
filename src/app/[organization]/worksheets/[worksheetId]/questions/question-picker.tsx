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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Question Bank
          </h2>

          <p className="mt-1 text-sm text-white/40">
            {questions.length} question tersedia
          </p>
        </div>

        <Button
          onClick={handleAdd}
          disabled={
            isPending || selectedIds.length === 0
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

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {questions.map((question) => {
          const alreadyAdded =
            existingQuestionIds.includes(question.id)

          const selected =
            selectedIds.includes(question.id)

          const module = Array.isArray(question.modules)
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
              disabled={alreadyAdded || isPending}
              onClick={() =>
                toggleQuestion(question.id)
              }
              className="block w-full text-left disabled:cursor-default"
            >
              <Card
                className={`transition-all duration-200 ${
                  alreadyAdded
                    ? 'opacity-50'
                    : selected
                      ? 'border-white/25 bg-white/[0.06]'
                      : 'hover:border-white/[0.16] hover:bg-white/[0.03]'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                        alreadyAdded || selected
                          ? 'border-white bg-white text-black'
                          : 'border-white/[0.18] bg-white/[0.02] text-transparent'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] sm:flex">
                        <FileQuestion className="h-4 w-4 text-white/45" />
                      </div>

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
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/35">
                          {question.content}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge>
                            {questionType}
                          </Badge>

                          <span className="text-xs text-white/30">
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

      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.10] bg-[#111111]/95 p-4 shadow-2xl backdrop-blur">
          <p className="text-sm text-white/60">
            {selectedIds.length} question dipilih
          </p>

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