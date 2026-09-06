import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  numeric: 'Numeric',
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
  //
  // Kita menggunakan student_access_id yang berasal
  // dari token yang sudah divalidasi oleh RPC workspace.
  //
  // RLS tetap berlaku pada client biasa.
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
    'Student'

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div>
          <Link
            href={`/student/${token}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Workspace
          </Link>

          <div>
            <p className="text-sm text-white/40">
              {workspace.organization_name}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Submissions
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Lihat jawaban dan hasil penilaian Anda,
              {` `}
              {studentName}.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Statistics                                           */}
        {/* ---------------------------------------------------- */}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <FileText className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Total Submission
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {totalCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <Clock3 className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Menunggu Penilaian
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {waitingCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <CheckCircle2 className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Sudah Dinilai
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {gradedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Submission List                                      */}
        {/* ---------------------------------------------------- */}

        <div className="mt-8">
          <Card>
            <CardContent className="p-0">
              {submissions.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                    <FileText className="h-5 w-5 text-white/30" />
                  </div>

                  <h2 className="mt-5 text-base font-semibold">
                    Belum ada submission
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                    Jawaban yang Anda kirim akan muncul
                    di sini.
                  </p>

                  <Link
                    href={`/student/${token}/worksheets`}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Lihat Worksheets
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
  className="block p-5 transition-colors hover:bg-white/[0.02] sm:p-6"
>
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge>
                                  {statusLabel}
                                </Badge>

                                <span className="text-xs text-white/35">
                                  {questionType}
                                </span>
                              </div>

                              <h2 className="mt-3 text-sm font-semibold text-white">
                                {
                                  submission.question_title
                                }
                              </h2>

                              {submission.worksheet_title && (
                                <p className="mt-1 text-sm text-white/40">
                                  {
                                    submission.worksheet_title
                                  }
                                </p>
                              )}

                              <p className="mt-2 text-xs text-white/30">
                                Dikirim{' '}
                                {formatDate(
                                  submission.submitted_at,
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-5 lg:shrink-0">
                              {isGraded && (
                                <div className="text-right">
                                  <p className="text-xs text-white/35">
                                    Nilai
                                  </p>

                                  <p className="mt-1 text-lg font-semibold">
                                    {submission.score ??
                                      '-'}
                                  </p>
                                </div>
                              )}

                              {isGraded &&
                                submission.feedback && (
                                  <div className="hidden max-w-xs md:block">
                                    <p className="text-xs text-white/35">
                                      Feedback
                                    </p>

                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
                                      {
                                        submission.feedback
                                      }
                                    </p>
                                  </div>
                                )}

                              <Badge
                                variant={
                                  isGraded
                                    ? 'success'
                                    : 'default'
                                }
                              >
                                {isGraded
                                  ? 'Dinilai'
                                  : 'Menunggu'}
                              </Badge>
                            </div>
                          </div>

                          {isGraded &&
                            submission.feedback && (
                              <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 md:hidden">
                                <p className="text-xs text-white/35">
                                  Feedback Guru
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/55">
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
        </div>
      </main>
    </div>
  )
}