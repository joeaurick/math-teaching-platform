import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type StudentWorksheetsPageProps = {
  params: Promise<{
    token: string
  }>
}

type StudentWorksheet = {
  worksheet_id: string
  worksheet_title: string
  worksheet_description: string | null
  worksheet_status: string
  created_at: string
}

export default async function StudentWorksheetsPage({
  params,
}: StudentWorksheetsPageProps) {
  const { token } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // Student Worksheets
  // ------------------------------------------------------------

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_worksheets_by_token',
    {
      access_token: token,
    },
  )

  if (error) {
    throw new Error(
      `Gagal mengambil worksheet student: ${error.message}`,
    )
  }

  const worksheets =
    (data ?? []) as StudentWorksheet[]

  // Jika token tidak valid / tidak memiliki akses,
  // RPC biasanya akan mengembalikan data kosong.
  // Kita tetap menampilkan halaman kosong agar route valid.
  if (!worksheets) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div>
          <Link
            href={`/student/${token}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Workspace
          </Link>

          <div className="mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <ClipboardList className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  My Worksheets
                </h1>

                <p className="mt-2 text-sm text-white/40">
                  Worksheet yang diberikan kepada Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Worksheets                                           */}
        {/* ---------------------------------------------------- */}

        <div className="mt-10">
          {worksheets.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <ClipboardList className="h-5 w-5 text-white/30" />
                </div>

                <h2 className="mt-5 text-base font-medium text-white/80">
                  Belum ada worksheet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Belum ada worksheet yang diberikan
                  kepada Anda.
                </p>

                <Link
                  href={`/student/${token}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  Kembali ke Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
                            <h2 className="text-sm font-semibold text-white">
                              {worksheet.worksheet_title}
                            </h2>

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

      </main>
    </div>
  )
}