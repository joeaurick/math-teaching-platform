import Link from 'next/link'
import {
  ArrowLeft,
  FileQuestion,
  Plus,
} from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

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
    .select('id, role')
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
  // 4. Worksheet
  // ------------------------------------------------------------

  const {
    data: worksheet,
    error: worksheetError,
  } = await supabase
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
    .maybeSingle()

  if (worksheetError) {
    throw new Error(
      `Gagal mengambil worksheet: ${worksheetError.message}`,
    )
  }

  if (!worksheet) {
    notFound()
  }

  // ------------------------------------------------------------
  // 5. Worksheet Questions
  // ------------------------------------------------------------

  const {
    data: worksheetQuestionData,
    error: worksheetQuestionsError,
  } = await supabase
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
    .order('sort_order', { ascending: true })

  if (worksheetQuestionsError) {
    throw new Error(
      `Gagal mengambil worksheet questions: ${worksheetQuestionsError.message}`,
    )
  }

  const worksheetQuestions =
    (worksheetQuestionData ?? []) as WorksheetQuestion[]

  // ------------------------------------------------------------
  // 6. Format Questions
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

  // ------------------------------------------------------------
  // 7. Student Access
  // ------------------------------------------------------------

  const {
    data: studentAccesses,
    error: studentAccessError,
  } = await supabase
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
    })

  if (studentAccessError) {
    throw new Error(
      `Gagal mengambil student access: ${studentAccessError.message}`,
    )
  }

  // ------------------------------------------------------------
  // 8. Existing Worksheet Assignments
  // ------------------------------------------------------------

  const {
    data: worksheetAssignments,
    error: worksheetAssignmentsError,
  } = await supabase
    .from('student_worksheets')
    .select('student_access_id')
    .eq('worksheet_id', worksheet.id)

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

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Back */}

        <div className="mb-6">
          <Link
            href={`/${organization.slug}/worksheets`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Add Questions
              </Link>
            </div>
          }
        />

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Questions
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {worksheetQuestions.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Status
              </p>

              <p className="mt-2 text-sm font-medium capitalize">
                {worksheet.status}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Created
              </p>

              <p className="mt-2 text-sm font-medium">
                {new Date(
                  worksheet.created_at,
                ).toLocaleDateString('id-ID')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Questions */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
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
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Questions
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
            <h2 className="text-lg font-semibold">
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