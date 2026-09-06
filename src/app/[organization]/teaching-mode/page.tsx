import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  PenLine,
  Sparkles,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type TeachingModePageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function TeachingModePage({
  params,
}: TeachingModePageProps) {
  const { organization: organizationSlug } =
    await params

  const { organization } =
    await getOrganizationContext(organizationSlug)

  return (
    <div className="min-h-full">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href={`/${organization.slug}`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>

        <PageHeader
          eyebrow="Teaching Workspace"
          title="Teaching Mode"
          description="Tempat untuk memulai aktivitas mengajar, membuka materi, memberikan tugas, dan memantau siswa."
          actions={
            <Badge variant="success">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
              Ruang Mengajar
            </Badge>
          }
        />

        {/* Hero */}

        <Card className="mt-8 overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-sky-50/60 to-violet-50/50">
          <CardContent className="relative !p-6 sm:!p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-emerald-200/60" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
                  Siapkan kelas dan mulai mengajar.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Akses materi, soal, worksheet, dan data siswa
                  dari satu ruang kerja sehingga Anda dapat fokus
                  pada proses pembelajaran.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link
                  href={`/${organization.slug}/modules`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition-colors hover:bg-emerald-600"
                >
                  Buka Module
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`/${organization.slug}/classes`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  Buka Kelas
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Aksi Mengajar
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Pilih aktivitas yang ingin Anda lakukan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TeachingAction
              href={`/${organization.slug}/questions/new`}
              icon={PenLine}
              color="violet"
              title="Buat Soal"
              description="Buat soal matematika baru untuk digunakan dalam pembelajaran."
            />

            <TeachingAction
              href={`/${organization.slug}/modules`}
              icon={BookOpen}
              color="sky"
              title="Materi & Module"
              description="Buka dan kelola materi pembelajaran yang sudah dibuat."
            />

            <TeachingAction
              href={`/${organization.slug}/worksheets`}
              icon={ClipboardList}
              color="amber"
              title="Worksheet"
              description="Siapkan worksheet untuk diberikan kepada siswa."
            />

            <TeachingAction
              href={`/${organization.slug}/question-bank`}
              icon={FileQuestion}
              color="rose"
              title="Bank Soal"
              description="Gunakan kembali soal yang sudah tersedia di bank soal."
            />

            <TeachingAction
              href={`/${organization.slug}/classes`}
              icon={Users}
              color="emerald"
              title="Kelas & Siswa"
              description="Kelola kelas dan akses belajar siswa Anda."
            />

            <TeachingAction
              href={`/${organization.slug}/photo-scan`}
              icon={Camera}
              color="cyan"
              title="Photo / Scan"
              description="Gunakan gambar pekerjaan matematika dalam proses mengajar."
            />
          </div>
        </section>

        {/* Teaching Flow */}

        <section className="mt-10">
          <div className="grid gap-4 lg:grid-cols-3">
            <FlowCard
              number="01"
              icon={BookOpen}
              color="sky"
              title="Siapkan Materi"
              description="Pilih module atau materi yang ingin digunakan untuk pembelajaran."
            />

            <FlowCard
              number="02"
              icon={PenLine}
              color="violet"
              title="Berikan Aktivitas"
              description="Gunakan soal atau worksheet untuk memberikan latihan kepada siswa."
            />

            <FlowCard
              number="03"
              icon={FileQuestion}
              color="emerald"
              title="Review Hasil"
              description="Periksa jawaban dan hasil pekerjaan siswa setelah aktivitas selesai."
            />
          </div>
        </section>

        {/* Future Workspace */}

        <Card className="mt-8 border-violet-200 bg-gradient-to-r from-violet-50 via-sky-50/50 to-white">
          <CardContent className="flex flex-col gap-4 !p-5 sm:flex-row sm:items-start sm:!p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-100">
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Teaching Workspace
              </p>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                Area ini nantinya dapat dikembangkan menjadi
                ruang mengajar interaktif dengan whiteboard,
                presentasi soal, komunikasi siswa, dan aktivitas
                kelas secara realtime.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-5">
          <Link
            href={`/${organization.slug}/submissions`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
          >
            Lihat Student Submissions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href={`/${organization.slug}/classes`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
          >
            Kelola Kelas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    </div>
  )
}

type TeachingActionProps = {
  href: string
  icon: React.ComponentType<{
    className?: string
  }>
  color:
    | 'sky'
    | 'violet'
    | 'amber'
    | 'rose'
    | 'emerald'
    | 'cyan'
  title: string
  description: string
}

function TeachingAction({
  href,
  icon: Icon,
  color,
  title,
  description,
}: TeachingActionProps) {
  const styles = {
    sky: {
      border:
        'border-sky-200 hover:border-sky-300',
      icon:
        'border-sky-200 bg-sky-50 text-sky-600',
    },
    violet: {
      border:
        'border-violet-200 hover:border-violet-300',
      icon:
        'border-violet-200 bg-violet-50 text-violet-600',
    },
    amber: {
      border:
        'border-amber-200 hover:border-amber-300',
      icon:
        'border-amber-200 bg-amber-50 text-amber-600',
    },
    rose: {
      border:
        'border-rose-200 hover:border-rose-300',
      icon:
        'border-rose-200 bg-rose-50 text-rose-600',
    },
    emerald: {
      border:
        'border-emerald-200 hover:border-emerald-300',
      icon:
        'border-emerald-200 bg-emerald-50 text-emerald-600',
    },
    cyan: {
      border:
        'border-cyan-200 hover:border-cyan-300',
      icon:
        'border-cyan-200 bg-cyan-50 text-cyan-600',
    },
  }[color]

  return (
    <Link
      href={href}
      className="group block"
    >
      <Card
        className={`h-full border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.border}`}
      >
        <CardContent className="flex h-full flex-col !p-5">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
            </div>
          </div>

          <h3 className="mt-5 text-sm font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

type FlowCardProps = {
  number: string
  icon: React.ComponentType<{
    className?: string
  }>
  color: 'sky' | 'violet' | 'emerald'
  title: string
  description: string
}

function FlowCard({
  number,
  icon: Icon,
  color,
  title,
  description,
}: FlowCardProps) {
  const styles = {
    sky: {
      border: 'border-sky-200',
      number:
        'bg-sky-50 text-sky-600 border-sky-200',
      icon: 'text-sky-600',
    },
    violet: {
      border: 'border-violet-200',
      number:
        'bg-violet-50 text-violet-600 border-violet-200',
      icon: 'text-violet-600',
    },
    emerald: {
      border: 'border-emerald-200',
      number:
        'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: 'text-emerald-600',
    },
  }[color]

  return (
    <Card className={styles.border}>
      <CardContent className="!p-5 sm:!p-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold ${styles.number}`}
          >
            {number}
          </div>

          <Icon
            className={`h-4 w-4 ${styles.icon}`}
          />
        </div>

        <h3 className="mt-5 text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}