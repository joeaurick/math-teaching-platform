import Link from 'next/link'
import {
  ArrowRight,
  FileQuestion,
  Plus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type QuestionBankPageProps = {
  params: Promise<{
    organization: string
  }>
}

type Question = {
  id: string
  module_id: string
  title: string
  question_type: string
  content: string
  status: string
  created_at: string
  updated_at: string
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

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  numeric: 'Numeric',
  essay: 'Essay',
}

export default async function QuestionBankPage({
  params,
}: QuestionBankPageProps) {
  const { organization: slug } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  const {
    data: questionData,
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
      `Gagal mengambil question bank: ${questionsError.message}`,
    )
  }

  const questions = (questionData ?? []) as Question[]

  const publishedCount = questions.filter(
    (question) =>
      question.status === 'published',
  ).length

  const draftCount = questions.filter(
    (question) =>
      question.status === 'draft',
  ).length

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="Question Bank"
          description="Kumpulan semua soal matematika dalam organization ini."
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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-sky-200/10 bg-gradient-to-br from-sky-400/[0.055] via-white/[0.025] to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                  <FileQuestion className="h-4 w-4 text-sky-300" />
                </div>

                <p className="text-xs text-white/40">
                  Total Questions
                </p>
              </div>

              <p className="mt-4 text-2xl font-semibold text-white">
                {questions.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/10 bg-gradient-to-br from-emerald-400/[0.055] via-white/[0.025] to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>

                <p className="text-xs text-white/40">
                  Published
                </p>
              </div>

              <p className="mt-4 text-2xl font-semibold text-white">
                {publishedCount}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200/10 bg-gradient-to-br from-amber-400/[0.055] via-white/[0.025] to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                </div>

                <p className="text-xs text-white/40">
                  Draft
                </p>
              </div>

              <p className="mt-4 text-2xl font-semibold text-white">
                {draftCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              All Questions
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Semua soal yang tersedia di organization ini.
            </p>
          </div>

          {questions.length === 0 ? (
            <EmptyState
              icon={
                <FileQuestion className="h-5 w-5 text-sky-300" />
              }
              title="Belum ada question"
              description="Buat question pertama untuk mulai membangun question bank."
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
          ) : (
            <div className="space-y-3">
              {questions.map((question) => {
                const module = Array.isArray(
                  question.modules,
                )
                  ? question.modules[0]
                  : question.modules

                const questionType =
                  questionTypeLabels[
                    question.question_type
                  ] ?? question.question_type

                return (
                  <Card
                    key={question.id}
                    className="border-white/[0.07] bg-white/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200/15 hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                            <FileQuestion className="h-[18px] w-[18px] text-sky-300" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white">
                              {question.title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/35">
                              {question.content}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Badge
                                variant="info"
                                className="border-violet-300/20 bg-violet-400/10 text-violet-200"
                              >
                                {questionType}
                              </Badge>

                              <Badge
                                variant={
                                  question.status ===
                                  'published'
                                    ? 'success'
                                    : question.status ===
                                        'archived'
                                      ? 'muted'
                                      : 'warning'
                                }
                                className="capitalize"
                              >
                                {question.status}
                              </Badge>

                              <span className="text-xs text-white/30">
                                {module?.title ??
                                  'Unknown module'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Link
                            href={`/${organization.slug}/questions/${question.id}/preview`}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-white/[0.10] bg-transparent px-3 text-xs font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                          >
                            Preview
                          </Link>

                          <Link
                            href={`/${organization.slug}/questions/${question.id}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-medium text-black transition-colors hover:bg-white/90"
                          >
                            Open
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}