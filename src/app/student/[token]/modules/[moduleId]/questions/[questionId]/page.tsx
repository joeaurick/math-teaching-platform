import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

import { QuestionAnswerForm } from './question-answer-form'

type StudentWorksheetQuestionPageProps = {
  params: Promise<{
    token: string
    worksheetId: string
    questionId: string
  }>
}

type StudentWorksheetQuestionRow = {
  worksheet_id: string
  worksheet_title: string
  question_id: string
  question_title: string
  question_type: string
  question_content: string
  question_explanation: string | null
  option_id: string | null
  option_text: string | null
  option_sort_order: number | null
}

type QuestionOption = {
  id: string
  text: string
  sortOrder: number
}

type SubmissionRow = {
  submission_id: string
  submission_status: string
  answer_text: string | null
  answer_numeric: number | null
  answer_option_id: string | null
  score: number | null
  feedback: string | null
  submitted_at: string | null
}

type WorksheetQuestionRow = {
  worksheet_id: string
  worksheet_title: string
  worksheet_description: string | null
  worksheet_status: string
  question_id: string
  question_title: string
  question_type: string
  question_content: string
  question_status: string
  sort_order: number
}

type WorksheetProgressRow = {
  question_id: string
  submission_id: string | null
  submission_status: string | null
  score: number | null
  feedback: string | null
  submitted_at: string | null
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  short_answer: 'Jawaban Singkat',
  numeric: 'Jawaban Angka',
  essay: 'Esai',
}

const questionTypeStyles: Record<string, string> = {
  multiple_choice:
    'border-sky-300/15 bg-sky-400/10 text-sky-200',
  true_false:
    'border-emerald-300/15 bg-emerald-400/10 text-emerald-200',
  short_answer:
    'border-violet-300/15 bg-violet-400/10 text-violet-200',
  numeric:
    'border-amber-300/15 bg-amber-400/10 text-amber-200',
  essay:
    'border-rose-300/15 bg-rose-400/10 text-rose-200',
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

export default async function StudentWorksheetQuestionPage({
  params,
}: StudentWorksheetQuestionPageProps) {
  const {
    token,
    worksheetId,
    questionId,
  } = await params

  const supabase = await createClient()

  // ============================================================
  // 1. Ambil soal yang sedang dibuka
  // ============================================================

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
      `Gagal mengambil soal: ${error.message}`,
    )
  }

  const rows =
    (data ?? []) as StudentWorksheetQuestionRow[]

  if (rows.length === 0) {
    notFound()
  }

  const question = rows[0]

  // ============================================================
  // 2. Options
  // ============================================================

  const options: QuestionOption[] = rows
    .filter(
      (row) =>
        row.option_id &&
        row.option_text !== null,
    )
    .map((row) => ({
      id: row.option_id as string,
      text: row.option_text as string,
      sortOrder:
        row.option_sort_order ?? 0,
    }))
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    )

  // ============================================================
  // 3. Submission soal saat ini
  // ============================================================

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
      `Gagal mengambil status jawaban: ${submissionError.message}`,
    )
  }

  const submission =
    (submissionData?.[0] as
      | SubmissionRow
      | undefined) ?? null

  const isSubmitted =
    submission?.submission_status ===
      'submitted' ||
    submission?.submission_status ===
      'graded'

  // ============================================================
  // 4. Ambil seluruh soal worksheet
  //
  // Dipakai untuk:
  // - posisi soal
  // - Previous
  // - Next
  // - progress
  // ============================================================

  const {
    data: worksheetData,
    error: worksheetError,
  } = await supabase.rpc(
    'get_student_worksheet_detail_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
    },
  )

  if (worksheetError) {
    throw new Error(
      `Gagal mengambil daftar soal worksheet: ${worksheetError.message}`,
    )
  }

  const worksheetRows =
    (worksheetData ??
      []) as WorksheetQuestionRow[]

  if (worksheetRows.length === 0) {
    notFound()
  }

  // ============================================================
  // 5. Urutkan berdasarkan sort_order
  // ============================================================

  const orderedQuestions =
    [...worksheetRows].sort(
      (a, b) =>
        a.sort_order - b.sort_order,
    )

  const currentIndex =
    orderedQuestions.findIndex(
      (item) =>
        item.question_id === questionId,
    )

  if (currentIndex === -1) {
    notFound()
  }

  const totalQuestions =
    orderedQuestions.length

  const currentQuestionNumber =
    currentIndex + 1

  const previousQuestion =
    currentIndex > 0
      ? orderedQuestions[
          currentIndex - 1
        ]
      : null

  const nextQuestion =
    currentIndex <
    orderedQuestions.length - 1
      ? orderedQuestions[
          currentIndex + 1
        ]
      : null

  // ============================================================
  // 6. Student progress
  // ============================================================

  const {
    data: progressData,
    error: progressError,
  } = await supabase.rpc(
    'get_student_worksheet_progress_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
    },
  )

  if (progressError) {
    throw new Error(
      `Gagal mengambil progress worksheet: ${progressError.message}`,
    )
  }

  const progressRows =
    (progressData ??
      []) as WorksheetProgressRow[]

  const progressMap = new Map(
    progressRows.map((item) => [
      item.question_id,
      item,
    ]),
  )

  const completedCount =
    orderedQuestions.filter(
      (item) => {
        const progress =
          progressMap.get(
            item.question_id,
          )

        return (
          progress?.submission_status ===
            'submitted' ||
          progress?.submission_status ===
            'graded'
        )
      },
    ).length

  const progressPercentage =
    totalQuestions > 0
      ? Math.round(
          (completedCount /
            totalQuestions) *
            100,
        )
      : 0

  // ============================================================
  // 7. Question type
  // ============================================================

  const questionType =
    questionTypeLabels[
      question.question_type
    ] ?? question.question_type

  const questionStyle =
    questionTypeStyles[
      question.question_type
    ] ??
    'border-white/[0.08] bg-white/[0.035] text-white/50'

  // ============================================================
  // 8. Submitted answer display
  // ============================================================

  let submittedAnswer: string | null = null

  if (submission) {
    if (
      question.question_type ===
        'multiple_choice' ||
      question.question_type ===
        'true_false'
    ) {
      const selectedOption =
        options.find(
          (option) =>
            option.id ===
            submission.answer_option_id,
        )

      submittedAnswer =
        selectedOption?.text ?? null
    } else if (
      question.question_type ===
      'numeric'
    ) {
      submittedAnswer =
        submission.answer_numeric !== null
          ? String(
              submission.answer_numeric,
            )
          : null
    } else {
      submittedAnswer =
        submission.answer_text?.trim() ||
        null
    }
  }

  // ============================================================
  // 9. Navigation URLs
  // ============================================================

  const worksheetUrl =
    `/student/${token}/worksheets/${worksheetId}`

  const previousQuestionUrl =
    previousQuestion
      ? `/student/${token}/worksheets/${worksheetId}/questions/${previousQuestion.question_id}`
      : null

  const nextQuestionUrl =
    nextQuestion
      ? `/student/${token}/worksheets/${worksheetId}/questions/${nextQuestion.question_id}`
      : null

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ================================================== */}
        {/* TOP NAVIGATION                                     */}
        {/* ================================================== */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={worksheetUrl}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Kembali ke Worksheet
            </span>

            <span className="sm:hidden">
              Kembali
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-white/25">
            <GraduationCap className="h-4 w-4 text-sky-300/60" />

            <span className="hidden sm:inline">
              Ruang Belajar
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* PROGRESS HEADER                                    */}
        {/* ================================================== */}

        <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/30">
                  Progress Worksheet
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Soal {currentQuestionNumber} dari{' '}
                  {totalQuestions}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {progressPercentage}%
                </p>

                <p className="text-[11px] text-white/25">
                  {completedCount} selesai
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-1.5">
              {orderedQuestions.map(
                (item, index) => {
                  const progress =
                    progressMap.get(
                      item.question_id,
                    )

                  const completed =
                    progress?.submission_status ===
                      'submitted' ||
                    progress?.submission_status ===
                      'graded'

                  const current =
                    index === currentIndex

                  return (
                    <Link
                      key={
                        item.question_id
                      }
                      href={`/student/${token}/worksheets/${worksheetId}/questions/${item.question_id}`}
                      aria-label={`Soal ${index + 1}`}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        current
                          ? 'bg-sky-300'
                          : completed
                            ? 'bg-emerald-400'
                            : 'bg-white/[0.08]'
                      }`}
                    />
                  )
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* WORKSHEET HEADER                                   */}
        {/* ================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[28px] border border-violet-300/10 bg-gradient-to-br from-violet-400/[0.08] via-sky-400/[0.035] to-transparent p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-400/[0.06] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-400/[0.045] blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-violet-300/15 bg-violet-400/10 text-violet-200">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Worksheet
              </Badge>

              <Badge className={questionStyle}>
                {questionType}
              </Badge>

              {isSubmitted && (
                <Badge
                  variant="success"
                  className="border-emerald-300/15 bg-emerald-400/10 text-emerald-200"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Sudah Dikirim
                </Badge>
              )}
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-white/30">
              {question.worksheet_title}
            </p>

            <div className="mt-2 flex items-end justify-between gap-5">
              <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {question.question_title}
              </h1>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[11px] uppercase tracking-[0.1em] text-white/25">
                  Pertanyaan
                </p>

                <p className="mt-1 text-2xl font-bold text-sky-200">
                  {String(
                    currentQuestionNumber,
                  ).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* QUESTION                                          */}
        {/* ================================================== */}

        <section className="mt-5">
          <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02] shadow-[0_20px_70px_rgba(0,0,0,0.15)]">
            <CardContent className="p-0">
              <div className="border-b border-white/[0.07] px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10 text-sm font-bold text-sky-200">
                      ?
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/25">
                        Pertanyaan {currentQuestionNumber}
                      </p>

                      <p className="mt-0.5 text-sm text-white/50">
                        {questionType}
                      </p>
                    </div>
                  </div>

                  {isSubmitted && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  )}
                </div>
              </div>

              <div className="px-5 py-6 sm:px-8 sm:py-8">
                {/* Question content */}

                <div className="rounded-2xl border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.045] via-white/[0.02] to-transparent p-5 sm:p-7">
                  <p className="whitespace-pre-wrap text-base leading-8 text-white/80 sm:text-lg sm:leading-9">
                    {question.question_content}
                  </p>
                </div>

                {/* ==================================================
                    SUBMITTED
                ================================================== */}

                {isSubmitted ? (
                  <div className="mt-8">
                    <div className="overflow-hidden rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.035]">
                      <div className="border-b border-emerald-300/10 px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10">
                            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                          </div>

                          <div>
                            <h2 className="text-sm font-semibold text-white">
                              Jawaban Sudah Dikirim
                            </h2>

                            <p className="mt-0.5 text-xs text-white/35">
                              Jawaban Anda sudah tercatat.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 p-5 sm:p-6">
                        {submittedAnswer && (
                          <div>
                            <p className="text-xs font-medium text-white/30">
                              Jawaban Anda
                            </p>

                            <div className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-4">
                              <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                                {submittedAnswer}
                              </p>
                            </div>
                          </div>
                        )}

                        {submission?.submitted_at && (
                          <div className="flex items-center gap-2 text-xs text-white/30">
                            <Clock3 className="h-3.5 w-3.5" />

                            <span>
                              Dikirim{' '}
                              {formatDate(
                                submission.submitted_at,
                              )}
                            </span>
                          </div>
                        )}

                        {submission?.score !==
                          null &&
                          submission?.score !==
                            undefined && (
                            <div className="rounded-2xl border border-amber-300/10 bg-amber-400/[0.035] p-5">
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-400/10">
                                  <Trophy className="h-5 w-5 text-amber-300" />
                                </div>

                                <div>
                                  <p className="text-xs text-white/30">
                                    Nilai Anda
                                  </p>

                                  <p className="mt-1 text-2xl font-bold text-white">
                                    {submission.score}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {submission?.feedback && (
                          <div>
                            <p className="text-xs font-medium text-white/30">
                              Feedback Guru
                            </p>

                            <div className="mt-2 rounded-xl border border-violet-300/10 bg-violet-400/[0.035] px-4 py-4">
                              <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
                                {submission.feedback}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================================================
                     ANSWER FORM
                  ================================================== */

                  <div className="mt-8 border-t border-white/[0.07] pt-8">
                    <div className="mb-5 flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10">
                        <Sparkles className="h-4 w-4 text-violet-300" />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          Tulis Jawaban Anda
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-white/35">
                          Pilih atau masukkan jawaban sesuai
                          dengan pertanyaan.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-6">
                      <QuestionAnswerForm
                        token={token}
                        worksheetId={worksheetId}
                        questionId={questionId}
                        questionType={
                          question.question_type
                        }
                        options={options}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================================================== */}
        {/* QUESTION NAVIGATION                                */}
        {/* ================================================== */}

        <section className="mt-5">
          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Previous */}

                <div>
                  {previousQuestionUrl ? (
                    <Link
                      href={
                        previousQuestionUrl
                      }
                    >
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4" />

                        <span className="hidden sm:inline">
                          Soal Sebelumnya
                        </span>

                        <span className="sm:hidden">
                          Sebelumnya
                        </span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                  )}
                </div>

                {/* Center */}

                <div className="order-first flex items-center justify-center gap-2 text-xs text-white/30 sm:order-none">
                  <span>
                    {currentQuestionNumber}
                  </span>

                  <span className="text-white/15">
                    /
                  </span>

                  <span>
                    {totalQuestions}
                  </span>
                </div>

                {/* Next */}

                <div>
                  {nextQuestionUrl ? (
                    <Link
                      href={nextQuestionUrl}
                    >
                      <Button
                        className="w-full sm:w-auto"
                      >
                        <span className="hidden sm:inline">
                          Soal Berikutnya
                        </span>

                        <span className="sm:hidden">
                          Berikutnya
                        </span>

                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={worksheetUrl}>
                      <Button
                        variant={
                          isSubmitted
                            ? 'outline'
                            : 'primary'
                        }
                        className="w-full sm:w-auto"
                      >
                        <span>
                          Kembali ke Worksheet
                        </span>

                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================================================== */}
        {/* TIP                                                 */}
        {/* ================================================== */}

        {!isSubmitted && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/10 bg-amber-400/[0.06]">
              <Sparkles className="h-3.5 w-3.5 text-amber-300/70" />
            </div>

            <div>
              <p className="text-xs font-medium text-white/50">
                Tips
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                Periksa kembali jawaban Anda sebelum
                mengirimkannya. Setelah dikirim, jawaban
                tidak dapat diubah.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}