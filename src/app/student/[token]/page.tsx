import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type StudentPageProps = {
  params: Promise<{
    token: string
  }>
}

type StudentWorkspace = {
  access_id: string
  organization_id: string
  organization_name: string
  organization_slug: string
  student_name: string | null
}

type StudentModule = {
  module_id: string
  module_title: string
  module_description: string | null
  module_status: string
  created_at: string
}

type StudentWorksheet = {
  worksheet_id: string
  worksheet_title: string
  worksheet_description: string | null
  worksheet_status: string
  created_at: string
}

const quickActions = [
  {
    title: 'Materi Saya',
    description: 'Lanjutkan belajar materi dari guru.',
    href: 'modules',
    icon: BookOpen,
    className:
      'border-sky-300/15 bg-sky-400/[0.06]',
    iconClass:
      'border-sky-300/20 bg-sky-400/10 text-sky-300',
  },
  {
    title: 'Worksheet',
    description: 'Kerjakan tugas dan latihan Anda.',
    href: 'worksheets',
    icon: ClipboardList,
    className:
      'border-violet-300/15 bg-violet-400/[0.06]',
    iconClass:
      'border-violet-300/20 bg-violet-400/10 text-violet-300',
  },
  {
    title: 'Jawaban Saya',
    description: 'Lihat pekerjaan yang sudah dikirim.',
    href: 'submissions',
    icon: FileText,
    className:
      'border-emerald-300/15 bg-emerald-400/[0.06]',
    iconClass:
      'border-emerald-300/20 bg-emerald-400/10 text-emerald-300',
  },
  {
    title: 'Chat dengan Guru',
    description: 'Tanyakan sesuatu jika membutuhkan bantuan.',
    href: 'chat',
    icon: MessageCircle,
    className:
      'border-amber-300/15 bg-amber-400/[0.06]',
    iconClass:
      'border-amber-300/20 bg-amber-400/10 text-amber-300',
  },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

export default async function StudentPage({
  params,
}: StudentPageProps) {
  const { token } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // Student workspace
  // ------------------------------------------------------------

  const {
    data: workspaceData,
    error: workspaceError,
  } = await supabase.rpc(
    'get_student_workspace_by_token',
    {
      access_token: token,
    },
  )

  if (workspaceError) {
    throw new Error(
      `Gagal memeriksa student access: ${workspaceError.message}`,
    )
  }

  const workspace =
    (workspaceData?.[0] as
      | StudentWorkspace
      | undefined) ?? null

  if (!workspace) {
    notFound()
  }

  const studentName =
    workspace.student_name?.trim() ||
    'Siswa'

  // ------------------------------------------------------------
  // Load modules + worksheets
  // ------------------------------------------------------------

  const [
    modulesResult,
    worksheetsResult,
  ] = await Promise.all([
    supabase.rpc(
      'get_student_modules_by_token',
      {
        access_token: token,
      },
    ),

    supabase.rpc(
      'get_student_worksheets_by_token',
      {
        access_token: token,
      },
    ),
  ])

  if (modulesResult.error) {
    throw new Error(
      `Gagal mengambil modules: ${modulesResult.error.message}`,
    )
  }

  if (worksheetsResult.error) {
    throw new Error(
      `Gagal mengambil worksheet student: ${worksheetsResult.error.message}`,
    )
  }

  const modules =
    (modulesResult.data ??
      []) as StudentModule[]

  const worksheets =
    (worksheetsResult.data ??
      []) as StudentWorksheet[]

  const hasModules =
    modules.length > 0

  const hasWorksheets =
    worksheets.length > 0

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ================================================== */}
        {/* HERO                                               */}
        {/* ================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.10] via-violet-400/[0.055] to-emerald-400/[0.045] p-6 shadow-[0_20px_80px_rgba(56,189,248,0.06)] sm:p-8 lg:p-10">
          {/* Decorative shapes */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-300/[0.08]" />

          <div className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rounded-full bg-sky-400/[0.04] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-400/[0.05] blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ruang Belajar
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Halo, {studentName}! 👋
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                  Selamat datang kembali. Yuk lanjutkan
                  perjalanan belajar matematika Anda hari
                  ini.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/40">
                  <GraduationCap className="h-4 w-4 text-sky-300/70" />

                  <span>
                    {workspace.organization_name}
                  </span>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="flex h-36 w-36 items-center justify-center rounded-[32px] border border-white/[0.08] bg-white/[0.035] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-violet-300/15 bg-gradient-to-br from-violet-400/10 to-sky-400/10">
                    <GraduationCap className="h-12 w-12 text-violet-300" />
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-5 flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-[#111111]/90 px-3 py-2 shadow-xl">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />

                  <span className="text-xs font-medium text-white/65">
                    Keep learning!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* STATS                                               */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-sky-300/10 bg-sky-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10">
                <BookOpen className="h-5 w-5 text-sky-300" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {modules.length}
                </p>

                <p className="mt-0.5 text-xs text-white/35">
                  Materi tersedia
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-300/10 bg-violet-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10">
                <ClipboardList className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {worksheets.length}
                </p>

                <p className="mt-0.5 text-xs text-white/35">
                  Worksheet tersedia
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/10 bg-emerald-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10">
                <Target className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  Belajar
                </p>

                <p className="mt-0.5 text-xs text-white/35">
                  Terus tingkatkan kemampuan
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================================================== */}
        {/* CONTINUE LEARNING                                  */}
        {/* ================================================== */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Lanjutkan Belajar
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Pilih materi dan mulai belajar.
            </p>
          </div>

          {hasModules ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {modules
                .slice(0, 2)
                .map((module, index) => (
                  <Link
                    key={module.module_id}
                    href={`/student/${token}/modules/${module.module_id}`}
                    className="group block"
                  >
                    <Card className="relative h-full overflow-hidden border-sky-300/10 bg-gradient-to-br from-sky-400/[0.065] via-white/[0.025] to-transparent transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/25 hover:shadow-[0_18px_50px_rgba(56,189,248,0.08)]">
                      <div
                        className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${
                          index === 0
                            ? 'bg-sky-400/[0.08]'
                            : 'bg-violet-400/[0.08]'
                        }`}
                      />

                      <CardContent className="relative p-6">
                        <div className="flex items-start justify-between gap-5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-400/10">
                            <BookOpen className="h-5 w-5 text-sky-300" />
                          </div>

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.035] transition-all group-hover:bg-white/[0.08]">
                            <ArrowRight className="h-4 w-4 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-white/80" />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Badge
                            variant="success"
                            className="border-emerald-300/15 bg-emerald-400/10 text-emerald-200"
                          >
                            Materi tersedia
                          </Badge>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-sky-100">
                          {module.module_title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
                          {module.module_description ||
                            'Mulai pelajari materi ini bersama guru Anda.'}
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                          <span className="text-xs text-white/25">
                            Materi pembelajaran
                          </span>

                          <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-300/70 transition-colors group-hover:text-sky-200">
                            Mulai belajar
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <Card className="border-amber-300/10 bg-gradient-to-br from-amber-400/[0.05] via-white/[0.02] to-transparent">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-400/10">
                  <BookOpen className="h-6 w-6 text-amber-300" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Belum ada materi
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Guru belum memberikan materi
                  pembelajaran kepada Anda.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ================================================== */}
        {/* WORKSHEETS                                         */}
        {/* ================================================== */}

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Tugas Anda
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Worksheet yang diberikan oleh guru.
              </p>
            </div>

            {hasWorksheets && (
              <Link
                href={`/student/${token}/worksheets`}
                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
              >
                Lihat semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {hasWorksheets ? (
            <div className="grid gap-3">
              {worksheets
                .slice(0, 3)
                .map((worksheet) => (
                  <Link
                    key={
                      worksheet.worksheet_id
                    }
                    href={`/student/${token}/worksheets/${worksheet.worksheet_id}`}
                    className="group block"
                  >
                    <Card className="overflow-hidden border-violet-300/10 bg-white/[0.025] transition-all duration-200 hover:border-violet-300/20 hover:bg-violet-400/[0.035]">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10">
                            <ClipboardList className="h-5 w-5 text-violet-300" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-white group-hover:text-violet-100">
                                {
                                  worksheet.worksheet_title
                                }
                              </h3>

                              <Badge variant="warning">
                                Tugas
                              </Badge>
                            </div>

                            <p className="mt-1 line-clamp-1 text-xs text-white/35">
                              {worksheet.worksheet_description ||
                                'Worksheet dari guru Anda.'}
                            </p>
                          </div>

                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-[11px] text-white/25">
                              Diberikan
                            </p>

                            <p className="mt-1 text-xs text-white/45">
                              {formatDate(
                                worksheet.created_at,
                              )}
                            </p>
                          </div>

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.03] transition-colors group-hover:bg-white/[0.08]">
                            <ArrowRight className="h-4 w-4 text-white/25 group-hover:text-white/70" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardContent className="flex min-h-[180px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                  <ClipboardList className="h-5 w-5 text-white/35" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-white/80">
                  Belum ada tugas
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-5 text-white/30">
                  Worksheet yang diberikan guru akan
                  muncul di sini.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ================================================== */}
        {/* QUICK ACCESS                                       */}
        {/* ================================================== */}

        <section className="mt-9">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Ruang Belajar
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Semua kebutuhan belajar Anda dalam satu
              tempat.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/student/${token}/${action.href}`}
                  className="group block"
                >
                  <Card
                    className={`h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${action.className}`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${action.iconClass}`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-white transition-colors group-hover:text-white">
                        {action.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/35">
                        {action.description}
                      </p>

                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-white/25 transition-colors group-hover:text-sky-300/70">
                        Buka
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ================================================== */}
        {/* FOOTER TIP                                         */}
        {/* ================================================== */}

        <Card className="mt-9 overflow-hidden border-emerald-300/10 bg-gradient-to-r from-emerald-400/[0.045] via-sky-400/[0.025] to-transparent">
          <CardContent className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10">
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/75">
                Tips belajar hari ini ✨
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Belajar sedikit demi sedikit setiap hari
                akan membantu Anda memahami matematika
                dengan lebih baik. Jangan takut mencoba!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}