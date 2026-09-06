import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { StudentModuleAssignment } from './student-module-assignment'

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

  const {
    supabase,
    organization,
  } = await getOrganizationContext(organizationSlug)

  const [
    studentAccessResult,
    modulesResult,
    assignmentsResult,
  ] = await Promise.all([
    supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active,
        expires_at
      `)
      .eq('id', studentAccessId)
      .eq('organization_id', organization.id)
      .maybeSingle(),

    supabase
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
      }),

    supabase
      .from('student_modules')
      .select('module_id')
      .eq('student_access_id', studentAccessId),
  ])

  const {
    data: studentAccess,
    error: accessError,
  } = studentAccessResult

  if (accessError) {
    throw new Error(
      `Gagal mengambil student access: ${accessError.message}`,
    )
  }

  if (!studentAccess) {
    const { notFound } = await import('next/navigation')

    notFound()
  }

  const {
    data: modules,
    error: modulesError,
  } = modulesResult

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

  const {
    data: assignments,
    error: assignmentsError,
  } = assignmentsResult

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
    <div className="min-h-full">
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
              className={
                studentAccess.is_active
                  ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'
                  : ''
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
            className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Student Access
          </Link>
        </div>

        {/* Student Overview */}

        <Card className="mt-8 overflow-hidden border-violet-200/50 bg-gradient-to-br from-violet-50/[0.10] via-white/[0.035] to-transparent shadow-[0_12px_40px_rgba(139,92,246,0.05)]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-400/10">
                  <BookOpen className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-violet-200/50">
                    Student
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {studentAccess.student_name ||
                      'Unnamed Student'}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {assignedModuleIds.length}{' '}
                    {assignedModuleIds.length === 1
                      ? 'module'
                      : 'modules'}{' '}
                    assigned
                  </p>
                </div>
              </div>

              <Link
                href={`/${organization.slug}/classes/student-access/${studentAccess.id}/chat`}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-violet-300/20 bg-violet-400/10 text-violet-100 hover:border-violet-300/30 hover:bg-violet-400/15"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Available Modules */}

        <div className="mt-8">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/25 bg-sky-400/10">
              <Sparkles className="h-4 w-4 text-sky-300" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Available Modules
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Select the modules this student should be
                able to access.
              </p>
            </div>
          </div>

          {modules.length === 0 ? (
            <Card className="overflow-hidden border-amber-200/40 bg-gradient-to-br from-amber-50/[0.08] via-white/[0.025] to-transparent">
              <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10">
                  <BookOpen className="h-5 w-5 text-amber-300" />
                </div>

                <p className="mt-4 text-sm font-medium text-white/70">
                  No modules available.
                </p>

                <p className="mt-1 max-w-md text-xs leading-5 text-white/30">
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
    </div>
  )
}