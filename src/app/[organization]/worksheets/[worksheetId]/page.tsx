import Link from 'next/link'
import {
  ArrowLeft,
  FileQuestion,
  Plus,
} from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { WorksheetQuestionList } from './worksheet-question-list'
import { WorksheetPublishButton } from './worksheet-publish-button'
import { WorksheetStudentAssignment } from './worksheet-student-assignment'

type WorksheetDetailPageProps = {
  params: Promise<{
    organization: string
    worksheetId: string
  }>
}

type Worksheet = {
  id: string
  organization_id: string
  title: string
  description: string | null
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

type WorksheetQuestion = {
  id: string
  question_id: string
  sort_order: number
  questions:
    | {
        id: string
        title: string
        question_type: string
        content: string
        status: string
      }
    | {
        id: string
        title: string
        question_type: string
        content: string
        status: string
      }[]
    | null
}

type StudentAccess = {
  id: string
  student_name: string | null
  is_active: boolean
  expires_at: string | null
}

export default async function WorksheetDetailPage({
  params,
}: WorksheetDetailPageProps) {
  const {
    organization: slug,
    worksheetId,
  } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  // ------------------------------------------------------------
  // Load independent worksheet data in parallel.
  // ------------------------------------------------------------

  const [
    worksheetResult,
    studentAccessResult,
  ] = await Promise.all([
    supabase
      .from('worksheets')
      .select(`
        id,
        organization_id,
        title,
        description,
        status,
        created_by,
        created_at,
        updated_at
      `)
      .eq('id', worksheetId)
      .eq('organization_id', organization.id)
      .maybeSingle(),

    supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active,
        expires_at
      `)
      .eq('organization_id', organization.id)
      .order('created_at', {
        ascending: false,
      }),
  ])

  const {
    data: worksheet,
    error: worksheetError,
  } = worksheetResult

  if (worksheetError) {
    throw new Error(
      `Gagal mengambil worksheet: ${worksheetError.message}`,
    )
  }

  if (!worksheet) {
    notFound()
  }

  const {
    data: studentAccesses,
    error: studentAccessError,
  } = studentAccessResult

  if (studentAccessError) {
    throw new Error(
      `Gagal mengambil student access: ${studentAccessError.message}`,
    )
  }

  // ------------------------------------------------------------
  // Load worksheet-dependent data in parallel.
  // ------------------------------------------------------------

  const [
    worksheetQuestionsResult,
    worksheetAssignmentsResult,
  ] = await Promise.all([
    supabase
      .from('worksheet_questions')
      .select(`
        id,
        question_id,
        sort_order,
        questions (
          id,
          title,
          question_type,
          content,
          status
        )
      `)
      .eq('worksheet_id', worksheet.id)
      .order('sort_order', {
        ascending: true,
      }),

    supabase
      .from('student_worksheets')
      .select('student_access_id')
      .eq('worksheet_id', worksheet.id),
  ])

  const {
    data: worksheetQuestionData,
    error: worksheetQuestionsError,
  } = worksheetQuestionsResult

  if (worksheetQuestionsError) {
    throw new Error(
      `Gagal mengambil worksheet questions: ${worksheetQuestionsError.message}`,
    )
  }

  const worksheetQuestions =
    (worksheetQuestionData ?? []) as WorksheetQuestion[]

  // ------------------------------------------------------------
  // Format Questions
  // ------------------------------------------------------------

  const questionList = worksheetQuestions.map((item) => {
    const question = Array.isArray(item.questions)
      ? item.questions[0] ?? null
      : item.questions

    return {
      id: item.id,
      question_id: item.question_id,
      sort_order: item.sort_order,
      question,
    }
  })

  const {
    data: worksheetAssignments,
    error: worksheetAssignmentsError,
  } = worksheetAssignmentsResult

  if (worksheetAssignmentsError) {
    throw new Error(
      `Gagal mengambil worksheet assignments: ${worksheetAssignmentsError.message}`,
    )
  }

  const assignedStudentAccessIds =
    (worksheetAssignments ?? []).map(
      (assignment) =>
        assignment.student_access_id,
    )

  const publishedQuestionCount =
    worksheetQuestions.filter(
      (item) => {
        const question = Array.isArray(
          item.questions,
        )
          ? item.questions[0]
          : item.questions

        return question?.status === 'published'
      },
    ).length

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Back */}

        <div className="mb-6">
          <Link
            href={`/${organization.slug}/worksheets`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Kembali ke Worksheets
          </Link>
        </div>

        {/* Header */}

        <PageHeader
          eyebrow="Worksheet"
          title={worksheet.title}
          description={
            worksheet.description ||
            'Tidak ada deskripsi worksheet.'
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  worksheet.status === 'published'
                    ? 'success'
                    : worksheet.status === 'archived'
                      ? 'muted'
                      : 'warning'
                }
                className="capitalize"
              >
                {worksheet.status}
              </Badge>

              <WorksheetPublishButton
                organizationSlug={organization.slug}
                worksheetId={worksheet.id}
                status={worksheet.status}
              />

              <Link
                href={`/${organization.slug}/worksheets/${worksheet.id}/questions`}
              >
                <Button>
                  <Plus className="h-4 w-4" />
                  Add Questions
                </Button>
              </Link>
            </div>
          }
        />

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="overflow-hidden border-sky-200/10 bg-gradient-to-br from-sky-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(56,189,248,0.04)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-sky-200/45">
                    Questions
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    {worksheetQuestions.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                  <FileQuestion className="h-5 w-5 text-sky-300" />
                </div>
              </div>

              <p className="mt-3 text-xs text-white/25">
                {publishedQuestionCount} published
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-violet-200/10 bg-gradient-to-br from-violet-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(139,92,246,0.04)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-violet-200/45">
                    Status
                  </p>

                  <p className="mt-1 text-base font-semibold capitalize text-white">
                    {worksheet.status}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10">
                  <span className="text-sm font-semibold text-violet-300">
                    W
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-white/25">
                Current worksheet status
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-amber-200/10 bg-gradient-to-br from-amber-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(251,191,36,0.04)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-amber-200/45">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {new Date(
                      worksheet.created_at,
                    ).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                  <span className="text-sm font-semibold text-amber-300">
                    +
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-white/25">
                Worksheet creation date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Questions */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Worksheet Questions
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Soal-soal yang akan dimasukkan ke worksheet.
            </p>
          </div>

          {worksheetQuestions.length === 0 ? (
            <EmptyState
              icon={
                <FileQuestion className="h-5 w-5" />
              }
              title="Belum ada soal"
              description="Tambahkan soal dari Question Bank ke worksheet ini."
              action={
                <Link
                  href={`/${organization.slug}/worksheets/${worksheet.id}/questions`}
                >
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Questions
                  </Button>
                </Link>
              }
            />
          ) : (
            <WorksheetQuestionList
              organizationSlug={organization.slug}
              worksheetId={worksheet.id}
              questions={questionList}
            />
          )}
        </div>

        {/* Students */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Students
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Atur student yang mendapatkan worksheet ini.
            </p>
          </div>

          <WorksheetStudentAssignment
            organizationSlug={organization.slug}
            worksheetId={worksheet.id}
            studentAccesses={
              (studentAccesses ?? []) as StudentAccess[]
            }
            assignedStudentAccessIds={
              assignedStudentAccessIds
            }
            worksheetStatus={worksheet.status}
          />
        </div>
      </div>
    </div>
  )
}