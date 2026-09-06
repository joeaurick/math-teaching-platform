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

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/modules`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
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
                moduleTitle={module.title}
                status={module.status}
              />
            </div>
          }
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card className="border-sky-200/10 bg-gradient-to-br from-sky-400/[0.045] via-white/[0.025] to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                  <FileQuestion className="h-[18px] w-[18px] text-sky-300" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Questions
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Build and organize questions inside this module.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <EmptyState
                  icon={
                    <FileQuestion className="h-5 w-5 text-sky-300" />
                  }
                  title="No questions yet"
                  description="Add your first mathematics question to this module."
                  action={
                    <Link
                      href={`/${organization.slug}/questions`}
                    >
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        className="border-white/10 bg-white text-black hover:bg-white/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Question
                      </Button>
                    </Link>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-violet-200/10 bg-gradient-to-br from-violet-400/[0.045] via-white/[0.025] to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-400/10">
                    <BookOpen className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs text-white/35">
                      Module
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-white">
                      {module.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/10 bg-gradient-to-br from-amber-400/[0.045] via-white/[0.025] to-transparent">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-amber-300/70" />

                  <div>
                    <p className="text-[11px] text-white/30">
                      Created
                    </p>

                    <p className="mt-0.5 text-xs text-white/65">
                      {formatDate(
                        module.created_at,
                      )}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/[0.07] pt-4">
                  <p className="text-[11px] text-white/30">
                    Last updated
                  </p>

                  <p className="mt-1 text-xs text-white/65">
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