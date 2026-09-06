import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileQuestion,
  Plus,
} from 'lucide-react'
import {
  notFound,
  redirect,
} from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { ModuleActions } from '../module-actions'

type ModuleDetailPageProps = {
  params: Promise<{
    organization: string
    moduleId: string
  }>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(new Date(value))
}

function getQuestionTypeLabel(
  type: string,
) {
  switch (type) {
    case 'multiple_choice':
      return 'Multiple Choice'

    case 'true_false':
      return 'True / False'

    case 'short_answer':
      return 'Short Answer'

    case 'numeric':
      return 'Numeric'

    case 'essay':
      return 'Essay'

    default:
      return type
  }
}

export default async function ModuleDetailPage({
  params,
}: ModuleDetailPageProps) {
  const {
    organization: slug,
    moduleId,
  } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: organization,
    error: organizationError,
  } = await supabase
    .from('organizations')
    .select(
      'id, name, slug',
    )
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

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from('organization_members')
    .select('id, role')
    .eq(
      'organization_id',
      organization.id,
    )
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

  const {
    data: module,
    error: moduleError,
  } = await supabase
    .from('modules')
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
    .eq('id', moduleId)
    .eq(
      'organization_id',
      organization.id,
    )
    .maybeSingle()

  if (moduleError) {
    throw new Error(
      `Gagal mengambil module: ${moduleError.message}`,
    )
  }

  if (!module) {
    notFound()
  }

  /*
   * Questions yang module_id-nya menunjuk
   * ke module ini adalah isi dari module.
   */
  const {
    data: questions,
    error: questionsError,
  } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      question_type,
      content,
      status,
      created_at,
      updated_at
    `)
    .eq(
      'organization_id',
      organization.id,
    )
    .eq('module_id', module.id)
    .order(
      'created_at',
      {
        ascending: true,
      },
    )

  if (questionsError) {
    throw new Error(
      `Gagal mengambil questions: ${questionsError.message}`,
    )
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/modules`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Modules
        </Link>

        <PageHeader
          eyebrow="Teaching / Module"
          title={module.title}
          description={
            module.description ||
            'No description added for this module yet.'
          }
          actions={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge
                variant={
                  module.status ===
                  'published'
                    ? 'success'
                    : module.status ===
                        'archived'
                      ? 'muted'
                      : 'warning'
                }
                className="capitalize"
              >
                {module.status}
              </Badge>

              <ModuleActions
                organizationSlug={
                  organization.slug
                }
                moduleId={module.id}
                moduleTitle={
                  module.title
                }
                status={module.status}
              />
            </div>
          }
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* QUESTIONS */}
          <Card className="border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/70">
            <CardContent className="!p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
                    <FileQuestion className="h-[18px] w-[18px] text-sky-600" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Questions
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {questions.length}{' '}
                      {questions.length === 1
                        ? 'question'
                        : 'questions'}{' '}
                      in this module.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/${organization.slug}/questions/new?module=${module.id}`}
                >
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                </Link>
              </div>

              {questions.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    icon={
                      <FileQuestion className="h-5 w-5 text-sky-600" />
                    }
                    title="No questions yet"
                    description="Add your first mathematics question to this module."
                    action={
                      <Link
                        href={`/${organization.slug}/questions/new?module=${module.id}`}
                      >
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                        >
                          <Plus className="h-4 w-4" />
                          Add Question
                        </Button>
                      </Link>
                    }
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {questions.map(
                    (
                      question,
                      index,
                    ) => (
                      <Link
                        key={
                          question.id
                        }
                        href={`/${organization.slug}/questions/${question.id}`}
                        className="group block"
                      >
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-md hover:shadow-sky-100/60">
                          <div className="flex items-start gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-xs font-semibold text-sky-700">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-sky-700">
                                  {question.title}
                                </h3>

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
                              </div>

                              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                                {question.content}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                <span>
                                  {getQuestionTypeLabel(
                                    question.question_type,
                                  )}
                                </span>

                                <span>
                                  Updated{' '}
                                  {formatDate(
                                    question.updated_at,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <div className="space-y-4">
            <Card className="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm shadow-violet-100/60">
              <CardContent className="!p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-200 bg-violet-50">
                    <BookOpen className="h-4 w-4 text-violet-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Module
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-slate-900">
                      {module.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm shadow-emerald-100/60">
              <CardContent className="!p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                    <FileQuestion className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Questions
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-slate-900">
                      {questions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100/60">
              <CardContent className="!p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-amber-600" />

                  <div>
                    <p className="text-[11px] text-slate-500">
                      Created
                    </p>

                    <p className="mt-0.5 text-xs text-slate-700">
                      {formatDate(
                        module.created_at,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-500">
                    Last updated
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    {formatDate(
                      module.updated_at,
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}