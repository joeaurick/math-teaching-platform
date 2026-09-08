import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import {
  notFound,
  redirect,
} from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { QuestionForm } from './question-form'

type NewQuestionPageProps = {
  params: Promise<{
    organization: string
  }>
  searchParams: Promise<{
    module?: string
  }>
}

export default async function NewQuestionPage({
  params,
  searchParams,
}: NewQuestionPageProps) {
  const {
    organization: slug,
  } = await params

  const {
    module: moduleId,
  } = await searchParams

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
    data: modules,
    error: modulesError,
  } = await supabase
    .from('modules')
    .select(
      'id, title',
    )
    .eq(
      'organization_id',
      organization.id,
    )
    .order(
      'title',
      {
        ascending: true,
      },
    )

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

  /*
   * Kalau moduleId berasal dari URL,
   * pastikan module tersebut benar-benar
   * milik organization ini.
   */
  let selectedModuleId = ''

  if (moduleId) {
    const selectedModule =
      modules?.find(
        (module) =>
          module.id === moduleId,
      )

    if (selectedModule) {
      selectedModuleId =
        selectedModule.id
    }
  }

  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/modules`}
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Kembali ke Modul
        </Link>

        <PageHeader
          eyebrow="Pembelajaran / Pembuat Soal"
          title="Soal Baru"
          description="Buat soal matematika baru dan masukkan ke dalam modul pembelajaran."
          actions={
            <Badge variant="info">
              <FileQuestion className="mr-1.5 h-3.5 w-3.5" />
              Pembuat Soal
            </Badge>
          }
        />

        <div className="mt-6 sm:mt-8">
          <QuestionForm
            organizationSlug={
              organization.slug
            }
            modules={
              modules ?? []
            }
            selectedModuleId={
              selectedModuleId
            }
          />
        </div>
      </div>
    </div>
  )
}