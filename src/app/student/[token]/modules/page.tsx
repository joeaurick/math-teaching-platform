import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
    'Student'

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}

        <div>
          <Link
            href={`/student/${token}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Workspace
          </Link>

          <div className="mt-8">
            <p className="text-sm text-white/40">
              {workspace.organization_name}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Modules
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Module pembelajaran yang diberikan kepada{' '}
              {studentName}.
            </p>
          </div>
        </div>

        {/* Modules */}

        {modules.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                <BookOpen className="h-5 w-5 text-white/40" />
              </div>

              <h2 className="mt-5 text-base font-semibold">
                Belum ada module
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Guru belum memberikan module pembelajaran
                kepada Anda.
              </p>

              <Link
                href={`/student/${token}`}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.12] px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                Kembali ke Workspace
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.module_id}
                href={`/student/${token}/modules/${module.module_id}`}
                className="group block"
              >
                <Card className="h-full transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                        <BookOpen className="h-5 w-5 text-white/55" />
                      </div>

                      <ArrowRight className="h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                    </div>

                    <div className="mt-6">
                      <Badge>
                        Published
                      </Badge>
                    </div>

                    <h2 className="mt-4 text-base font-semibold">
                      {module.module_title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/40">
                      {module.module_description ||
                        'Tidak ada deskripsi untuk module ini.'}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="text-xs text-white/30">
                        Buka module
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}