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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      {/* ====================================================== */}
      {/* Navigation                                             */}
      {/* ====================================================== */}

      <header className="border-b border-white/[0.06] bg-[#080b12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg shadow-sky-500/10 transition-transform group-hover:scale-105">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>

            <span className="text-sm font-semibold tracking-tight text-white">
              Math Teaching Platform
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-400 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/10 transition-all hover:bg-sky-300 hover:shadow-sky-500/20"
            >
              Mulai Mengajar
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* Hero                                                   */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-sky-400/[0.08] blur-3xl" />
          <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-violet-500/[0.07] blur-3xl" />
          <div className="absolute -right-32 top-72 h-72 w-72 rounded-full bg-emerald-400/[0.05] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3.5 py-1.5 text-xs font-medium text-sky-200/80">
              <Sparkles className="h-3.5 w-3.5" />
              Ruang Mengajar Matematika Modern
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Mengajar matematika
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                jadi lebih sederhana.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              Buat materi, susun soal, bagikan pembelajaran
              kepada siswa, dan pantau hasil belajar dalam
              satu workspace yang rapi.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/10 transition-all hover:bg-sky-300 hover:shadow-sky-500/20 sm:w-auto"
              >
                Buat Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.03] px-6 text-sm font-medium text-white/80 transition-colors hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-white sm:w-auto"
              >
                Sudah punya akun?
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300/70" />
                Modul pembelajaran
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300/70" />
                Bank soal
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300/70" />
                Student access
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* Dashboard Preview                                  */}
          {/* ================================================== */}

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-sky-500/[0.06] via-violet-500/[0.06] to-emerald-500/[0.05] blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0d111b] shadow-2xl shadow-black/30">
                {/* Browser Header */}

                <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] px-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400/35" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-300/35" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300/35" />

                  <div className="ml-4 h-5 flex-1 rounded-md bg-white/[0.04]" />
                </div>

                <div className="grid min-h-[360px] grid-cols-[180px_1fr]">
                  {/* Sidebar */}

                  <div className="hidden border-r border-white/[0.06] p-4 sm:block">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-violet-500">
                        <GraduationCap className="h-3 w-3 text-white" />
                      </div>

                      <div className="h-2 w-20 rounded bg-white/15" />
                    </div>

                    <div className="space-y-2">
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
                          className={`flex h-8 items-center rounded-lg px-2 text-[10px] ${
                            index === 0
                              ? 'bg-sky-400/10 text-sky-200'
                              : 'text-white/30'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-5 sm:p-7">
                    <div className="h-3 w-28 rounded bg-white/15" />
                    <div className="mt-2 h-2 w-48 rounded bg-white/[0.06]" />

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      {[
                        'sky',
                        'violet',
                        'emerald',
                      ].map((item) => (
                        <div
                          key={item}
                          className={`rounded-xl border p-4 ${
                            item === 'sky'
                              ? 'border-sky-300/10 bg-sky-400/[0.05]'
                              : item === 'violet'
                                ? 'border-violet-300/10 bg-violet-400/[0.05]'
                                : 'border-emerald-300/10 bg-emerald-400/[0.05]'
                          }`}
                        >
                          <div
                            className={`h-7 w-7 rounded-lg ${
                              item === 'sky'
                                ? 'bg-sky-300/10'
                                : item === 'violet'
                                  ? 'bg-violet-300/10'
                                  : 'bg-emerald-300/10'
                            }`}
                          />

                          <div className="mt-4 h-2 w-20 rounded bg-white/15" />
                          <div className="mt-2 h-2 w-12 rounded bg-white/[0.06]" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="h-2 w-28 rounded bg-white/15" />
                          <div className="mt-2 h-2 w-40 rounded bg-white/[0.06]" />
                        </div>

                        <div className="h-8 w-24 rounded-lg bg-sky-300/10" />
                      </div>

                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="h-10 rounded-lg bg-white/[0.03]"
                          />
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

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/10 bg-violet-300/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-violet-200/60">
              Fitur utama
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Semua kebutuhan mengajar
              <br className="hidden sm:block" />
              ada dalam satu tempat.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/45">
              Tidak perlu berpindah-pindah aplikasi untuk
              membuat materi, mengelola soal, dan berinteraksi
              dengan siswa.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BookOpen}
              iconClassName="text-sky-300"
              iconBackground="bg-sky-400/10"
              borderClassName="border-sky-300/10"
              title="Module Pembelajaran"
              description="Susun materi dan soal menjadi module matematika yang terstruktur."
            />

            <FeatureCard
              icon={FileText}
              iconClassName="text-violet-300"
              iconBackground="bg-violet-400/10"
              borderClassName="border-violet-300/10"
              title="Question Builder"
              description="Buat soal pilihan ganda, benar atau salah, singkat, numerik, hingga essay."
            />

            <FeatureCard
              icon={Users}
              iconClassName="text-emerald-300"
              iconBackground="bg-emerald-400/10"
              borderClassName="border-emerald-300/10"
              title="Student Access"
              description="Berikan akses belajar melalui link aman tanpa siswa harus membuat akun."
            />

            <FeatureCard
              icon={PenTool}
              iconClassName="text-amber-300"
              iconBackground="bg-amber-400/10"
              borderClassName="border-amber-300/10"
              title="Interactive Whiteboard"
              description="Jelaskan konsep matematika dengan papan tulis dan alat anotasi interaktif."
            />

            <FeatureCard
              icon={Camera}
              iconClassName="text-rose-300"
              iconBackground="bg-rose-400/10"
              borderClassName="border-rose-300/10"
              title="Photo & Scan"
              description="Gunakan foto pekerjaan matematika siswa sebagai bagian dari proses belajar."
            />

            <FeatureCard
              icon={Video}
              iconClassName="text-cyan-300"
              iconBackground="bg-cyan-400/10"
              borderClassName="border-cyan-300/10"
              title="Live Classroom"
              description="Hubungkan guru dan siswa dalam ruang kelas online yang interaktif."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Workflow                                               */}
      {/* ====================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-emerald-200/60">
                Cara kerja
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Dari membuat soal
                <br />
                sampai mengajar.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                Buat materi sekali, bagikan kepada siswa, lalu
                pantau proses belajar mereka dari workspace yang
                sama.
              </p>
            </div>

            <div className="space-y-3">
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

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.07] via-violet-400/[0.04] to-emerald-400/[0.035] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-sky-300/[0.07]" />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/10 bg-sky-300/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-sky-200/60">
                  Dibuat untuk guru
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  Lebih sedikit waktu
                  <br />
                  untuk mengurus tools.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                  Simpan materi, soal, siswa, dan aktivitas
                  pembelajaran dalam satu platform yang rapi.
                </p>

                <Link
                  href="/register"
                  className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/10 transition-all hover:bg-sky-300 hover:shadow-sky-500/20"
                >
                  Buat Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    text: 'Organisasi materi matematika',
                    color: 'text-sky-300',
                  },
                  {
                    text: 'Buat soal yang dapat digunakan kembali',
                    color: 'text-violet-300',
                  },
                  {
                    text: 'Berikan akses aman kepada siswa',
                    color: 'text-emerald-300',
                  },
                  {
                    text: 'Review dan nilai hasil pekerjaan',
                    color: 'text-amber-300',
                  },
                  {
                    text: 'Mengajar secara kolaboratif',
                    color: 'text-rose-300',
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/[0.12] px-4 py-3"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${item.color}`}
                    />

                    <span className="text-sm text-white/65">
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

      <section className="border-t border-white/[0.06]">
        <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.07] blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-sky-400 shadow-lg shadow-violet-500/10">
              <Play className="ml-0.5 h-5 w-5 text-white" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Siap mengajar matematika
              <br className="hidden sm:block" />
              dengan cara yang lebih baik?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45">
              Buat workspace Anda dan mulai susun module
              matematika pertama.
            </p>

            <Link
              href="/register"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-sky-400 px-6 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/10 transition-all hover:bg-sky-300 hover:shadow-sky-500/20"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Footer                                                 */}
      {/* ====================================================== */}

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>

            <span className="text-sm text-white/50">
              Math Teaching Platform
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/35">
            <Link
              href="/login"
              className="transition-colors hover:text-sky-200"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-sky-200"
            >
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>
  iconClassName: string
  iconBackground: string
  borderClassName: string
  title: string
  description: string
}

function FeatureCard({
  icon: Icon,
  iconClassName,
  iconBackground,
  borderClassName,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.035] ${borderClassName}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground}`}
      >
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
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
    sky: 'border-sky-300/10 bg-sky-400/[0.04] text-sky-300',
    violet:
      'border-violet-300/10 bg-violet-400/[0.04] text-violet-300',
    emerald:
      'border-emerald-300/10 bg-emerald-400/[0.04] text-emerald-300',
    amber:
      'border-amber-300/10 bg-amber-400/[0.04] text-amber-300',
  }

  return (
    <div
      className={`flex gap-4 rounded-2xl border p-5 ${colorClasses[color]}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-semibold">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-white/40">
          {description}
        </p>
      </div>
    </div>
  )
}