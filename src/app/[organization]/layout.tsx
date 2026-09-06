import { getOrganizationContext } from '@/lib/organization/get-organization-context'

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

  const {
    user,
    organization,
    membership,
  } = await getOrganizationContext(slug)

  return (
    <div className="flex min-h-screen bg-[#090909] text-white">
      <AppSidebar
        organizationSlug={organization.slug}
        organizationName={organization.name}
        role={membership.role}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          organizationSlug={organization.slug}
          organizationName={organization.name}
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