import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Plus,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type ClassesPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function ClassesPage({
  params,
}: ClassesPageProps) {
  const { organization: organizationSlug } = await params

  const { organization } =
    await getOrganizationContext(organizationSlug)

  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Pembelajaran"
          title="Kelas"
          description="Kelola kelas dan berikan akses belajar kepada siswa."
          actions={
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Buat Kelas
            </Button>
          }
        />

        <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
          {/* KELAS ANDA */}
          <Card className="group overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100">
            <CardContent className="!p-5 sm:!p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 sm:h-12 sm:w-12">
                  <Users className="h-5 w-5 text-sky-600" />
                </div>

                <Badge
                  variant="info"
                  className="border-sky-200 bg-sky-50 text-sky-700"
                >
                  Segera hadir
                </Badge>
              </div>

              <h2 className="mt-5 text-base font-semibold text-slate-900 sm:mt-6">
                Kelas Anda
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Buat dan kelola kelas untuk siswa Anda.
              </p>

              <div className="mt-5 sm:mt-6">
                <Button
                  variant="secondary"
                  className="w-full border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Buat Kelas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AKSES SISWA */}
          <Card className="group overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm shadow-violet-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100">
            <CardContent className="!p-5 sm:!p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 sm:h-12 sm:w-12">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>

                <Badge
                  variant="success"
                  className="border-violet-200 bg-violet-50 text-violet-700"
                >
                  Siswa
                </Badge>
              </div>

              <h2 className="mt-5 text-base font-semibold text-slate-900 sm:mt-6">
                Akses Siswa
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Buat tautan aman yang dapat digunakan siswa
                untuk mengakses ruang belajar mereka.
              </p>

              <div className="mt-5 sm:mt-6">
                <Link
                  href={`/${organization.slug}/classes/student-access`}
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
                >
                  Kelola akses siswa
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMPTY STATE */}
        <Card className="mt-4 overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100/50">
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center !p-6 text-center sm:min-h-[260px] sm:!p-8">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 sm:h-14 sm:w-14">
              <Users className="h-6 w-6 text-amber-600" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-900">
              Belum ada kelas
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Kelas akan membantu Anda mengatur siswa,
              modul, soal, dan pengumpulan tugas dalam
              satu tempat.
            </p>

            <Button className="mt-6 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Buat Kelas Pertama
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}