import { notFound, redirect } from 'next/navigation'

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
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[900px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="New Module"
          description="Create a new mathematics teaching module."
        />

        <div className="mt-8">
          <ModuleForm organizationSlug={organization.slug} />
        </div>
      </div>
    </div>
  )
}