import Link from 'next/link'
import {
  FileQuestion,
  Plus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { QuestionActions } from './question-actions'

type QuestionsPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function QuestionsPage({
  params,
}: QuestionsPageProps) {
  const { organization: slug } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  const {
    data: questions,
    error: questionsError,
  } = await supabase
    .from('questions')
    .select(`
      id,
      module_id,
      title,
      question_type,
      content,
      status,
      created_at,
      updated_at,
      deleted_at,
      modules (
        id,
        title
      )
    `)
    .eq('organization_id', organization.id)
    .is('deleted_at', null)
    .order('created_at', {
      ascending: false,
    })

  if (questionsError) {
    throw new Error(
      `Gagal mengambil questions: ${questionsError.message}`,
    )
  }

  const questionIds = questions.map(
    (question) => question.id,
  )

  let usedQuestionIds = new Set<string>()

  if (questionIds.length > 0) {
    const [
      {
        data: worksheetQuestions,
        error: worksheetError,
      },
      {
        data: submissions,
        error: submissionsError,
      },
    ] = await Promise.all([
      supabase
        .from('worksheet_questions')
        .select('question_id')
        .in('question_id', questionIds),

      supabase
        .from('student_submissions')
        .select('question_id')
        .in('question_id', questionIds),
    ])

    if (worksheetError) {
      throw new Error(
        `Gagal memeriksa worksheet questions: ${worksheetError.message}`,
      )
    }

    if (submissionsError) {
      throw new Error(
        `Gagal memeriksa student submissions: ${submissionsError.message}`,
      )
    }

    usedQuestionIds = new Set([
      ...(worksheetQuestions ?? []).map(
        (item) => item.question_id,
      ),
      ...(submissions ?? []).map(
        (item) => item.question_id,
      ),
    ])
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="Question Builder"
          description="Create and manage mathematics questions for your modules."
          actions={
            <Link
              href={`/${organization.slug}/questions/new`}
            >
              <Button
                type="button"
                variant="primary"
                size="md"
              >
                <Plus className="h-4 w-4" />
                New Question
              </Button>
            </Link>
          }
        />

        {questions.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={
                <FileQuestion className="h-5 w-5 text-sky-600" />
              }
              title="No questions yet"
              description="Create your first mathematics question."
              action={
                <Link
                  href={`/${organization.slug}/questions/new`}
                >
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                  >
                    <Plus className="h-4 w-4" />
                    Create Question
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {questions.map((question) => {
              const module = Array.isArray(
                question.modules,
              )
                ? question.modules[0]
                : question.modules

              const isUsed =
                usedQuestionIds.has(
                  question.id,
                )

              return (
                <Card
                  key={question.id}
                  className="h-full border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-slate-200/60"
                >
                  <CardContent className="!p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
                        <FileQuestion className="h-[18px] w-[18px] text-sky-600" />
                      </div>

                      <Badge
                        variant={
                          question.status ===
                          'published'
                            ? 'success'
                            : 'warning'
                        }
                        className="capitalize"
                      >
                        {question.status}
                      </Badge>
                    </div>

                    <Link
                      href={`/${organization.slug}/questions/${question.id}`}
                      className="group"
                    >
                      <h2 className="mt-5 line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-primary">
                        {question.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
                        {question.content}
                      </p>
                    </Link>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">
                        Module
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-slate-600">
                        {module?.title ||
                          'Unknown module'}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <Link
                        href={`/${organization.slug}/questions/${question.id}`}
                        className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Open Question
                      </Link>

                      <QuestionActions
  organizationSlug={organization.slug}
  questionId={question.id}
  questionTitle={question.title}
  isUsed={isUsed}
/>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}