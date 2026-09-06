'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { submitStudentWorksheetAnswer } from './actions'

type QuestionOption = {
  id: string
  text: string
  sortOrder: number
}

type QuestionAnswerFormProps = {
  token: string
  worksheetId: string
  questionId: string
  questionType: string
  options: QuestionOption[]
}

export function QuestionAnswerForm({
  token,
  worksheetId,
  questionId,
  questionType,
  options,
}: QuestionAnswerFormProps) {
  const router = useRouter()

  const [selectedOption, setSelectedOption] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [numericAnswer, setNumericAnswer] = useState('')
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    setError('')

    startTransition(async () => {
      const result =
        await submitStudentWorksheetAnswer({
          token,
          worksheetId,
          questionId,
          questionType,
          optionId:
            selectedOption || undefined,
          textAnswer:
            textAnswer || undefined,
          numericAnswer:
            numericAnswer || undefined,
        })

      if (!result.success) {
        setError(
          result.error ??
            'Gagal mengirim jawaban.',
        )
        return
      }

      router.push(
        `/student/${token}/worksheets/${worksheetId}/questions/${questionId}/submitted`,
      )
    })
  }

  const submitButton = (
    <Button
      className="w-full sm:w-auto"
      disabled={isPending}
      onClick={handleSubmit}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Mengirim...
        </>
      ) : (
        'Kirim Jawaban'
      )}
    </Button>
  )

  if (questionType === 'multiple_choice') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Pilih jawaban
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Pilih salah satu jawaban yang menurut Anda
            benar.
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected =
              selectedOption === option.id

            return (
              <button
                key={option.id}
                type="button"
                disabled={isPending}
                onClick={() =>
                  setSelectedOption(option.id)
                }
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-white/30 bg-white/[0.08]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
                    isSelected
                      ? 'bg-white text-black'
                      : 'bg-white/[0.06] text-white/60'
                  }`}
                >
                  {String.fromCharCode(
                    65 + index,
                  )}
                </span>

                <span className="text-sm text-white/75">
                  {option.text}
                </span>
              </button>
            )
          })}
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="mt-6">
          {submitButton}
        </div>
      </div>
    )
  }

  if (questionType === 'true_false') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Pilih jawaban
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Tentukan apakah pernyataan tersebut benar
            atau salah.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected =
              selectedOption === option.id

            return (
              <button
                key={option.id}
                type="button"
                disabled={isPending}
                onClick={() =>
                  setSelectedOption(option.id)
                }
                className={`rounded-xl border p-5 text-left transition-colors ${
                  isSelected
                    ? 'border-white/30 bg-white/[0.08]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    isSelected
                      ? 'text-white'
                      : 'text-white/65'
                  }`}
                >
                  {option.text}
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="mt-6">
          {submitButton}
        </div>
      </div>
    )
  }

  if (questionType === 'short_answer') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Jawaban Anda
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Masukkan jawaban singkat.
          </p>
        </div>

        <input
          type="text"
          value={textAnswer}
          disabled={isPending}
          onChange={(event) =>
            setTextAnswer(event.target.value)
          }
          placeholder="Tulis jawaban Anda..."
          className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
        />

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="mt-6">
          {submitButton}
        </div>
      </div>
    )
  }

  if (questionType === 'numeric') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Jawaban Anda
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Masukkan jawaban dalam bentuk angka.
          </p>
        </div>

        <input
          type="number"
          value={numericAnswer}
          disabled={isPending}
          onChange={(event) =>
            setNumericAnswer(event.target.value)
          }
          placeholder="Masukkan angka..."
          className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
        />

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="mt-6">
          {submitButton}
        </div>
      </div>
    )
  }

  if (questionType === 'essay') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Jawaban Anda
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Jelaskan jawaban Anda secara lengkap.
          </p>
        </div>

        <textarea
          value={textAnswer}
          disabled={isPending}
          onChange={(event) =>
            setTextAnswer(event.target.value)
          }
          placeholder="Tulis jawaban Anda..."
          rows={8}
          className="w-full resize-y rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
        />

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="mt-6">
          {submitButton}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <p className="text-sm text-white/50">
        Tipe soal tidak dikenali.
      </p>
    </div>
  )
}

function ErrorMessage({
  message,
}: {
  message: string
}) {
  return (
    <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  )
}