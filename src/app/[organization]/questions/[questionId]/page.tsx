import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { QuestionEditForm } from './question-edit-form'

type QuestionDetailPageProps = {
  params: Promise<{
    organization: string
    questionId: string
  }>
}

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const {
    organization: slug,
    questionId,
  } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: organization, error: organizationError } =
    await supabase
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
        status,
        created_by,
        created_at,
        updated_at
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

  const { data: modules, error: modulesError } =
    await supabase
      .from('modules')
      .select('id, title')
      .eq('organization_id', organization.id)
      .order('title', { ascending: true })

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

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

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/questions`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Questions
        </Link>

        <PageHeader
          eyebrow="Teaching / Question Builder"
          title="Edit Question"
          description="Update the question, answer options, explanation, and status."
          actions={
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
          }
        />

        <div className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
              <FileQuestion className="h-[18px] w-[18px] text-sky-300" />
            </div>

            <div>
              <p className="text-xs text-white/30">
                Question ID
              </p>

              <p className="mt-1 text-xs text-white/50">
                {question.id}
              </p>
            </div>
          </div>

          <QuestionEditForm
            organizationSlug={organization.slug}
            questionId={question.id}
            modules={modules ?? []}
            initialData={{
              moduleId: question.module_id,
              title: question.title,
              questionType: question.question_type,
              content: question.content,
              explanation: question.explanation ?? '',
              status: question.status,
              options: options ?? [],
            }}
          />
        </div>
      </div>
    </div>
  )
}