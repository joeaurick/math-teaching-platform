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
      'border-sky-300/15 bg-sky-400/[0.06] text-sky-300',
    iconBg: 'bg-sky-400/10',
  },
  {
    title: 'Module Saya',
    description:
      'Buat dan kelola materi pembelajaran matematika.',
    href: 'modules',
    icon: BookOpen,
    color:
      'border-violet-300/15 bg-violet-400/[0.06] text-violet-300',
    iconBg: 'bg-violet-400/10',
  },
  {
    title: 'Bank Soal',
    description:
      'Temukan dan gunakan kembali soal yang sudah dibuat.',
    href: 'question-bank',
    icon: FileQuestion,
    color:
      'border-emerald-300/15 bg-emerald-400/[0.06] text-emerald-300',
    iconBg: 'bg-emerald-400/10',
  },
  {
    title: 'Geometry',
    description:
      'Buat konten geometri interaktif untuk siswa.',
    href: 'geometry',
    icon: Shapes,
    color:
      'border-amber-300/15 bg-amber-400/[0.06] text-amber-300',
    iconBg: 'bg-amber-400/10',
  },
]

const teachingActions = [
  {
    title: 'Kelas',
    description:
      'Kelola kelas dan akses siswa.',
    href: 'classes',
    icon: Users,
    color: 'bg-emerald-400/10 text-emerald-300',
  },
  {
    title: 'Kelas Live',
    description:
      'Mulai sesi pembelajaran interaktif.',
    href: 'live-classroom',
    icon: Video,
    color: 'bg-violet-400/10 text-violet-300',
  },
  {
    title: 'Foto / Scan',
    description:
      'Pindai atau tangkap pekerjaan matematika.',
    href: 'photo-scan',
    icon: Camera,
    color: 'bg-sky-400/10 text-sky-300',
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

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
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
              {membership.role}
            </Badge>
          }
        />

        {/* Workspace Highlight */}

        <Card className="mt-7 overflow-hidden border-sky-300/10 bg-gradient-to-r from-sky-400/[0.07] via-violet-400/[0.05] to-emerald-400/[0.04]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/15 to-violet-400/15">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-sky-300/60">
                    Workspace Aktif
                  </p>

                  <h2 className="mt-1.5 text-base font-semibold text-white">
                    {organization.name}
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Semua alat untuk menyiapkan dan
                    menjalankan pembelajaran Anda ada di
                    sini.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="muted">
                  /{organization.slug}
                </Badge>

                <Badge
                  variant="success"
                  className="capitalize"
                >
                  {membership.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}

        <section className="mt-9">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                Aksi Cepat
              </h2>

              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/35">
                Mulai dari sini
              </span>
            </div>

            <p className="mt-1.5 text-sm text-white/35">
              Pilih aktivitas yang ingin Anda lakukan
              untuk pembelajaran berikutnya.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group block"
                >
                  <Card
                    className={`h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${action.color}`}
                  >
                    <CardContent className="!p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}
                        >
                          <Icon className="h-[19px] w-[19px]" />
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] transition-colors group-hover:bg-white/[0.08]">
                          <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/70" />
                        </div>
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-white">
                        {action.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-white/40">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Teaching Workspace */}

        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Ruang Mengajar
            </h2>

            <p className="mt-1.5 text-sm text-white/35">
              Alat untuk mengelola kelas dan kegiatan
              belajar bersama siswa.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {teachingActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group block"
                >
                  <Card className="h-full border-white/[0.08] bg-white/[0.025] transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.045]">
                    <CardContent className="!p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                        >
                          <Icon className="h-[19px] w-[19px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-white">
                            {action.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-white/35">
                            {action.description}
                          </p>
                        </div>

                        <ArrowRight className="h-4 w-4 shrink-0 text-white/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Getting Started */}

        <section className="mt-9">
          <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
            <CardContent className="p-6 sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-violet-300" />

                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-violet-300/60">
                      Mulai Mengajar
                    </p>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    Siapkan pembelajaran Anda
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Mulai dengan membuat soal, susun
                    menjadi worksheet, kemudian bagikan
                    kepada siswa melalui kelas Anda.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-sky-300/10 bg-sky-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-sky-300">
                      1
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/35">
                      Buat Soal
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-300/10 bg-violet-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-violet-300">
                      2
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/35">
                      Susun
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-300/10 bg-emerald-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-emerald-300">
                      3
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/35">
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