'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { gradeStudentSubmission } from './actions'

type GradeFormProps = {
  submissionId: string
  organizationId: string
  currentScore: number | null
  currentFeedback: string | null
}

export function GradeForm({
  submissionId,
  organizationId,
  currentScore,
  currentFeedback,
}: GradeFormProps) {
  const router = useRouter()

  const [score, setScore] = useState(
    currentScore !== null
      ? String(currentScore)
      : '',
  )

  const [feedback, setFeedback] = useState(
    currentFeedback ?? '',
  )

  const [error, setError] = useState('')

  const [isPending, startTransition] =
    useTransition()

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')

    const parsedScore = Number(score)

    if (!score.trim()) {
      setError('Nilai wajib diisi.')
      return
    }

    if (
      !Number.isFinite(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 100
    ) {
      setError(
        'Nilai harus berada antara 0 dan 100.',
      )
      return
    }

    startTransition(async () => {
      const result =
        await gradeStudentSubmission({
          submissionId,
          organizationId,
          score: parsedScore,
          feedback,
        })

      if (!result.success) {
        setError(
          result.error ??
            'Gagal menyimpan penilaian.',
        )
        return
      }

      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="score"
          className="mb-2 block text-sm font-medium"
        >
          Nilai
        </label>

        <div className="relative">
          <input
            id="score"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={score}
            disabled={isPending}
            onChange={(event) =>
              setScore(event.target.value)
            }
            placeholder="Masukkan nilai..."
            className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 pr-14 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
            / 100
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="feedback"
          className="mb-2 block text-sm font-medium"
        >
          Feedback
        </label>

        <textarea
          id="feedback"
          value={feedback}
          disabled={isPending}
          onChange={(event) =>
            setFeedback(event.target.value)
          }
          placeholder="Tulis feedback untuk siswa..."
          rows={5}
          className="w-full resize-y rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25 disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Penilaian'
          )}
        </Button>
      </div>
    </form>
  )
}