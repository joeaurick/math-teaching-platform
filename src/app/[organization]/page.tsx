import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Camera,
  FileQuestion,
  PenLine,
  Shapes,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type OrganizationPageProps = {
  params: Promise<{
    organization: string
  }>
}

const quickActions = [
  {
    title: 'Buat Soal',
    description:
      'Buat soal matematika baru untuk digunakan dalam pembelajaran.',
    href: 'questions/new',
    icon: PenLine,
    color:
      'border-sky-200 bg-sky-50 text-sky-600 hover:border-sky-300 hover:bg-sky-100/70',
    iconBg: 'bg-sky-100',
  },
  {
    title: 'Modul Saya',
    description:
      'Buat dan kelola materi pembelajaran matematika.',
    href: 'modules',
    icon: BookOpen,
    color:
      'border-violet-200 bg-violet-50 text-violet-600 hover:border-violet-300 hover:bg-violet-100/70',
    iconBg: 'bg-violet-100',
  },
  {
    title: 'Bank Soal',
    description:
      'Temukan dan gunakan kembali soal yang sudah dibuat.',
    href: 'question-bank',
    icon: FileQuestion,
    color:
      'border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100/70',
    iconBg: 'bg-emerald-100',
  },
  {
    title: 'Geometri',
    description:
      'Buat konten geometri interaktif untuk siswa.',
    href: 'geometry',
    icon: Shapes,
    color:
      'border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300 hover:bg-amber-100/70',
    iconBg: 'bg-amber-100',
  },
]

const teachingActions = [
  {
    title: 'Kelas',
    description:
      'Kelola kelas dan akses siswa.',
    href: 'classes',
    icon: Users,
    color:
      'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Kelas Langsung',
    description:
      'Mulai sesi pembelajaran interaktif.',
    href: 'live-classroom',
    icon: Video,
    color:
      'bg-violet-100 text-violet-600',
  },
  {
    title: 'Foto / Pindai',
    description:
      'Pindai atau tangkap pekerjaan matematika.',
    href: 'photo-scan',
    icon: Camera,
    color:
      'bg-sky-100 text-sky-600',
  },
]

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { organization: slug } = await params

  const {
    organization,
    membership,
    user,
  } = await getOrganizationContext(slug)

  const firstName =
    user.email?.split('@')[0] || 'Guru'

  const roleLabel =
    membership.role === 'owner'
      ? 'Pemilik'
      : membership.role === 'admin'
        ? 'Admin'
        : membership.role === 'teacher'
          ? 'Guru'
          : membership.role

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}

        <PageHeader
          eyebrow="Ruang Kerja Guru"
          title={`Selamat datang kembali, ${firstName}`}
          description={`Kelola pembelajaran matematika di ${organization.name} dari satu tempat.`}
          actions={
            <Badge
              variant="info"
              className="capitalize"
            >
              {roleLabel}
            </Badge>
          }
        />

        {/* Ruang Kerja Aktif */}

        <Card className="mt-6 overflow-hidden border-sky-200 bg-gradient-to-r from-sky-50 via-violet-50/60 to-emerald-50/50 shadow-sm shadow-slate-200/50 sm:mt-7">
          <CardContent className="!p-5 sm:!p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-sky-600">
                    Ruang Kerja Aktif
                  </p>

                  <h2 className="mt-1.5 break-words text-base font-semibold text-slate-900">
                    {organization.name}
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    Semua alat untuk menyiapkan dan
                    menjalankan pembelajaran Anda ada di
                    sini.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-[3.5rem] sm:shrink-0 sm:pl-0">
                <Badge variant="muted">
                  /{organization.slug}
                </Badge>

                <Badge
                  variant="success"
                  className="capitalize"
                >
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aksi Cepat */}

        <section className="mt-8 sm:mt-9">
          <div className="mb-4 sm:mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Aksi Cepat
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                Mulai dari sini
              </span>
            </div>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Pilih aktivitas yang ingin Anda lakukan
              untuk pembelajaran berikutnya.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group block min-w-0"
                >
                  <Card
                    className={`h-full overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.color}`}
                  >
                    <CardContent className="!p-4 sm:!p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}
                        >
                          <Icon className="h-[19px] w-[19px]" />
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 transition-colors group-hover:bg-white">
                          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600" />
                        </div>
                      </div>

                      <h3 className="mt-5 break-words text-sm font-semibold text-slate-900">
                        {action.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Ruang Mengajar */}

        <section className="mt-8 sm:mt-9">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Ruang Mengajar
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Alat untuk mengelola kelas dan kegiatan
              belajar bersama siswa.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {teachingActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group block min-w-0"
                >
                  <Card className="h-full border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    <CardContent className="!p-4 sm:!p-5">
                      <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                        >
                          <Icon className="h-[19px] w-[19px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-semibold text-slate-900">
                            {action.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            {action.description}
                          </p>
                        </div>

                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Mulai Mengajar */}

        <section className="mt-8 pb-2 sm:mt-9">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardContent className="!p-5 sm:!p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 max-w-xl">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 shrink-0 text-violet-600" />

                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-violet-600">
                      Mulai Mengajar
                    </p>
                  </div>

                  <h2 className="mt-2 break-words text-lg font-semibold text-slate-900">
                    Siapkan pembelajaran Anda
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mulai dengan membuat soal, susun
                    menjadi lembar kerja, kemudian bagikan
                    kepada siswa melalui kelas Anda.
                  </p>
                </div>

                <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:w-auto lg:min-w-[300px]">
                  <div className="rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-3 text-center sm:px-3">
                    <p className="text-lg font-semibold text-sky-600">
                      1
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      Buat Soal
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-3 text-center sm:px-3">
                    <p className="text-lg font-semibold text-violet-600">
                      2
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      Susun
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-3 text-center sm:px-3">
                    <p className="text-lg font-semibold text-emerald-600">
                      3
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      Bagikan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}