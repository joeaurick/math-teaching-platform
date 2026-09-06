'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  FileText,
  Info,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
      className="space-y-6"
    >
      {/* SCORE */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <label
            htmlFor="score"
            className="text-sm font-medium text-white"
          >
            Nilai
          </label>

          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300/50" />
        </div>

        <div className="relative">
          <Input
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
            className="h-11 rounded-xl border-emerald-200/[0.10] bg-white/[0.03] px-4 pr-14 text-white placeholder:text-white/25 focus:border-emerald-300/30 focus:bg-emerald-400/[0.025]"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
            / 100
          </span>
        </div>

        <p className="mt-2 text-xs text-white/25">
          Masukkan nilai antara 0 sampai 100.
        </p>
      </div>

      {/* FEEDBACK */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <label
            htmlFor="feedback"
            className="text-sm font-medium text-white"
          >
            Feedback
          </label>

          <FileText className="h-3.5 w-3.5 text-violet-300/50" />
        </div>

        <Textarea
          id="feedback"
          value={feedback}
          disabled={isPending}
          onChange={(event) =>
            setFeedback(event.target.value)
          }
          placeholder="Tulis feedback untuk siswa..."
          rows={5}
          className="resize-y rounded-xl border-violet-200/[0.10] bg-white/[0.03] leading-6 text-white placeholder:text-white/25 focus:border-violet-300/30 focus:bg-violet-400/[0.025]"
        />

        <p className="mt-2 text-xs text-white/25">
          Berikan komentar yang membantu siswa memahami
          hasil pekerjaannya.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

          <p className="text-sm leading-5 text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* ACTION */}
      <div className="flex justify-end border-t border-white/[0.07] pt-5">
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