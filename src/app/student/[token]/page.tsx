import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  ClipboardList,
  MessageCircle,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
    'Student'

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
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-white/40">
              {workspace.organization_name}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Student Workspace
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Selamat datang, {studentName}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge>
              Student
            </Badge>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Workspace Cards                                      */}
        {/* ---------------------------------------------------- */}

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* My Modules */}

          <Link
            href={`/student/${token}/modules`}
            className="group block"
          >
            <Card className="h-full transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                    <BookOpen className="h-5 w-5 text-white/60" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                </div>

                <h2 className="mt-6 text-base font-semibold">
                  My Modules
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Lihat module pembelajaran yang diberikan
                  kepada Anda.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* My Worksheets */}

          <Link
            href={`/student/${token}/worksheets`}
            className="group block"
          >
            <Card className="h-full transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                    <ClipboardList className="h-5 w-5 text-white/60" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                </div>

                <h2 className="mt-6 text-base font-semibold">
                  My Worksheets
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Lihat worksheet yang diberikan kepada Anda.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* My Submissions */}

          <Link
            href={`/student/${token}/submissions`}
            className="group block"
          >
            <Card className="h-full transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                    <FileText className="h-5 w-5 text-white/60" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                </div>

                <h2 className="mt-6 text-base font-semibold">
                  My Submissions
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Lihat jawaban dan hasil submission Anda.
                </p>
              </CardContent>
            </Card>
          </Link>
{/* Chat */}

          <Link
            href={`/student/${token}/chat`}
            className="group block"
          >
            <Card className="h-full transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                    <MessageCircle className="h-5 w-5 text-white/60" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                </div>

                <h2 className="mt-6 text-base font-semibold">
                  Chat
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Berkomunikasi langsung dengan guru Anda.
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>

                  

        {/* ---------------------------------------------------- */}
        {/* Assigned Worksheets                                  */}
        {/* ---------------------------------------------------- */}

        <div className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Assigned Worksheets
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Worksheet yang diberikan kepada Anda.
            </p>
          </div>

          {worksheets.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <ClipboardList className="h-5 w-5 text-white/30" />
                </div>

                <h3 className="mt-5 text-base font-medium text-white/80">
                  Belum ada worksheet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Belum ada worksheet yang diberikan
                  kepada Anda.
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
                  <Card className="transition-colors hover:border-white/[0.18] hover:bg-white/[0.04]">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                            <ClipboardList className="h-5 w-5 text-white/50" />
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
                                Published
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-white/50 transition-colors group-hover:text-white">
                          Mulai
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* Organization Information                            */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-10">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <GraduationCap className="h-5 w-5 text-white/50" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-white/35">
                Learning Organization
              </p>

              <p className="mt-1 truncate text-sm font-medium">
                {workspace.organization_name}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}