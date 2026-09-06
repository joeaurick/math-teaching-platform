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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student Submissions"
        title="Pengumpulan Siswa"
        description="Lihat jawaban yang telah dikirim oleh siswa."
        actions={
          <Link href={`/${organization.slug}/classes`}>
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
                {totalSubmissions}
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
                {submittedCount}
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

      {/* ------------------------------------------------------ */}
      {/* Submission List                                        */}
      {/* ------------------------------------------------------ */}

      <Card>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                <FileText className="h-5 w-5 text-white/50" />
              </div>

              <h3 className="text-base font-semibold">
                Belum ada submission
              </h3>

              <p className="mt-2 max-w-md text-sm text-white/50">
                Jawaban siswa yang dikirim akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {submissions.map((submission) => {
                const statusLabel =
                  statusLabels[submission.status] ??
                  submission.status

                const questionType =
                  questionTypeLabels[
                    submission.question_type
                  ] ??
                  submission.question_type

                return (
                  <div
                    key={submission.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                        <UserRound className="h-5 w-5 text-white/50" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {submission.student_name}
                          </h3>

                          <Badge>
                            {statusLabel}
                          </Badge>
                        </div>

                        <p className="mt-1 text-sm text-white/60">
                          {submission.question_title}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/35">
                          <span>
                            {submission.module_title}
                          </span>

                          <span>•</span>

                          <span>
                            {questionType}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(
                              submission.submitted_at,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 lg:shrink-0">
                      {submission.score !== null && (
                        <div className="text-right">
                          <p className="text-xs text-white/35">
                            Nilai
                          </p>

                          <p className="text-sm font-semibold">
                            {submission.score}
                          </p>
                        </div>
                      )}

                      <Link
                        href={`/${organization.slug}/submissions/${submission.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.12] bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
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