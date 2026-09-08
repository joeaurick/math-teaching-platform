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
      'border-sky-200 bg-sky-50/70 hover:border-sky-300 hover:bg-sky-50',
    iconClass:
      'border-sky-200 bg-sky-100 text-sky-600',
  },
  {
    title: 'Worksheet',
    description: 'Kerjakan tugas dan latihan Anda.',
    href: 'worksheets',
    icon: ClipboardList,
    className:
      'border-violet-200 bg-violet-50/70 hover:border-violet-300 hover:bg-violet-50',
    iconClass:
      'border-violet-200 bg-violet-100 text-violet-600',
  },
  {
    title: 'Jawaban Saya',
    description: 'Lihat pekerjaan yang sudah dikirim.',
    href: 'submissions',
    icon: FileText,
    className:
      'border-emerald-200 bg-emerald-50/70 hover:border-emerald-300 hover:bg-emerald-50',
    iconClass:
      'border-emerald-200 bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Chat dengan Guru',
    description:
      'Tanyakan sesuatu jika membutuhkan bantuan.',
    href: 'chat',
    icon: MessageCircle,
    className:
      'border-indigo-200 bg-indigo-50/70 hover:border-indigo-300 hover:bg-indigo-50',
    iconClass:
      'border-indigo-200 bg-indigo-100 text-indigo-600',
  },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
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
    workspace.student_name?.trim() || 'Siswa'

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
    (modulesResult.data ?? []) as StudentModule[]

  const worksheets =
    (worksheetsResult.data ?? []) as StudentWorksheet[]

  const hasModules = modules.length > 0
  const hasWorksheets = worksheets.length > 0

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ================================================== */}
        {/* HERO                                               */}
        {/* ================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 shadow-[0_18px_60px_rgba(79,70,229,0.08)] sm:rounded-[32px] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-violet-200/70" />

          <div className="pointer-events-none absolute -right-8 top-8 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ruang Belajar
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Halo, {studentName}! 👋
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Selamat datang kembali. Yuk lanjutkan
                  perjalanan belajar matematika Anda hari ini.
                </p>

                <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm">
                  <GraduationCap className="h-4 w-4 shrink-0 text-violet-600" />

                  <span className="truncate">
                    {workspace.organization_name}
                  </span>
                </div>
              </div>

              <div className="relative hidden lg:block lg:mr-4">
                <div className="flex h-36 w-36 items-center justify-center rounded-[32px] border border-violet-200 bg-white/80 shadow-[0_20px_50px_rgba(79,70,229,0.10)]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-100 to-sky-100">
                    <GraduationCap className="h-12 w-12 text-violet-600" />
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                  <span className="text-xs font-semibold text-slate-600">
                    Terus belajar!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* STATS                                               */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="border-sky-200 bg-white">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
                <BookOpen className="h-5 w-5 text-sky-600" />
              </div>

              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900">
                  {modules.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Materi tersedia
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-200 bg-white">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
                <ClipboardList className="h-5 w-5 text-violet-600" />
              </div>

              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900">
                  {worksheets.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Worksheet tersedia
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900">
                  Belajar
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Terus tingkatkan kemampuan
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================================================== */}
        {/* CONTINUE LEARNING                                  */}
        {/* ================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Lanjutkan Belajar
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              Pilih materi dan mulai belajar.
            </p>
          </div>

          {hasModules ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {modules.slice(0, 2).map(
                (module, index) => (
                  <Link
                    key={module.module_id}
                    href={`/student/${token}/modules/${module.module_id}`}
                    className="group block"
                  >
                    <Card className="relative h-full overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_50px_rgba(79,70,229,0.10)]">
                      <div
                        className={`pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${
                          index === 0
                            ? 'bg-sky-100'
                            : 'bg-violet-100'
                        }`}
                      />

                      <CardContent className="relative p-6 sm:p-7">
                        <div className="flex items-start justify-between gap-5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
                            <BookOpen className="h-5 w-5 text-sky-600" />
                          </div>

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-violet-50">
                            <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-violet-600" />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Badge variant="success">
                            Materi tersedia
                          </Badge>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-violet-700">
                          {module.module_title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {module.module_description ||
                            'Mulai pelajari materi ini bersama guru Anda.'}
                        </p>

                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs text-slate-400">
                            Materi pembelajaran
                          </span>

                          <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                            Mulai belajar
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          ) : (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  Belum ada materi
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Guru belum memberikan materi pembelajaran
                  kepada Anda.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ================================================== */}
        {/* WORKSHEETS                                         */}
        {/* ================================================== */}

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Tugas Anda
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Worksheet yang diberikan oleh guru.
              </p>
            </div>

            {hasWorksheets && (
              <Link
                href={`/student/${token}/worksheets`}
                className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700"
              >
                Lihat semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {hasWorksheets ? (
            <div className="grid gap-4">
              {worksheets.slice(0, 3).map(
                (worksheet) => (
                  <Link
                    key={worksheet.worksheet_id}
                    href={`/student/${token}/worksheets/${worksheet.worksheet_id}`}
                    className="group block"
                  >
                    <Card className="overflow-hidden border-slate-200 bg-white transition-all duration-200 hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-md">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
                            <ClipboardList className="h-5 w-5 text-violet-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900 group-hover:text-violet-700">
                                {
                                  worksheet.worksheet_title
                                }
                              </h3>

                              <Badge variant="warning">
                                Tugas
                              </Badge>
                            </div>

                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                              {worksheet.worksheet_description ||
                                'Worksheet dari guru Anda.'}
                            </p>

                            <div className="mt-3 sm:hidden">
                              <p className="text-[11px] text-slate-400">
                                Diberikan{' '}
                                {formatDate(
                                  worksheet.created_at,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-[11px] text-slate-400">
                              Diberikan
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(
                                worksheet.created_at,
                              )}
                            </p>
                          </div>

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-violet-50">
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          ) : (
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex min-h-[180px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  <ClipboardList className="h-5 w-5 text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  Belum ada tugas
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  Worksheet yang diberikan guru akan muncul
                  di sini.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ================================================== */}
        {/* QUICK ACCESS                                       */}
        {/* ================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Ruang Belajar
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              Semua kebutuhan belajar Anda dalam satu tempat.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/student/${token}/${action.href}`}
                  className="group block"
                >
                  <Card
                    className={`h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.className}`}
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${action.iconClass}`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-slate-900">
                        {action.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {action.description}
                      </p>

                      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-violet-600">
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

        <Card className="mt-10 overflow-hidden border-emerald-200 bg-gradient-to-r from-emerald-50 via-sky-50/70 to-white">
          <CardContent className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Tips belajar hari ini ✨
              </p>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Belajar sedikit demi sedikit setiap hari akan
                membantu Anda memahami matematika dengan lebih
                baik. Jangan takut mencoba!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="h-24 sm:h-16" />
      </main>
    </div>
  )
}