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
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

function getQuestionTypeLabel(
  type: string,
) {
  switch (type) {
    case 'multiple_choice':
      return 'Pilihan Ganda'

    case 'true_false':
      return 'Benar / Salah'

    case 'short_answer':
      return 'Jawaban Singkat'

    case 'numeric':
      return 'Numerik'

    case 'essay':
      return 'Esai'

    default:
      return type
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'published':
      return 'Diterbitkan'

    case 'archived':
      return 'Diarsipkan'

    case 'draft':
      return 'Draf'

    default:
      return status
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
      deleted_at,
      created_at,
      updated_at
    `)
    .eq(
      'organization_id',
      organization.id,
    )
    .eq('module_id', module.id)
    .is('deleted_at', null)
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
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/modules`}
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Kembali ke Modul
        </Link>

        <PageHeader
          eyebrow="Pembelajaran / Modul"
          title={module.title}
          description={
            module.description ||
            'Belum ada deskripsi untuk modul ini.'
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
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
              >
                {getStatusLabel(
                  module.status,
                )}
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

        <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* SOAL */}
          <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/70">
            <CardContent className="!p-5 sm:!p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
                    <FileQuestion className="h-[18px] w-[18px] text-sky-600" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                      Soal
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {questions.length}{' '}
                      {questions.length === 1
                        ? 'soal'
                        : 'soal'}{' '}
                      dalam modul ini.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/${organization.slug}/questions/new?module=${module.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Soal
                  </Button>
                </Link>
              </div>

              {questions.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    icon={
                      <FileQuestion className="h-5 w-5 text-sky-600" />
                    }
                    title="Belum ada soal"
                    description="Tambahkan soal matematika pertama ke modul ini."
                    action={
                      <Link
                        href={`/${organization.slug}/questions/new?module=${module.id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Tambah Soal
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
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-md hover:shadow-sky-100/60 sm:p-5">
                          <div className="flex items-start gap-3 sm:gap-4">
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
                                >
                                  {getStatusLabel(
                                    question.status,
                                  )}
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
                                  Diperbarui{' '}
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-200 bg-violet-50">
                    <BookOpen className="h-4 w-4 text-violet-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Modul
                    </p>

                    <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                      {module.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm shadow-emerald-100/60">
              <CardContent className="!p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                    <FileQuestion className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Jumlah Soal
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
                  <Clock3 className="h-4 w-4 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-[11px] text-slate-500">
                      Dibuat
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
                    Terakhir diperbarui
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