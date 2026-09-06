import Link from 'next/link'
import {
  ArrowLeft,
  FileQuestion,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

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

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  // ------------------------------------------------------------
  // 1. Worksheet
  // ------------------------------------------------------------

  const {
    data: worksheet,
    error: worksheetError,
  } = await supabase
    .from('worksheets')
    .select(
      'id, title, description, status',
    )
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
  // 2. Question Bank + Existing Questions
  // ------------------------------------------------------------

  const [
    questionsResult,
    worksheetQuestionsResult,
  ] = await Promise.all([
    supabase
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
      .order('created_at', {
        ascending: false,
      }),

    supabase
      .from('worksheet_questions')
      .select('question_id')
      .eq('worksheet_id', worksheet.id),
  ])

  const {
    data: questionData,
    error: questionsError,
  } = questionsResult

  if (questionsError) {
    throw new Error(
      `Gagal mengambil question bank: ${questionsError.message}`,
    )
  }

  const {
    data: worksheetQuestionData,
    error: worksheetQuestionsError,
  } = worksheetQuestionsResult

  if (worksheetQuestionsError) {
    throw new Error(
      `Gagal mengambil worksheet questions: ${worksheetQuestionsError.message}`,
    )
  }

  const questions =
    (questionData ?? []) as Question[]

  const existingQuestions =
    (worksheetQuestionData ?? []) as WorksheetQuestion[]

  const existingQuestionIds =
    existingQuestions.map(
      (item) => item.question_id,
    )

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Back */}

        <div className="mb-6">
          <Link
            href={`/${organization.slug}/worksheets/${worksheet.id}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Kembali ke Worksheet
          </Link>
        </div>

        {/* Header */}

        <PageHeader
          eyebrow="Worksheet / Question Bank"
          title="Add Questions"
          description={`Pilih soal dari Question Bank untuk "${worksheet.title}".`}
          actions={
            <Badge
              variant={
                worksheet.status ===
                'published'
                  ? 'success'
                  : worksheet.status ===
                      'archived'
                    ? 'muted'
                    : 'warning'
              }
              className="capitalize"
            >
              {worksheet.status}
            </Badge>
          }
        />

        {/* Content */}

        <div className="mt-8">
          {questions.length === 0 ? (
            <Card className="overflow-hidden border-violet-200/10 bg-gradient-to-br from-violet-400/[0.05] via-white/[0.02] to-transparent">
              <CardContent className="flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10">
                  <FileQuestion className="h-6 w-6 text-violet-300/70" />
                </div>

                <h2 className="mt-5 text-base font-semibold text-white">
                  Question Bank masih kosong
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                  Buat question terlebih dahulu
                  sebelum menambahkannya ke
                  worksheet.
                </p>

                <Link
                  href={`/${organization.slug}/questions/new`}
                  className="mt-5"
                >
                  <Button>
                    Create Question
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <QuestionPicker
              organizationSlug={
                organization.slug
              }
              worksheetId={worksheet.id}
              questions={questions}
              existingQuestionIds={
                existingQuestionIds
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}