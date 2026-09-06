import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileQuestion,
  Info,
  Play,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

type StudentWorksheetPageProps = {
  params: Promise<{
    token: string
    worksheetId: string
  }>
}

type WorksheetDetailRow = {
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

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function StudentWorksheetPage({
  params,
}: StudentWorksheetPageProps) {
  const {
    token,
    worksheetId,
  } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. Worksheet + Questions
  // ------------------------------------------------------------

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_worksheet_detail_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
    },
  )

  if (error) {
    throw new Error(
      `Gagal mengambil worksheet: ${error.message}`,
    )
  }

  const rows =
    (data ?? []) as WorksheetDetailRow[]

  if (rows.length === 0) {
    notFound()
  }

  const worksheet = {
    id: rows[0].worksheet_id,
    title: rows[0].worksheet_title,
    description:
      rows[0].worksheet_description,
    status: rows[0].worksheet_status,
  }

  // ------------------------------------------------------------
  // 2. Student Progress
  // ------------------------------------------------------------

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
    (progressData ?? []) as WorksheetProgressRow[]

  const progressMap = new Map(
    progressRows.map((item) => [
      item.question_id,
      item,
    ]),
  )

  // ------------------------------------------------------------
  // 3. Progress calculation
  // ------------------------------------------------------------

  const completedCount = rows.filter(
    (question) => {
      const progress =
        progressMap.get(
          question.question_id,
        )

      return (
        progress?.submission_status ===
          'submitted' ||
        progress?.submission_status ===
          'graded'
      )
    },
  ).length

  const totalQuestions = rows.length

  const progressPercentage =
    totalQuestions > 0
      ? Math.round(
          (completedCount /
            totalQuestions) *
            100,
        )
      : 0

  const isCompleted =
    totalQuestions > 0 &&
    completedCount === totalQuestions

  // ------------------------------------------------------------
  // 4. Find first unanswered question
  // ------------------------------------------------------------

  const firstUnansweredQuestion =
    rows.find((question) => {
      const progress =
        progressMap.get(
          question.question_id,
        )

      return !(
        progress?.submission_status ===
          'submitted' ||
        progress?.submission_status ===
          'graded'
      )
    }) ?? null

  const firstQuestion =
    rows[0] ?? null

  const continueQuestion =
    firstUnansweredQuestion ??
    firstQuestion

  const continueQuestionUrl =
    continueQuestion
      ? `/student/${token}/worksheets/${worksheet.id}/questions/${continueQuestion.question_id}`
      : null

  // ------------------------------------------------------------
  // 5. Worksheet status
  // ------------------------------------------------------------

  const worksheetStatus =
    isCompleted
      ? 'Selesai'
      : completedCount > 0
        ? 'Sedang Dikerjakan'
        : 'Belum Dikerjakan'

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Back                                                 */}
        {/* ---------------------------------------------------- */}

        <div className="mb-6">
          <Link
            href={`/student/${token}/worksheets`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke My Worksheets
          </Link>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <PageHeader
          eyebrow="Worksheet"
          title={worksheet.title}
          description={
            worksheet.description ||
            'Tidak ada deskripsi worksheet.'
          }
          actions={
            <Badge
              variant={
                worksheet.status ===
                'published'
                  ? 'success'
                  : 'muted'
              }
              className="capitalize"
            >
              {worksheet.status}
            </Badge>
          }
        />

        {/* ---------------------------------------------------- */}
        {/* Progress                                             */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-8">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-white/40">
                  Progress
                </p>

                <p className="mt-1 text-lg font-semibold sm:text-xl">
                  {completedCount} dari{' '}
                  {totalQuestions} soal selesai
                </p>

                <p className="mt-1 text-sm text-white/35">
                  {progressPercentage}% worksheet
                  telah dikerjakan.
                </p>
              </div>

              <div className="flex items-center gap-3 md:min-w-[180px] md:justify-end">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                  <ClipboardList className="h-5 w-5 text-white/50" />
                </div>

                <div>
                  <p className="text-xs text-white/35">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {worksheetStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* ---------------------------------------------------- */}
        {/* Main Action                                          */}
        {/* ---------------------------------------------------- */}

        {!isCompleted &&
          continueQuestionUrl && (
            <Card className="mt-5 overflow-hidden border-white/[0.10] bg-white/[0.025]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-semibold sm:text-lg">
                        {completedCount === 0
                          ? 'Mulai Mengerjakan'
                          : 'Lanjutkan Mengerjakan'}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-white/40">
                        {completedCount === 0
                          ? `Worksheet ini memiliki ${totalQuestions} soal. Mulai kerjakan dari soal pertama.`
                          : `Anda sudah mengerjakan ${completedCount} dari ${totalQuestions} soal. Lanjutkan untuk menyelesaikan worksheet ini.`}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={continueQuestionUrl}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      {completedCount === 0
                        ? 'Mulai Mengerjakan'
                        : 'Lanjutkan Mengerjakan'}

                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

        {/* ---------------------------------------------------- */}
        {/* Completed                                            */}
        {/* ---------------------------------------------------- */}

        {isCompleted && (
          <Card className="mt-5 border-white/[0.10] bg-white/[0.025]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold sm:text-lg">
                      Worksheet Selesai
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-white/40">
                      Semua soal telah dikerjakan.
                      Anda dapat melihat hasil setelah
                      dinilai oleh guru.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/student/${token}/submissions`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Lihat Hasil
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ---------------------------------------------------- */}
        {/* Question List                                        */}
        {/* ---------------------------------------------------- */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Daftar Soal
            </h2>

            <p className="mt-1 text-sm leading-6 text-white/40">
              Berikut adalah daftar soal dalam
              worksheet ini.
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {rows.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <FileQuestion className="h-5 w-5 text-white/30" />
                  </div>

                  <h3 className="mt-5 text-base font-medium text-white/80">
                    Belum ada soal
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                    Worksheet ini belum memiliki
                    soal.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {rows.map(
                    (question, index) => {
                      const progress =
                        progressMap.get(
                          question.question_id,
                        )

                      const isSubmitted =
                        progress?.submission_status ===
                          'submitted' ||
                        progress?.submission_status ===
                          'graded'

                      const isGraded =
                        progress?.submission_status ===
                        'graded'

                      const questionType =
                        questionTypeLabels[
                          question.question_type
                        ] ??
                        question.question_type

                      return (
                        <div
                          key={
                            question.question_id
                          }
                          className="p-4 transition-colors hover:bg-white/[0.02] sm:p-5"
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Number / Status */}

                            <div className="flex shrink-0 items-center gap-2">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium sm:h-10 sm:w-10 ${
                                  isSubmitted
                                    ? 'bg-white text-black'
                                    : 'bg-white/[0.06] text-white/60'
                                }`}
                              >
                                {isSubmitted ? (
                                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                            </div>

                            {/* Content */}

                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 flex-col gap-1">
                                <h3 className="truncate text-sm font-semibold text-white sm:text-[15px]">
                                  {question.question_title}
                                </h3>

                                <p className="line-clamp-2 text-xs leading-5 text-white/35 sm:text-sm sm:leading-6">
                                  {
                                    question.question_content
                                  }
                                </p>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <Badge>
                                  {questionType}
                                </Badge>

                                {isSubmitted ? (
                                  <Badge variant="success">
                                    Sudah Dikirim
                                  </Badge>
                                ) : (
                                  <Badge variant="muted">
                                    Belum Dikerjakan
                                  </Badge>
                                )}

                                {isGraded &&
                                  progress?.score !==
                                    null &&
                                  progress?.score !==
                                    undefined && (
                                    <span className="text-xs text-white/40">
                                      Nilai:{' '}
                                      <span className="font-medium text-white/70">
                                        {
                                          progress.score
                                        }
                                      </span>
                                    </span>
                                  )}
                              </div>

                              {isSubmitted &&
                                progress?.submitted_at && (
                                  <div className="mt-3 flex items-center gap-1.5 text-xs text-white/30">
                                    <Clock3 className="h-3.5 w-3.5" />

                                    Dikirim{' '}
                                    {formatDate(
                                      progress.submitted_at,
                                    )}
                                  </div>
                                )}
                            </div>

                            {/* Action */}

                            <div className="hidden shrink-0 sm:block">
                              <Link
                                href={`/student/${token}/worksheets/${worksheet.id}/questions/${question.question_id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
                              >
                                {isSubmitted
                                  ? 'Lihat Soal'
                                  : 'Kerjakan Soal'}

                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>

                          {/* Mobile Action */}

                          <div className="mt-4 pl-12 sm:hidden">
                            <Link
                              href={`/student/${token}/worksheets/${worksheet.id}/questions/${question.question_id}`}
                              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
                            >
                              {isSubmitted
                                ? 'Lihat Soal'
                                : 'Kerjakan Soal'}

                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Information                                         */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-5">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Info className="h-5 w-5 text-white/50" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold">
                  Informasi
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/40">
                  Setelah semua soal dikerjakan,
                  worksheet akan otomatis dianggap
                  selesai. Anda dapat melihat hasil dan
                  pembahasan setelah dinilai oleh guru.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}