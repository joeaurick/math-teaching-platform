import Link from 'next/link'
import {
  FileQuestion,
  Plus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

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
      modules (
        id,
        title
      )
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  if (questionsError) {
    throw new Error(
      `Gagal mengambil questions: ${questionsError.message}`,
    )
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              New Question
            </Link>
          }
        />

        {questions.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<FileQuestion className="h-5 w-5" />}
              title="No questions yet"
              description="Create your first mathematics question."
              action={
                <Link
                  href={`/${organization.slug}/questions/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  Create Question
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {questions.map((question) => {
              const module = Array.isArray(question.modules)
                ? question.modules[0]
                : question.modules

              return (
                <Link
                  key={question.id}
                  href={`/${organization.slug}/questions/${question.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                          <FileQuestion className="h-[18px] w-[18px] text-white/55" />
                        </div>

                        <Badge
                          variant={
                            question.status === 'published'
                              ? 'success'
                              : question.status === 'archived'
                                ? 'muted'
                                : 'warning'
                          }
                          className="capitalize"
                        >
                          {question.status}
                        </Badge>
                      </div>

                      <h2 className="mt-5 line-clamp-2 text-base font-semibold text-white">
                        {question.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/35">
                        {question.content}
                      </p>

                      <div className="mt-5 border-t border-white/[0.07] pt-4">
                        <p className="text-xs text-white/30">
                          Module
                        </p>

                        <p className="mt-1 truncate text-sm text-white/65">
                          {module?.title || 'Unknown module'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}