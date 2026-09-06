import Link from 'next/link'
import {
  ArrowLeft,
  Link2,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

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

  const {
    supabase,
    organization,
  } = await getOrganizationContext(organizationSlug)

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
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Classes / Student Access"
          title="Student Access"
          description="Buat dan kelola secure link untuk siswa agar dapat mengakses learning environment."
        />

        <div className="mt-6">
          <Link
            href={`/${organization.slug}/classes`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Classes
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* ACCESS LINKS */}
          <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/60">
            <CardContent className="flex items-center gap-4 !p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
                <Link2 className="h-5 w-5 text-sky-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-sky-600">
                  Access Links
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Secure links untuk lingkungan belajar siswa.
                </p>
              </div>

              <Badge
                variant="info"
                className="ml-auto shrink-0 border-sky-200 bg-sky-50 text-sky-700"
              >
                Secure
              </Badge>
            </CardContent>
          </Card>

          {/* STUDENTS */}
          <Card className="overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm shadow-violet-100/60">
            <CardContent className="flex items-center gap-4 !p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
                <Users className="h-5 w-5 text-violet-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-violet-600">
                  Students
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {studentAccess?.length ?? 0}{' '}
                  {studentAccess?.length === 1
                    ? 'student access'
                    : 'student accesses'}{' '}
                  tersedia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <StudentAccessClient
            organizationId={organization.id}
            organizationSlug={organization.slug}
            studentAccesses={studentAccess ?? []}
          />
        </div>
      </div>
    </div>
  )
}