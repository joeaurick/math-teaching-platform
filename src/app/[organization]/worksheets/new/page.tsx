import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { WorksheetForm } from './worksheet-form'

type NewWorksheetPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function NewWorksheetPage({
  params,
}: NewWorksheetPageProps) {
  const { organization: slug } = await params

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
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="New Worksheet"
          description="Buat worksheet baru untuk mengumpulkan soal-soal matematika."
        />

        <div className="mt-8">
          <WorksheetForm
            organizationSlug={organization.slug}
          />
        </div>
      </div>
    </div>
  )
}