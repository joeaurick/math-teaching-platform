import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

type SubmittedPageProps = {
  params: Promise<{
    token: string
    worksheetId: string
    questionId: string
  }>
}

type WorksheetQuestion = {
  question_id: string
  question_title: string
  question_type: string
  worksheet_title: string
}

type Submission = {
  id: string
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string | null
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function StudentWorksheetSubmittedPage({
  params,
}: SubmittedPageProps) {
  const {
    token,
    worksheetId,
    questionId,
  } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. Question
  // ------------------------------------------------------------

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_worksheet_question_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
    },
  )

  if (error) {
    throw new Error(
      `Gagal mengambil informasi soal: ${error.message}`,
    )
  }

  const rows =
    (data ?? []) as WorksheetQuestion[]

  if (rows.length === 0) {
    notFound()
  }

  const question = rows[0]

  // ------------------------------------------------------------
  // 2. Submission
  // ------------------------------------------------------------

  const {
    data: submissionData,
    error: submissionError,
  } = await supabase.rpc(
    'get_student_worksheet_question_submission_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
    },
  )

  if (submissionError) {
    throw new Error(
      `Gagal mengambil hasil submission: ${submissionError.message}`,
    )
  }

  const submissionRows =
    (submissionData ?? []) as Submission[]

  const submission =
    submissionRows.length > 0
      ? submissionRows[0]
      : null

  const isGraded =
    submission?.status === 'graded'

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader
          eyebrow={question.worksheet_title}
          title="Jawaban Terkirim"
          description="Jawaban Anda telah berhasil dikirim."
        />

        <div className="mt-8 space-y-6">
          {/* -------------------------------------------------- */}
          {/* Submission Status                                  */}
          {/* -------------------------------------------------- */}

          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06]">
                <CheckCircle2 className="h-8 w-8 text-white/70" />
              </div>

              <div className="mt-6">
                <Badge variant="success">
                  {isGraded
                    ? 'Dinilai'
                    : 'Submitted'}
                </Badge>
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                {isGraded
                  ? 'Jawaban sudah dinilai'
                  : 'Jawaban berhasil dikirim'}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                {isGraded
                  ? 'Guru telah memberikan nilai dan feedback untuk jawaban Anda.'
                  : 'Jawaban Anda untuk soal ini sudah tersimpan. Anda dapat kembali ke worksheet untuk melanjutkan soal berikutnya.'}
              </p>

              <div className="mt-8 w-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-left">
                <p className="text-xs text-white/35">
                  Soal
                </p>

                <p className="mt-2 text-sm font-medium text-white/80">
                  {question.question_title}
                </p>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href={`/student/${token}/worksheets/${worksheetId}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/90"
                >
                  <ClipboardList className="h-4 w-4" />
                  Kembali ke Worksheet
                </Link>

                <Link
                  href={`/student/${token}/worksheets`}
                >
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    My Worksheets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* -------------------------------------------------- */}
          {/* Grade                                               */}
          {/* -------------------------------------------------- */}

          {isGraded && submission && (
            <>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                      <CheckCircle2 className="h-5 w-5 text-white/60" />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">
                        Nilai Anda
                      </h2>

                      <p className="mt-1 text-xs text-white/40">
                        Hasil penilaian dari guru.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                    <p className="text-xs text-white/40">
                      Nilai
                    </p>

                    <p className="mt-2 text-4xl font-semibold tracking-tight">
                      {submission.score !== null
                        ? submission.score
                        : '-'}
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      dari 100
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ------------------------------------------------ */}
              {/* Feedback                                         */}
              {/* ------------------------------------------------ */}

              {submission.feedback && (
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                        <MessageSquare className="h-5 w-5 text-white/60" />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold">
                          Feedback Guru
                        </h2>

                        <p className="mt-1 text-xs text-white/40">
                          Catatan dari guru untuk jawaban Anda.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                        {submission.feedback}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ------------------------------------------------ */}
              {/* Graded Date                                      */}
              {/* ------------------------------------------------ */}

              <p className="text-center text-xs text-white/30">
                Jawaban dikirim{' '}
                {formatDate(
                  submission.submitted_at,
                )}
              </p>
            </>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* Back                                                 */}
        {/* ---------------------------------------------------- */}

        <div className="mt-6">
          <Link
            href={`/student/${token}/worksheets/${worksheetId}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke daftar soal
          </Link>
        </div>
      </main>
    </div>
  )
}