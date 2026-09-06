import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type StudentSubmissionsPageProps = {
  params: Promise<{
    token: string
  }>
}

type StudentSubmission = {
  id: string
  question_id: string
  student_name: string
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string | null
  question_title: string
  question_type: string
  worksheet_id: string | null
  worksheet_title: string | null
}

type StudentWorkspace = {
  access_id: string
  organization_id: string
  organization_name: string
  student_name: string | null
}

const statusLabels: Record<string, string> = {
  submitted: 'Menunggu Penilaian',
  graded: 'Sudah Dinilai',
  draft: 'Draft',
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  short_answer: 'Jawaban Singkat',
  numeric: 'Numerik',
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

export default async function StudentSubmissionsPage({
  params,
}: StudentSubmissionsPageProps) {
  const { token } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. Student workspace
  // ------------------------------------------------------------

  const {
    data: workspaceData,
    error: workspaceError,
  } = await supabase.rpc(
    'get_student_workspace_by_token',
    {
      access_token: token,
    },
  )

  if (workspaceError) {
    throw new Error(
      `Gagal mengambil student workspace: ${workspaceError.message}`,
    )
  }

  const workspace =
    (workspaceData?.[0] as StudentWorkspace | undefined) ??
    null

  if (!workspace) {
    notFound()
  }

  // ------------------------------------------------------------
  // 2. Student submissions
  // ------------------------------------------------------------

  const {
    data: submissionsData,
    error: submissionsError,
  } = await supabase
    .from('student_submissions')
    .select(`
      id,
      question_id,
      student_name,
      status,
      score,
      feedback,
      submitted_at,
      questions (
        id,
        title,
        question_type,
        module_id,
        modules (
          id,
          title
        )
      )
    `)
    .eq(
      'student_access_id',
      workspace.access_id,
    )
    .order('submitted_at', {
      ascending: false,
      nullsFirst: false,
    })

  if (submissionsError) {
    throw new Error(
      `Gagal mengambil submissions: ${submissionsError.message}`,
    )
  }

  const submissions: StudentSubmission[] = (
    submissionsData ?? []
  )
    .map((item) => {
      const question = Array.isArray(item.questions)
        ? item.questions[0]
        : item.questions

      if (!question) {
        return null
      }

      const module = Array.isArray(question.modules)
        ? question.modules[0]
        : question.modules

      return {
        id: item.id,
        question_id: question.id,
        student_name: item.student_name,
        status: item.status,
        score: item.score,
        feedback: item.feedback,
        submitted_at: item.submitted_at,
        question_title: question.title,
        question_type: question.question_type,
        worksheet_id: null as string | null,
        worksheet_title: module?.title ?? null,
      }
    })
    .filter(
      (item): item is StudentSubmission =>
        item !== null,
    )

  // ------------------------------------------------------------
  // 3. Statistics
  // ------------------------------------------------------------

  const totalCount = submissions.length

  const waitingCount = submissions.filter(
    (submission) =>
      submission.status === 'submitted',
  ).length

  const gradedCount = submissions.filter(
    (submission) =>
      submission.status === 'graded',
  ).length

  const studentName =
    workspace.student_name?.trim() ||
    'Siswa'

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-violet-300/10 bg-gradient-to-br from-violet-400/[0.07] via-sky-400/[0.04] to-emerald-400/[0.035] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-violet-300/[0.08]" />

          <div className="relative">
            <Link
              href={`/student/${token}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali ke Ruang Belajar
            </Link>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-xs font-medium text-violet-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hasil Belajar
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Jawaban Saya
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                  Lihat jawaban yang sudah Anda kirim,
                  nilai yang diberikan guru, dan feedback
                  untuk membantu proses belajar.
                </p>

                <p className="mt-4 text-sm text-white/35">
                  {workspace.organization_name} ·{' '}
                  {studentName}
                </p>
              </div>

              <Badge
                variant="info"
                className="w-fit"
              >
                {totalCount} Submission
              </Badge>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Statistics                                           */}
        {/* ---------------------------------------------------- */}

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <Card className="border-sky-300/10 bg-gradient-to-br from-sky-400/[0.06] to-transparent">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/10">
                <FileText className="h-5 w-5 text-sky-300" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Total Jawaban
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {totalCount}
                </p>

                <p className="mt-0.5 text-xs text-white/25">
                  Semua jawaban yang tersimpan
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-300/10 bg-gradient-to-br from-amber-400/[0.06] to-transparent">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Clock3 className="h-5 w-5 text-amber-300" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Menunggu Penilaian
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {waitingCount}
                </p>

                <p className="mt-0.5 text-xs text-white/25">
                  Masih menunggu guru
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/10 bg-gradient-to-br from-emerald-400/[0.06] to-transparent">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Sudah Dinilai
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {gradedCount}
                </p>

                <p className="mt-0.5 text-xs text-white/25">
                  Sudah mendapat hasil
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Submission List                                      */}
        {/* ---------------------------------------------------- */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Riwayat Jawaban
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Semua jawaban yang pernah Anda kirim akan
              tampil di sini.
            </p>
          </div>

          <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
            <CardContent className="p-0">
              {submissions.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/10 bg-sky-400/[0.06]">
                    <FileText className="h-6 w-6 text-sky-300/60" />
                  </div>

                  <h2 className="mt-5 text-base font-semibold text-white">
                    Belum ada jawaban
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                    Jawaban yang Anda kirim melalui
                    worksheet akan muncul di halaman ini.
                  </p>

                  <Link
                    href={`/student/${token}/worksheets`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
                  >
                    Lihat Worksheet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {submissions.map(
                    (submission) => {
                      const statusLabel =
                        statusLabels[
                          submission.status
                        ] ??
                        submission.status

                      const questionType =
                        questionTypeLabels[
                          submission.question_type
                        ] ??
                        submission.question_type

                      const isGraded =
                        submission.status ===
                        'graded'

                      return (
                        <Link
                          key={submission.id}
                          href={`/student/${token}/submissions/${submission.id}`}
                          className="group block p-5 transition-colors hover:bg-violet-400/[0.025] sm:p-6"
                        >
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                              <div
                                className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex ${
                                  isGraded
                                    ? 'bg-emerald-400/10'
                                    : 'bg-amber-400/10'
                                }`}
                              >
                                {isGraded ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                                ) : (
                                  <Clock3 className="h-5 w-5 text-amber-300" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant={
                                      isGraded
                                        ? 'success'
                                        : 'warning'
                                    }
                                  >
                                    {statusLabel}
                                  </Badge>

                                  <Badge variant="info">
                                    {questionType}
                                  </Badge>
                                </div>

                                <h2 className="mt-3 text-sm font-semibold text-white transition-colors group-hover:text-violet-200">
                                  {
                                    submission.question_title
                                  }
                                </h2>

                                {submission.worksheet_title && (
                                  <p className="mt-1 text-sm text-white/40">
                                    {submission.worksheet_title}
                                  </p>
                                )}

                                <p className="mt-2 text-xs text-white/30">
                                  Dikirim{' '}
                                  {formatDate(
                                    submission.submitted_at,
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-5 lg:shrink-0 lg:justify-end">
                              {isGraded && (
                                <div className="rounded-xl border border-emerald-300/10 bg-emerald-400/[0.05] px-4 py-2.5 text-right">
                                  <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-300/50">
                                    Nilai
                                  </p>

                                  <p className="mt-0.5 text-xl font-semibold text-emerald-200">
                                    {submission.score ??
                                      '-'}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm font-medium text-white/30 transition-colors group-hover:text-violet-200">
                                Lihat
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>

                          {isGraded &&
                            submission.feedback && (
                              <div className="mt-5 rounded-xl border border-violet-300/10 bg-violet-400/[0.035] p-4">
                                <p className="text-xs font-medium text-violet-200/60">
                                  Feedback Guru
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/50">
                                  {
                                    submission.feedback
                                  }
                                </p>
                              </div>
                            )}
                        </Link>
                      )
                    },
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Bottom Information                                   */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-8 border-sky-300/10 bg-gradient-to-r from-sky-400/[0.045] via-violet-400/[0.03] to-transparent">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

              <div>
                <p className="text-sm font-medium text-white/70">
                  Terus belajar dan perbaiki hasilmu
                </p>

                <p className="mt-1 text-xs leading-5 text-white/30">
                  Gunakan feedback dari guru untuk
                  memahami kesalahan dan meningkatkan
                  jawaban berikutnya.
                </p>
              </div>
            </div>

            <Link
              href={`/student/${token}/worksheets`}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
            >
              Lihat Worksheet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}