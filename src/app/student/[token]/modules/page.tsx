import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type StudentModulesPageProps = {
  params: Promise<{
    token: string
  }>
}

type StudentModule = {
  module_id: string
  module_title: string
  module_description: string | null
  module_status: string
  created_at: string
}

export default async function StudentModulesPage({
  params,
}: StudentModulesPageProps) {
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

  const workspace = workspaceData?.[0]

  if (!workspace) {
    notFound()
  }

  // ------------------------------------------------------------
  // Assigned modules
  // ------------------------------------------------------------

  const {
    data: modulesData,
    error: modulesError,
  } = await supabase.rpc(
    'get_student_modules_by_token',
    {
      access_token: token,
    },
  )

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

  const modules =
    (modulesData ?? []) as StudentModule[]

  const studentName =
    workspace.student_name?.trim() ||
    'Siswa'

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.07] via-violet-400/[0.045] to-emerald-400/[0.035] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-sky-300/[0.08]" />

          <div className="relative">
            <Link
              href={`/student/${token}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali ke Ruang Belajar
            </Link>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Materi Pembelajaran
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Module Saya
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                  Pelajari materi yang telah diberikan
                  oleh guru kepada Anda, {studentName}.
                </p>

                <p className="mt-4 text-sm text-white/30">
                  {workspace.organization_name}
                </p>
              </div>

              <Badge
                variant="info"
                className="w-fit"
              >
                {modules.length} Materi
              </Badge>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Modules                                              */}
        {/* ---------------------------------------------------- */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Materi untuk Anda
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Pilih module untuk mulai mempelajari
              materinya.
            </p>
          </div>

          {modules.length === 0 ? (
            <Card className="overflow-hidden border-amber-300/10 bg-gradient-to-br from-amber-400/[0.06] via-white/[0.02] to-transparent">
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-400/10">
                  <BookOpen className="h-6 w-6 text-amber-300" />
                </div>

                <h2 className="mt-5 text-base font-semibold text-white">
                  Belum ada module
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Guru belum memberikan materi
                  pembelajaran kepada Anda. Module baru
                  akan muncul di sini setelah diberikan.
                </p>

                <Link
                  href={`/student/${token}`}
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
                >
                  Kembali ke Ruang Belajar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.module_id}
                  href={`/student/${token}/modules/${module.module_id}`}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden border-sky-300/10 bg-gradient-to-br from-sky-400/[0.045] via-white/[0.02] to-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-400/[0.06]">
                    <CardContent className="flex h-full flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/10 bg-sky-400/10">
                          <BookOpen className="h-5 w-5 text-sky-300" />
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] transition-colors group-hover:bg-white/[0.08]">
                          <ArrowRight className="h-4 w-4 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Badge variant="success">
                          Tersedia
                        </Badge>
                      </div>

                      <h2 className="mt-4 text-base font-semibold text-white transition-colors group-hover:text-sky-200">
                        {module.module_title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/40">
                        {module.module_description ||
                          'Tidak ada deskripsi untuk module ini.'}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-7">
                        <span className="text-xs text-white/25">
                          Materi pembelajaran
                        </span>

                        <span className="flex items-center gap-1.5 text-xs font-medium text-sky-300/60 transition-colors group-hover:text-sky-200">
                          Pelajari
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* Learning Tip                                         */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-8 border-violet-300/10 bg-gradient-to-r from-violet-400/[0.045] via-sky-400/[0.025] to-transparent">
          <CardContent className="flex items-start gap-3 p-5 sm:p-6">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

            <div>
              <p className="text-sm font-medium text-white/70">
                Tips belajar
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Pelajari materi secara bertahap dan
                jangan ragu menggunakan Chat jika Anda
                membutuhkan bantuan dari guru.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}