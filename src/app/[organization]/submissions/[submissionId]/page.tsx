import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  UserRound,
} from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'
import { getStudentSubmissionImage } from '@/lib/submissions/get-student-submission-image'

import { GradeForm } from './grade-form'

type SubmissionDetailPageProps = {
  params: Promise<{
    organization: string
    submissionId: string
  }>
}

type Submission = {
  id: string
  organization_id: string
  student_name: string
  answer_text: string | null
  answer_numeric: number | null
  answer_option_id: string | null
  answer_image_path: string | null
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string | null
  created_at: string
  question_id: string
}

type Question = {
  id: string
  title: string
  question_type: string
  content: string
  explanation: string | null
  module_id: string
  module_title: string
}

type QuestionOption = {
  id: string
  option_text: string
  is_correct: boolean
  sort_order: number
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  short_answer: 'Jawaban Singkat',
  numeric: 'Numeric',
  essay: 'Esai',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Terkirim',
  graded: 'Dinilai',
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

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const {
    organization: slug,
    submissionId,
  } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. User
  // ------------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ------------------------------------------------------------
  // 2. Organization
  // ------------------------------------------------------------

  const {
    data: organization,
    error: organizationError,
  } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    notFound()
  }

  // ------------------------------------------------------------
  // 3. Membership
  // ------------------------------------------------------------

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organization.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    throw new Error(
      `Gagal mengambil membership: ${membershipError.message}`,
    )
  }

  if (!membership) {
    notFound()
  }

  // ------------------------------------------------------------
  // 4. Submission
  // ------------------------------------------------------------

  const {
    data: submission,
    error: submissionError,
  } = await supabase
    .from('student_submissions')
    .select(`
      id,
      organization_id,
      student_name,
      answer_text,
      answer_numeric,
      answer_option_id,
      answer_image_path,
      status,
      score,
      feedback,
      submitted_at,
      created_at,
      question_id
    `)
    .eq('id', submissionId)
    .eq('organization_id', organization.id)
    .maybeSingle()

  if (submissionError) {
    throw new Error(
      `Gagal mengambil submission: ${submissionError.message}`,
    )
  }

  if (!submission) {
    notFound()
  }

  // ------------------------------------------------------------
  // 5. Question
  // ------------------------------------------------------------

  const {
    data: questionData,
    error: questionError,
  } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      question_type,
      content,
      explanation,
      module_id,
      modules (
        id,
        title
      )
    `)
    .eq('id', submission.question_id)
    .eq('organization_id', organization.id)
    .maybeSingle()

  if (questionError) {
    throw new Error(
      `Gagal mengambil question: ${questionError.message}`,
    )
  }

  if (!questionData) {
    notFound()
  }

  const module = Array.isArray(questionData.modules)
    ? questionData.modules[0]
    : questionData.modules

  if (!module) {
    notFound()
  }

  const question: Question = {
    id: questionData.id,
    title: questionData.title,
    question_type: questionData.question_type,
    content: questionData.content,
    explanation: questionData.explanation,
    module_id: questionData.module_id,
    module_title: module.title,
  }

  // ------------------------------------------------------------
  // 6. Options
  // ------------------------------------------------------------

  const {
    data: optionsData,
    error: optionsError,
  } = await supabase
    .from('question_options')
    .select(`
      id,
      option_text,
      is_correct,
      sort_order
    `)
    .eq('question_id', question.id)
    .order('sort_order', {
      ascending: true,
    })

  if (optionsError) {
    throw new Error(
      `Gagal mengambil options: ${optionsError.message}`,
    )
  }

  const options = (optionsData ?? []) as QuestionOption[]

  const selectedOption = submission.answer_option_id
    ? options.find(
        (option) =>
          option.id === submission.answer_option_id,
      )
    : null

  // ------------------------------------------------------------
  // 7. Student Answer Image
  // ------------------------------------------------------------

  let submissionImageUrl: string | null = null

  if (submission.answer_image_path) {
    const imageResult =
      await getStudentSubmissionImage({
        submissionId: submission.id,
      })

    if (
      imageResult.success &&
      imageResult.signedUrl
    ) {
      submissionImageUrl =
        imageResult.signedUrl
    }
  }

  const questionType =
    questionTypeLabels[question.question_type] ??
    question.question_type

  const status =
    statusLabels[submission.status] ??
    submission.status

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------ */}
      {/* Header                                                 */}
      {/* ------------------------------------------------------ */}

      <div>
        <Link
          href={`/${organization.slug}/submissions`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Pengumpulan Siswa
        </Link>

        <PageHeader
          eyebrow="Student Submission"
          title={submission.student_name}
          description="Detail jawaban yang dikirim oleh siswa."
        />
      </div>

      {/* ------------------------------------------------------ */}
      {/* Submission Info                                       */}
      {/* ------------------------------------------------------ */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
              <UserRound className="h-5 w-5 text-sky-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Siswa
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {submission.student_name}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
              <FileText className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Status
              </p>

              <div className="mt-1">
                <Badge
                  variant={
                    submission.status === 'graded'
                      ? 'success'
                      : submission.status ===
                          'submitted'
                        ? 'warning'
                        : 'muted'
                  }
                >
                  {status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 !p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Nilai
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {submission.score !== null
                  ? submission.score
                  : 'Belum dinilai'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Question                                               */}
      {/* ------------------------------------------------------ */}

      <Card>
        <CardContent className="!p-6 sm:!p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">
              {questionType}
            </Badge>

            <span className="text-xs text-slate-500">
              {question.module_title}
            </span>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            {question.title}
          </h2>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {question.content}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* Student Answer                                        */}
      {/* ------------------------------------------------------ */}

      <Card>
        <CardContent className="!p-6 sm:!p-8">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Jawaban Siswa
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jawaban yang dikirim oleh{' '}
              {submission.student_name}.
            </p>
          </div>

          <div className="mt-6">
            {question.question_type ===
              'multiple_choice' ||
            question.question_type ===
              'true_false' ? (
              selectedOption ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-medium text-slate-500">
                    Pilihan yang dipilih
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {selectedOption.option_text}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Siswa tidak memilih jawaban.
                  </p>
                </div>
              )
            ) : question.question_type ===
              'numeric' ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">
                  Jawaban angka
                </p>

                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {submission.answer_numeric !==
                  null
                    ? submission.answer_numeric
                    : '-'}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {submission.answer_text || '-'}
                </p>
              </div>
            )}
          </div>

          {/* -------------------------------------------------- */}
          {/* Student Answer Image                              */}
          {/* -------------------------------------------------- */}

          {submissionImageUrl && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Foto Jawaban
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Foto pekerjaan yang dikirim oleh
                  siswa.
                </p>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={submissionImageUrl}
                  alt={`Foto jawaban ${submission.student_name}`}
                  className="mx-auto max-h-[720px] w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-400">
              Dikirim{' '}
              {formatDate(
                submission.submitted_at,
              )}
            </p>

            <Badge variant="info">
              {questionType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* Grading                                               */}
      {/* ------------------------------------------------------ */}

      <Card>
        <CardContent className="!p-6 sm:!p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Penilaian
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Berikan nilai dan feedback untuk siswa.
            </p>
          </div>

          <GradeForm
            submissionId={submission.id}
            organizationId={organization.id}
            currentScore={submission.score}
            currentFeedback={submission.feedback}
          />
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* Navigation                                             */}
      {/* ------------------------------------------------------ */}

      <div className="flex items-center justify-between">
        <Link
          href={`/${organization.slug}/submissions`}
        >
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  )
}