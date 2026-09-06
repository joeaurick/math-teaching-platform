import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageCircle,
  Sparkles,
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

type StudentWorksheet = {
  worksheet_id: string
  worksheet_title: string
  worksheet_description: string | null
  worksheet_status: string
  created_at: string
}

const workspaceMenus = [
  {
    title: 'Module Saya',
    description:
      'Lihat materi pembelajaran yang diberikan oleh guru.',
    href: 'modules',
    icon: BookOpen,
    color:
      'border-sky-300/15 bg-sky-400/[0.06]',
    iconColor: 'text-sky-300',
    iconBg: 'bg-sky-400/10',
  },
  {
    title: 'Worksheet Saya',
    description:
      'Kerjakan latihan dan tugas yang diberikan kepada Anda.',
    href: 'worksheets',
    icon: ClipboardList,
    color:
      'border-violet-300/15 bg-violet-400/[0.06]',
    iconColor: 'text-violet-300',
    iconBg: 'bg-violet-400/10',
  },
  {
    title: 'Jawaban Saya',
    description:
      'Lihat jawaban dan hasil pekerjaan yang sudah dikirim.',
    href: 'submissions',
    icon: FileText,
    color:
      'border-emerald-300/15 bg-emerald-400/[0.06]',
    iconColor: 'text-emerald-300',
    iconBg: 'bg-emerald-400/10',
  },
  {
    title: 'Chat dengan Guru',
    description:
      'Berkomunikasi langsung dengan guru jika membutuhkan bantuan.',
    href: 'chat',
    icon: MessageCircle,
    color:
      'border-amber-300/15 bg-amber-400/[0.06]',
    iconColor: 'text-amber-300',
    iconBg: 'bg-amber-400/10',
  },
]

export default async function StudentPage({
  params,
}: StudentPageProps) {
  const { token } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // Student workspace
  // ------------------------------------------------------------

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_workspace_by_token',
    {
      access_token: token,
    },
  )

  if (error) {
    throw new Error(
      `Gagal memeriksa student access: ${error.message}`,
    )
  }

  const workspace =
    (data?.[0] as StudentWorkspace | undefined) ??
    null

  if (!workspace) {
    notFound()
  }

  const studentName =
    workspace.student_name?.trim() ||
    'Siswa'

  // ------------------------------------------------------------
  // Student Worksheets
  // ------------------------------------------------------------

  const {
    data: worksheetData,
    error: worksheetError,
  } = await supabase.rpc(
    'get_student_worksheets_by_token',
    {
      access_token: token,
    },
  )

  if (worksheetError) {
    throw new Error(
      `Gagal mengambil worksheet student: ${worksheetError.message}`,
    )
  }

  const worksheets =
    (worksheetData ?? []) as StudentWorksheet[]

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.07] via-violet-400/[0.045] to-emerald-400/[0.035] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-sky-300/[0.08]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-400/[0.035] blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                <Sparkles className="h-3.5 w-3.5" />
                Ruang Belajar
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Halo, {studentName} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Selamat datang di ruang belajar
                Anda. Kerjakan tugas, pelajari
                module, dan berkomunikasi dengan
                guru dari satu tempat.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-sky-300/70" />

                <span className="text-sm text-white/40">
                  {workspace.organization_name}
                </span>
              </div>
            </div>

            <Badge
              variant="info"
              className="w-fit"
            >
              Siswa
            </Badge>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Menu Utama                                           */}
        {/* ---------------------------------------------------- */}

        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Ruang Belajar Saya
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Akses pembelajaran dan komunikasi
              Anda.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workspaceMenus.map((menu) => {
              const Icon = menu.icon

              return (
                <Link
                  key={menu.title}
                  href={`/student/${token}/${menu.href}`}
                  className="group block"
                >
                  <Card
                    className={`h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${menu.color}`}
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${menu.iconBg}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${menu.iconColor}`}
                          />
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] transition-colors group-hover:bg-white/[0.08]">
                          <ArrowRight className="h-4 w-4 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/70" />
                        </div>
                      </div>

                      <h3 className="mt-5 text-base font-semibold text-white">
                        {menu.title}
                      </h3>

                      <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                        {menu.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Worksheet Terbaru                                    */}
        {/* ---------------------------------------------------- */}

        <section className="mt-9">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Worksheet Saya
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Tugas yang diberikan oleh guru kepada
                Anda.
              </p>
            </div>

            {worksheets.length > 0 && (
              <Link
                href={`/student/${token}/worksheets`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
              >
                Lihat semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {worksheets.length === 0 ? (
            <Card className="overflow-hidden border-amber-300/10 bg-gradient-to-br from-amber-400/[0.06] via-white/[0.02] to-transparent">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-400/10">
                  <ClipboardList className="h-6 w-6 text-amber-300" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Belum ada worksheet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Saat guru memberikan worksheet,
                  tugas tersebut akan muncul di sini.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {worksheets.map((worksheet) => (
                <Link
                  key={worksheet.worksheet_id}
                  href={`/student/${token}/worksheets/${worksheet.worksheet_id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden border-white/[0.08] bg-white/[0.025] transition-all duration-200 hover:border-violet-300/20 hover:bg-violet-400/[0.035]">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                            <ClipboardList className="h-5 w-5 text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white">
                              {worksheet.worksheet_title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/40">
                              {worksheet.worksheet_description ||
                                'Tidak ada deskripsi worksheet.'}
                            </p>

                            <div className="mt-3">
                              <Badge variant="success">
                                Tersedia
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-300/70 transition-colors group-hover:text-violet-200">
                          Kerjakan
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* Cara Menggunakan                                     */}
        {/* ---------------------------------------------------- */}

        <section className="mt-9">
          <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
            <CardContent className="p-6 sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300" />

                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300/60">
                      Cara Belajar
                    </p>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    Belajar dalam tiga langkah
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Buka module untuk mempelajari
                    materi, kerjakan worksheet yang
                    diberikan, lalu kirim jawaban Anda.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="min-w-20 rounded-xl border border-sky-300/10 bg-sky-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-sky-300">
                      1
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      Pelajari
                    </p>
                  </div>

                  <div className="min-w-20 rounded-xl border border-violet-300/10 bg-violet-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-violet-300">
                      2
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      Kerjakan
                    </p>
                  </div>

                  <div className="min-w-20 rounded-xl border border-emerald-300/10 bg-emerald-400/[0.05] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-emerald-300">
                      3
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      Kirim
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Organization Information                            */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-9 border-white/[0.07] bg-white/[0.02]">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10">
              <GraduationCap className="h-5 w-5 text-sky-300" />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.12em] text-white/25">
                Organisasi Pembelajaran
              </p>

              <p className="mt-1 truncate text-sm font-medium text-white">
                {workspace.organization_name}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}