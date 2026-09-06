import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  MessageCircle,
} from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { StudentModuleAssignment } from './student-module-assignment'
import { Button } from '@/components/ui/button'

type StudentAccessDetailPageProps = {
  params: Promise<{
    organization: string
    studentAccessId: string
  }>
}

export default async function StudentAccessDetailPage({
  params,
}: StudentAccessDetailPageProps) {
  const {
    organization: organizationSlug,
    studentAccessId,
  } = await params

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

  const { data: studentAccess, error: accessError } =
    await supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active,
        expires_at
      `)
      .eq('id', studentAccessId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (accessError) {
    throw new Error(
      `Gagal mengambil student access: ${accessError.message}`,
    )
  }

  if (!studentAccess) {
    notFound()
  }

  const { data: modules, error: modulesError } =
    await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        status
      `)
      .eq('organization_id', organization.id)
      .order('created_at', {
        ascending: false,
      })

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

  const { data: assignments, error: assignmentsError } =
    await supabase
      .from('student_modules')
      .select('module_id')
      .eq('student_access_id', studentAccess.id)

  if (assignmentsError) {
    throw new Error(
      `Gagal mengambil module assignments: ${assignmentsError.message}`,
    )
  }

  const assignedModuleIds =
    assignments?.map(
      (assignment) => assignment.module_id,
    ) ?? []

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Classes / Student Access"
        title={
          studentAccess.student_name ||
          'Student Access'
        }
        description="Manage the modules assigned to this student."
        actions={
          <Badge
            variant={
              studentAccess.is_active
                ? 'success'
                : 'muted'
            }
          >
            {studentAccess.is_active
              ? 'Active'
              : 'Inactive'}
          </Badge>
        }
      />

      <div className="mt-6">
        <Link
          href={`/${organization.slug}/classes/student-access`}
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student Access
        </Link>
      </div>

      <Card className="mt-8">
  <CardContent className="p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
          <BookOpen className="h-5 w-5 text-white/60" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
            Student
          </p>

          <p className="mt-1 text-sm font-medium text-white">
            {studentAccess.student_name ||
              'Unnamed Student'}
          </p>
        </div>
      </div>

      <Link
        href={`/${organization.slug}/classes/student-access/${studentAccess.id}/chat`}
      >
        <Button
          variant="secondary"
          size="sm"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </Link>
    </div>
  </CardContent>
</Card>

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-base font-medium text-white">
            Available Modules
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Select the modules this student should be
            able to access.
          </p>
        </div>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
              <BookOpen className="h-5 w-5 text-white/30" />

              <p className="mt-4 text-sm text-white/50">
                No modules available.
              </p>

              <p className="mt-1 text-xs text-white/25">
                Create a module first before assigning it
                to a student.
              </p>
            </CardContent>
          </Card>
        ) : (
          <StudentModuleAssignment
            organizationSlug={organization.slug}
            organizationId={organization.id}
            studentAccessId={studentAccess.id}
            modules={modules}
            assignedModuleIds={assignedModuleIds}
          />
        )}
      </div>
    </div>
  )
}