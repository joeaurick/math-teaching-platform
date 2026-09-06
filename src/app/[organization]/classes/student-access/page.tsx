import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { StudentAccessClient } from './student-access-client'

type StudentAccessPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function StudentAccessPage({
  params,
}: StudentAccessPageProps) {
  const { organization: organizationSlug } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // User
  // ------------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ------------------------------------------------------------
  // Organization
  // ------------------------------------------------------------

  const {
    data: organization,
    error: organizationError,
  } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', organizationSlug)
    .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    notFound()
  }

  // ------------------------------------------------------------
  // Membership
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // Student Access
  // ------------------------------------------------------------

  const {
    data: studentAccess,
    error: studentAccessError,
  } = await supabase
    .from('student_access')
    .select(`
      id,
      token,
      student_name,
      is_active,
      expires_at
    `)
    .eq('organization_id', organization.id)
    .order('created_at', {
      ascending: false,
    })

  if (studentAccessError) {
    throw new Error(
      `Gagal mengambil student access: ${studentAccessError.message}`,
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Classes / Student Access"
        title="Student Access"
        description="Buat dan kelola secure link untuk siswa agar dapat mengakses learning environment."
      />

      <div className="mt-6">
        <Link
          href={`/${organization.slug}/classes`}
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </Link>
      </div>

      <div className="mt-8">
        <StudentAccessClient
          organizationId={organization.id}
          organizationSlug={organization.slug}
          studentAccesses={studentAccess ?? []}
        />
      </div>
    </div>
  )
}