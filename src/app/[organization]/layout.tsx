import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Topbar } from '@/components/layout/topbar'
import { TeacherChatWidget } from '@/components/chat/teacher-chat-widget'

type OrganizationLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    organization: string
  }>
}

export default async function OrganizationLayout({
  children,
  params,
}: OrganizationLayoutProps) {
  const { organization: slug } =
    await params

  const supabase =
    await createClient()

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
    .select('role')
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

  return (
    <div className="flex min-h-screen bg-[#090909] text-white">
      <AppSidebar
        organizationSlug={
          organization.slug
        }
        organizationName={
          organization.name
        }
        role={membership.role}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          organizationSlug={
            organization.slug
          }
          organizationName={
            organization.name
          }
          userEmail={user.email}
          role={membership.role}
        />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <TeacherChatWidget
        organizationId={organization.id}
        organizationSlug={organization.slug}
        teacherProfileId={user.id}
      />
    </div>
  )
}