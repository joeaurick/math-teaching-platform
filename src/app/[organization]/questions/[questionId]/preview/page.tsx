import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

type QuestionPreviewPageProps = {
  params: Promise<{
    organization: string
    questionId: string
  }>
}

export default async function QuestionPreviewPage({
  params,
}: QuestionPreviewPageProps) {
  const {
    organization: organizationSlug,
    questionId,
  } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // --------------------------------------------------
  // Organization
  // --------------------------------------------------

  const { data: organization, error: organizationError } =
    await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', organizationSlug)
      .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    notFound()
  }

  // --------------------------------------------------
  // Membership
  // --------------------------------------------------

  const { data: membership, error: membershipError } =
    await supabase
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

  // --------------------------------------------------
  // Question
  // --------------------------------------------------

  const { data: question, error: questionError } =
    await supabase
      .from('questions')
      .select(`
        id,
        module_id,
        title,
        question_type,
        content,
        explanation,
        status
      `)
      .eq('id', questionId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (questionError) {
    throw new Error(
      `Gagal mengambil question: ${questionError.message}`,
    )
  }

  if (!question) {
    notFound()
  }

  // --------------------------------------------------
  // Module
  // --------------------------------------------------

  const { data: module, error: moduleError } =
    await supabase
      .from('modules')
      .select('id, title')
      .eq('id', question.module_id)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (moduleError) {
    throw new Error(
      `Gagal mengambil module: ${moduleError.message}`,
    )
  }

  // --------------------------------------------------
  // Options
  // --------------------------------------------------

  const { data: options, error: optionsError } =
    await supabase
      .from('question_options')
      .select(`
        id,
        option_text,
        is_correct,
        sort_order
      `)
      .eq('question_id', question.id)
      .order('sort_order', { ascending: true })

  if (optionsError) {
    throw new Error(
      `Gagal mengambil question options: ${optionsError.message}`,
    )
  }

  const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  numeric: 'Numeric',
  essay: 'Essay',
}

const questionTypeLabel =
  questionTypeLabels[question.question_type] ??
  question.question_type

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Question Builder / Preview"
        title="Question Preview"
        description="See how this question will appear to a student."
        actions={
          <div className="flex items-center gap-2">
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

            <Link
              href={`/${organization.slug}/questions/${question.id}`}
            >
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mt-8 space-y-5">
        {/* Question information */}

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">
                {questionTypeLabel}
              </Badge>

              {module && (
                <Badge variant="muted">
                  {module.title}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student preview */}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              <Eye className="h-4 w-4" />
              Student Preview
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-white">
              {question.title}
            </h2>

            <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/70">
              {question.content}
            </div>

            {/* Multiple Choice */}

            {question.question_type ===
              'multiple_choice' && (
              <div className="mt-8 space-y-3">
                {options.map((option, index) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                  >
                    <input
                      type="radio"
                      name="preview-answer"
                      className="h-4 w-4"
                    />

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs font-medium text-white/50">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="text-sm text-white/75">
                      {option.option_text}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* True / False */}

            {question.question_type ===
              'true_false' && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                  >
                    <input
                      type="radio"
                      name="preview-answer"
                      className="h-4 w-4"
                    />

                    <span className="text-sm text-white/75">
                      {option.option_text}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer */}

            {question.question_type ===
              'short_answer' && (
              <div className="mt-8">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  disabled
                  className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white/60 outline-none placeholder:text-white/25"
                />
              </div>
            )}

            {/* Numeric */}

            {question.question_type === 'numeric' && (
              <div className="mt-8">
                <input
                  type="number"
                  placeholder="Enter your answer..."
                  disabled
                  className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white/60 outline-none placeholder:text-white/25"
                />
              </div>
            )}

            {/* Essay */}

            {question.question_type === 'essay' && (
              <div className="mt-8">
                <textarea
                  rows={7}
                  placeholder="Write your answer..."
                  disabled
                  className="w-full resize-none rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60 outline-none placeholder:text-white/25"
                />
              </div>
            )}

            <div className="mt-8 flex justify-end border-t border-white/[0.07] pt-5">
              <Button disabled>
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}

        {question.explanation && (
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                Explanation
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
                {question.explanation}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs text-white/30">
          Preview mode — answers are not submitted or saved.
        </div>
      </div>
    </div>
  )
}