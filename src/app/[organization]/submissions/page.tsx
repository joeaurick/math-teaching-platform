import Link from 'next/link'
import {
  CheckCircle2,
  Clock3,
  FileText,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type SubmissionsPageProps = {
  params: Promise<{
    organization: string
  }>
}

type Submission = {
  id: string
  student_name: string
  status: string
  score: number | null
  submitted_at: string | null
  created_at: string
  question_id: string
  question_title: string
  question_type: string
  module_id: string
  module_title: string
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Terkirim',
  graded: 'Dinilai',
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

export default async function SubmissionsPage({
  params,
}: SubmissionsPageProps) {
  const { organization: slug } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  const {
    data: submissionsData,
    error: submissionsError,
  } = await supabase
    .from('student_submissions')
    .select(`
      id,
      student_name,
      status,
      score,
      submitted_at,
      created_at,
      question_id,
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
    .eq('organization_id', organization.id)
    .order('submitted_at', {
      ascending: false,
      nullsFirst: false,
    })

  if (submissionsError) {
    throw new Error(
      `Gagal mengambil submissions: ${submissionsError.message}`,
    )
  }

  const submissions: Submission[] = (
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

      if (!module) {
        return null
      }

      return {
        id: item.id,
        student_name: item.student_name,
        status: item.status,
        score: item.score,
        submitted_at: item.submitted_at,
        created_at: item.created_at,
        question_id: question.id,
        question_title: question.title,
        question_type: question.question_type,
        module_id: module.id,
        module_title: module.title,
      }
    })
    .filter(
      (item): item is Submission => item !== null,
    )

  // ------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------

  const totalSubmissions = submissions.length

  const submittedCount = submissions.filter(
    (item) => item.status === 'submitted',
  ).length

  const gradedCount = submissions.filter(
    (item) => item.status === 'graded',
  ).length

  return (
    <div className="min-h-full space-y-8">
      <PageHeader
        eyebrow="Student Submissions"
        title="Pengumpulan Siswa"
        description="Lihat jawaban yang telah dikirim oleh siswa."
        actions={
          <Link
            href={`/${organization.slug}/classes`}
            className="shrink-0"
          >
            <Button variant="outline">
              Kelola Kelas
            </Button>
          </Link>
        }
      />

      {/* ------------------------------------------------------ */}
      {/* Statistics                                             */}
      {/* ------------------------------------------------------ */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100">
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
              <FileText className="h-5 w-5 text-sky-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-sky-700">
                Total Submission
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {totalSubmissions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100">
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-amber-700">
                Menunggu Penilaian
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {submittedCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm shadow-emerald-100">
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-emerald-700">
                Sudah Dinilai
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {gradedCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Submission List                                        */}
      {/* ------------------------------------------------------ */}

      <Card className="overflow-hidden border-violet-200 bg-white shadow-sm shadow-slate-200/60">
        <CardContent className="!p-0">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                Belum ada submission
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Jawaban siswa yang dikirim akan muncul di
                sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {submissions.map((submission) => {
                const statusLabel =
                  statusLabels[submission.status] ??
                  submission.status

                const questionType =
                  questionTypeLabels[
                    submission.question_type
                  ] ??
                  submission.question_type

                const statusVariant =
                  submission.status === 'graded'
                    ? 'success'
                    : submission.status ===
                        'submitted'
                      ? 'warning'
                      : 'muted'

                return (
                  <div
                    key={submission.id}
                    className="group flex flex-col gap-4 p-5 transition-colors duration-200 hover:bg-violet-50/50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 transition-colors duration-200 group-hover:border-sky-300 group-hover:bg-sky-100">
                        <UserRound className="h-5 w-5 text-sky-600" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {submission.student_name}
                          </h3>

                          <Badge
                            variant={statusVariant}
                            className={
                              submission.status ===
                              'submitted'
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : undefined
                            }
                          >
                            {statusLabel}
                          </Badge>
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                          {submission.question_title}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium text-violet-600">
                            {submission.module_title}
                          </span>

                          <span>•</span>

                          <span>{questionType}</span>

                          <span>•</span>

                          <span>
                            {formatDate(
                              submission.submitted_at,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 lg:shrink-0 lg:justify-end">
                      {submission.score !== null ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-right">
                          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-600">
                            Nilai
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                            {submission.score}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">
                          Belum dinilai
                        </div>
                      )}

                      <Link
                        href={`/${organization.slug}/submissions/${submission.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-medium text-violet-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-100 hover:text-violet-800"
                      >
                        Lihat
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}