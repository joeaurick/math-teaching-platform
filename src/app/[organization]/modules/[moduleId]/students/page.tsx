import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Users,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { ModuleStudentAssignment } from './module-student-assignment'

type ModuleStudentsPageProps = {
  params: Promise<{
    organization: string
    moduleId: string
  }>
}

export default async function ModuleStudentsPage({
  params,
}: ModuleStudentsPageProps) {
  const {
    organization: organizationSlug,
    moduleId,
  } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(
    organizationSlug,
  )

  const [
    moduleResult,
    studentsResult,
    assignmentsResult,
  ] = await Promise.all([
    supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        status
      `)
      .eq('id', moduleId)
      .eq(
        'organization_id',
        organization.id,
      )
      .maybeSingle(),

    supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active,
        expires_at
      `)
      .eq(
        'organization_id',
        organization.id,
      )
      .order('student_name', {
        ascending: true,
      }),

    supabase
      .from('student_modules')
      .select(
        'student_access_id',
      )
      .eq('module_id', moduleId),
  ])

  const {
    data: module,
    error: moduleError,
  } = moduleResult

  if (moduleError) {
    throw new Error(
      `Gagal mengambil module: ${moduleError.message}`,
    )
  }

  if (!module) {
    notFound()
  }

  const {
    data: students,
    error: studentsError,
  } = studentsResult

  if (studentsError) {
    throw new Error(
      `Gagal mengambil siswa: ${studentsError.message}`,
    )
  }

  const {
    data: assignments,
    error: assignmentsError,
  } = assignmentsResult

  if (assignmentsError) {
    throw new Error(
      `Gagal mengambil assignment: ${assignmentsError.message}`,
    )
  }

  const assignedStudentIds =
    assignments?.map(
      (assignment) =>
        assignment.student_access_id,
    ) ?? []

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/modules/${module.id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Module
        </Link>

        <PageHeader
          eyebrow="Teaching / Module / Students"
          title="Berikan ke Siswa"
          description={`Pilih siswa yang dapat menerima module "${module.title}".`}
          actions={
            <Badge
              variant={
                module.status ===
                'published'
                  ? 'success'
                  : 'warning'
              }
              className="capitalize"
            >
              {module.status}
            </Badge>
          }
        />

        {module.status !== 'published' && (
          <Card className="mt-8 overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100/60">
            <CardContent className="!p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Module belum dipublish
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Anda dapat menentukan siswa sekarang.
                    Namun module belum akan muncul di ruang
                    belajar siswa sampai statusnya
                    menjadi Published.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mt-8">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
              <Users className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Daftar Siswa
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {assignedStudentIds.length}{' '}
                siswa telah diberikan module ini.
              </p>
            </div>
          </div>

          {students &&
          students.length > 0 ? (
            <ModuleStudentAssignment
              organizationSlug={
                organization.slug
              }
              organizationId={
                organization.id
              }
              moduleId={module.id}
              moduleStatus={
                module.status
              }
              students={students}
              assignedStudentIds={
                assignedStudentIds
              }
            />
          ) : (
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardContent className="flex min-h-[240px] flex-col items-center justify-center !p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
                  <Users className="h-5 w-5 text-sky-600" />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-slate-900">
                  Belum ada siswa
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Buat Student Access terlebih dahulu
                  agar siswa dapat menerima module.
                </p>

                <Link
                  href={`/${organization.slug}/classes/student-access`}
                  className="mt-5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Kelola Student Access
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}