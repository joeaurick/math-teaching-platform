import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { QuestionPicker } from './question-picker'

type PageProps = {
  params: Promise<{
    organization: string
    worksheetId: string
  }>
}

type Question = {
  id: string
  title: string
  question_type: string
  content: string
  status: string
  module_id: string
  modules:
    | {
        id: string
        title: string
      }
    | {
        id: string
        title: string
      }[]
    | null
}

type WorksheetQuestion = {
  question_id: string
}

export default async function WorksheetQuestionsPage({
  params,
}: PageProps) {
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
    .select('id, title, description, status')
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
  // 5. Semua questions organization
  // ------------------------------------------------------------

  const {
    data: questionData,
    error: questionsError,
  } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      question_type,
      content,
      status,
      module_id,
      modules (
        id,
        title
      )
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  if (questionsError) {
    throw new Error(
      `Gagal mengambil question bank: ${questionsError.message}`,
    )
  }

  const questions = (questionData ?? []) as Question[]

  // ------------------------------------------------------------
  // 6. Questions yang sudah masuk worksheet
  // ------------------------------------------------------------

  const {
    data: worksheetQuestionData,
    error: worksheetQuestionsError,
  } = await supabase
    .from('worksheet_questions')
    .select('question_id')
    .eq('worksheet_id', worksheet.id)

  if (worksheetQuestionsError) {
    throw new Error(
      `Gagal mengambil worksheet questions: ${worksheetQuestionsError.message}`,
    )
  }

  const existingQuestions =
    (worksheetQuestionData ?? []) as WorksheetQuestion[]

  const existingQuestionIds = existingQuestions.map(
    (item) => item.question_id,
  )

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-6">
          <Link
            href={`/${organization.slug}/worksheets/${worksheet.id}`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Worksheet
          </Link>
        </div>

        <PageHeader
          eyebrow="Worksheet"
          title="Add Questions"
          description={`Pilih soal dari Question Bank untuk "${worksheet.title}".`}
          actions={
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
          }
        />

        <div className="mt-8">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <FileQuestion className="h-5 w-5 text-white/50" />
                </div>

                <h2 className="text-base font-semibold">
                  Question Bank masih kosong
                </h2>

                <p className="mt-2 max-w-md text-sm text-white/40">
                  Buat question terlebih dahulu sebelum
                  menambahkannya ke worksheet.
                </p>

                <Link
                  href={`/${organization.slug}/questions/new`}
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
                >
                  Create Question
                </Link>
              </CardContent>
            </Card>
          ) : (
            <QuestionPicker
              organizationSlug={organization.slug}
              worksheetId={worksheet.id}
              questions={questions}
              existingQuestionIds={existingQuestionIds}
            />
          )}
        </div>
      </div>
    </div>
  )
}