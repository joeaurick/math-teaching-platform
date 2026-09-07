import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  FileText,
  GraduationCap,
  PenTool,
  Play,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ====================================================== */}
      {/* Navigation                                             */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200 transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-4 w-4" />
            </div>

            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Math Teaching Platform
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Masuk
            </Link>

            <Link
  href="/register"
  className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
>
  Mulai Mengajar
</Link>
          </nav>
        </div>
      </header>

      {/* ====================================================== */}
      {/* Hero                                                   */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-260px] h-[620px] w-[820px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-3xl" />

          <div className="absolute -left-48 top-72 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />

          <div className="absolute -right-48 top-96 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Workspace untuk guru matematika
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-6xl lg:text-[4.5rem] lg:leading-[1.05]">
              Mengajar matematika
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                lebih terstruktur.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Buat materi, kelola bank soal, bagikan worksheet
              kepada siswa, dan pantau hasil belajar dari satu
              workspace yang rapi.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="h-12 w-full px-6 shadow-lg shadow-violet-200/70 sm:w-auto"
                >
                  Mulai Mengajar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              >
                Sudah punya akun?
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Modul pembelajaran
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Bank soal
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Student access
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* Product Preview                                    */}
          {/* ================================================== */}

          <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-sky-100/70 via-violet-100 to-emerald-100/70 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.14)]">
                {/* Browser Header */}

                <div className="flex h-11 items-center gap-1.5 border-b border-slate-200 bg-slate-50/80 px-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />

                  <div className="ml-5 flex h-6 flex-1 items-center rounded-md border border-slate-200 bg-white px-3">
                    <div className="h-1.5 w-32 rounded-full bg-slate-100" />
                  </div>
                </div>

                <div className="grid min-h-[390px] grid-cols-[190px_1fr]">
                  {/* Sidebar */}

                  <div className="hidden border-r border-slate-200 bg-slate-50/70 p-4 sm:block">
                    <div className="mb-7 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
                        <GraduationCap className="h-3.5 w-3.5 text-white" />
                      </div>

                      <div>
                        <div className="h-1.5 w-20 rounded-full bg-slate-300" />
                        <div className="mt-1.5 h-1.5 w-12 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        'Dashboard',
                        'Module Saya',
                        'Question Builder',
                        'Bank Soal',
                        'Kelas',
                        'Kelas Live',
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`flex h-9 items-center rounded-lg px-2.5 text-[10px] ${
                            index === 0
                              ? 'bg-violet-100 font-medium text-violet-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard */}

                  <div className="bg-white p-5 sm:p-7">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="h-3 w-28 rounded-full bg-slate-300" />
                        <div className="mt-2 h-2 w-48 rounded-full bg-slate-100" />
                      </div>

                      <div className="hidden h-8 w-24 rounded-lg bg-slate-900 sm:block" />
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      <PreviewStat
                        icon={BookOpen}
                        title="Modules"
                        value="12"
                        tone="sky"
                      />

                      <PreviewStat
                        icon={FileText}
                        title="Questions"
                        value="248"
                        tone="violet"
                      />

                      <PreviewStat
                        icon={Users}
                        title="Students"
                        value="36"
                        tone="emerald"
                      />
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                        <div>
                          <div className="h-2 w-28 rounded-full bg-slate-300" />
                          <div className="mt-2 h-1.5 w-40 rounded-full bg-slate-100" />
                        </div>

                        <div className="h-7 w-20 rounded-md bg-violet-100" />
                      </div>

                      <div className="divide-y divide-slate-100">
                        {[
                          'Module Matematika Kelas 8',
                          'Latihan Lingkaran',
                          'Persamaan Linear',
                          'Persiapan Ujian',
                        ].map((item, index) => (
                          <div
                            key={item}
                            className="flex h-11 items-center justify-between px-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`h-6 w-6 shrink-0 rounded-md ${
                                  index === 0
                                    ? 'bg-sky-100'
                                    : index === 1
                                      ? 'bg-violet-100'
                                      : index === 2
                                        ? 'bg-emerald-100'
                                        : 'bg-amber-100'
                                }`}
                              />

                              <div className="h-1.5 w-28 rounded-full bg-slate-100 sm:w-40" />
                            </div>

                            <div className="h-1.5 w-12 rounded-full bg-slate-100" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Features                                               */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
              Fitur utama
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Semua kebutuhan mengajar
              <br className="hidden sm:block" />
              dalam satu workspace.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Dari menyusun materi sampai melihat pekerjaan siswa,
              semuanya dirancang agar alur mengajar terasa lebih
              sederhana.
            </p>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BookOpen}
              iconClassName="text-sky-600"
              iconBackground="bg-sky-50"
              title="Module Pembelajaran"
              description="Susun materi dan soal menjadi module matematika yang terstruktur."
            />

            <FeatureCard
              icon={FileText}
              iconClassName="text-violet-600"
              iconBackground="bg-violet-50"
              title="Question Builder"
              description="Buat soal pilihan ganda, benar atau salah, singkat, numerik, hingga essay."
            />

            <FeatureCard
              icon={Users}
              iconClassName="text-emerald-600"
              iconBackground="bg-emerald-50"
              title="Student Access"
              description="Berikan akses belajar melalui link aman tanpa siswa harus membuat akun."
            />

            <FeatureCard
              icon={PenTool}
              iconClassName="text-amber-600"
              iconBackground="bg-amber-50"
              title="Interactive Whiteboard"
              description="Jelaskan konsep matematika dengan papan tulis dan alat anotasi interaktif."
            />

            <FeatureCard
              icon={Camera}
              iconClassName="text-rose-600"
              iconBackground="bg-rose-50"
              title="Photo & Scan"
              description="Gunakan foto pekerjaan matematika siswa sebagai bagian dari proses belajar."
            />

            <FeatureCard
              icon={Video}
              iconClassName="text-cyan-600"
              iconBackground="bg-cyan-50"
              title="Live Classroom"
              description="Hubungkan guru dan siswa dalam ruang kelas online yang interaktif."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Workflow                                               */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700">
                Cara kerja
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Dari membuat soal
                <br />
                sampai mengajar.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Buat materi sekali, susun soal dari bank soal,
                bagikan kepada siswa, lalu pantau proses belajar
                mereka dari workspace yang sama.
              </p>
            </div>

            <div className="space-y-2.5">
              <WorkflowStep
                number="01"
                color="sky"
                title="Buat module"
                description="Susun materi pembelajaran sesuai kebutuhan kelas."
              />

              <WorkflowStep
                number="02"
                color="violet"
                title="Buat soal"
                description="Gunakan format soal yang paling sesuai dengan materi."
              />

              <WorkflowStep
                number="03"
                color="emerald"
                title="Bagikan ke siswa"
                description="Berikan secure student access link kepada siswa."
              />

              <WorkflowStep
                number="04"
                color="amber"
                title="Review jawaban"
                description="Lihat jawaban siswa, beri nilai, dan berikan feedback."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Benefits                                               */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-violet-700">
                  Dibuat untuk guru
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Lebih sedikit waktu
                  <br />
                  untuk mengurus tools.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                  Simpan materi, soal, siswa, dan aktivitas
                  pembelajaran dalam satu platform yang rapi.
                </p>

                <Link
                  href="/register"
                  className="mt-8 inline-flex"
                >
                  <Button
                    size="md"
                    className="shadow-md shadow-violet-200/60"
                  >
                    Buat Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {[
                  {
                    text: 'Organisasi materi matematika',
                    color: 'text-sky-600',
                  },
                  {
                    text: 'Buat soal yang dapat digunakan kembali',
                    color: 'text-violet-600',
                  },
                  {
                    text: 'Berikan akses aman kepada siswa',
                    color: 'text-emerald-600',
                  },
                  {
                    text: 'Review dan nilai hasil pekerjaan',
                    color: 'text-amber-600',
                  },
                  {
                    text: 'Mengajar secara kolaboratif',
                    color: 'text-rose-600',
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${item.color}`}
                    />

                    <span className="text-sm text-slate-600">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CTA                                                    */}
      {/* ====================================================== */}

      <section className="bg-white">
        <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/70 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <Play className="ml-0.5 h-5 w-5" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Siap mengajar matematika
              <br className="hidden sm:block" />
              dengan cara yang lebih terstruktur?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Buat workspace Anda dan mulai susun module
              matematika pertama.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex"
            >
              <Button
                size="lg"
                className="h-12 px-6 shadow-lg shadow-violet-200/70"
              >
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Footer                                                 */}
      {/* ====================================================== */}

      <footer className="border-t border-slate-200 bg-slate-50/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>

            <span className="text-sm font-medium text-slate-500">
              Math Teaching Platform
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-400">
            <Link
              href="/login"
              className="transition-colors hover:text-violet-600"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-violet-600"
            >
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

type PreviewStatProps = {
  icon: React.ComponentType<{
    className?: string
  }>
  title: string
  value: string
  tone: 'sky' | 'violet' | 'emerald'
}

function PreviewStat({
  icon: Icon,
  title,
  value,
  tone,
}: PreviewStatProps) {
  const toneClasses = {
    sky: {
      card: 'border-sky-100 bg-sky-50/70',
      icon: 'bg-sky-100 text-sky-600',
      label: 'text-sky-700',
    },
    violet: {
      card: 'border-violet-100 bg-violet-50/70',
      icon: 'bg-violet-100 text-violet-600',
      label: 'text-violet-700',
    },
    emerald: {
      card: 'border-emerald-100 bg-emerald-50/70',
      icon: 'bg-emerald-100 text-emerald-600',
      label: 'text-emerald-700',
    },
  }

  const styles = toneClasses[tone]

  return (
    <div
      className={`rounded-xl border p-4 ${styles.card}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-[10px] font-medium ${styles.label}`}
          >
            {title}
          </p>

          <p className="mt-1 text-xl font-semibold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}

type FeatureCardProps = {
  icon: React.ComponentType<{
    className?: string
  }>
  iconClassName: string
  iconBackground: string
  title: string
  description: string
}

function FeatureCard({
  icon: Icon,
  iconClassName,
  iconBackground,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="border-b border-slate-200 p-6 transition-colors duration-200 hover:bg-slate-50 md:nth-[2n]:border-b-0 lg:border-b-0 lg:[&:nth-child(-n+3)]:border-b-0">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground}`}
      >
        <Icon
          className={`h-5 w-5 ${iconClassName}`}
        />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  )
}

type WorkflowStepProps = {
  number: string
  color: 'sky' | 'violet' | 'emerald' | 'amber'
  title: string
  description: string
}

function WorkflowStep({
  number,
  color,
  title,
  description,
}: WorkflowStepProps) {
  const colorClasses = {
    sky: 'border-sky-100 bg-sky-50/60',
    violet:
      'border-violet-100 bg-violet-50/60',
    emerald:
      'border-emerald-100 bg-emerald-50/60',
    amber:
      'border-amber-100 bg-amber-50/60',
  }

  const numberClasses = {
    sky: 'text-sky-600',
    violet: 'text-violet-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
  }

  return (
    <div
      className={`flex gap-4 rounded-2xl border p-5 transition-shadow duration-200 hover:shadow-sm ${colorClasses[color]}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-semibold shadow-sm ${numberClasses[color]}`}
      >
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}