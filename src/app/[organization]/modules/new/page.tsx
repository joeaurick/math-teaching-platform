import { notFound, redirect } from 'next/navigation'
import { BookOpen, Sparkles } from 'lucide-react'

import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'
import { ModuleForm } from './module-form'

type NewModulePageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function NewModulePage({
  params,
}: NewModulePageProps) {
  const { organization: slug } = await params

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

  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Pembelajaran"
          title="Modul Baru"
          description="Buat modul pembelajaran matematika baru untuk ruang kerja Anda."
        />

        <div className="mt-6 sm:mt-8">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-4 py-3.5 sm:px-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <BookOpen className="h-4 w-4 text-violet-600" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800">
                  Ruang belajar baru
                </p>

                <Sparkles className="hidden h-3.5 w-3.5 text-violet-500 sm:block" />
              </div>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Isi informasi dasar modul sebelum mulai menambahkan materi.
              </p>
            </div>
          </div>

          <ModuleForm organizationSlug={organization.slug} />
        </div>
      </div>
    </div>
  )
}