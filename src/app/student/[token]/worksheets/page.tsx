import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
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

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-violet-300/10 bg-gradient-to-br from-violet-400/[0.07] via-sky-400/[0.04] to-emerald-400/[0.035] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-violet-300/[0.08]" />

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
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-xs font-medium text-violet-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tugas Belajar
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Worksheet Saya
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                  Kerjakan latihan yang diberikan oleh
                  guru dan kirimkan jawaban Anda setelah
                  selesai.
                </p>
              </div>

              <Badge
                variant="info"
                className="w-fit"
              >
                {worksheets.length}{' '}
                {worksheets.length === 1
                  ? 'Worksheet'
                  : 'Worksheet'}
              </Badge>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Worksheet List                                       */}
        {/* ---------------------------------------------------- */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Tugas Anda
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Pilih worksheet untuk mulai mengerjakan.
            </p>
          </div>

          {worksheets.length === 0 ? (
            <Card className="overflow-hidden border-amber-300/10 bg-gradient-to-br from-amber-400/[0.06] via-white/[0.02] to-transparent">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-400/10">
                  <ClipboardList className="h-6 w-6 text-amber-300" />
                </div>

                <h2 className="mt-5 text-base font-semibold text-white">
                  Belum ada worksheet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Guru belum memberikan worksheet
                  kepada Anda. Worksheet baru akan
                  muncul di sini setelah diberikan.
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
            <div className="space-y-4">
              {worksheets.map((worksheet) => (
                <Link
                  key={worksheet.worksheet_id}
                  href={`/student/${token}/worksheets/${worksheet.worksheet_id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden border-violet-300/10 bg-gradient-to-r from-violet-400/[0.045] via-white/[0.02] to-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-violet-400/[0.06]">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/10">
                            <ClipboardList className="h-5 w-5 text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-base font-semibold text-white transition-colors group-hover:text-violet-200">
                                {worksheet.worksheet_title}
                              </h2>

                              <Badge variant="success">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Tersedia
                              </Badge>
                            </div>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
                              {worksheet.worksheet_description ||
                                'Tidak ada deskripsi worksheet.'}
                            </p>

                            <p className="mt-3 text-xs text-white/25">
                              Siap untuk dikerjakan
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-300/70 transition-colors group-hover:text-violet-200">
                          Mulai Mengerjakan
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
        {/* Learning Tip                                         */}
        {/* ---------------------------------------------------- */}

        <Card className="mt-8 border-sky-300/10 bg-gradient-to-r from-sky-400/[0.045] via-violet-400/[0.03] to-transparent">
          <CardContent className="flex items-start gap-3 p-5 sm:p-6">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

            <div>
              <p className="text-sm font-medium text-white/70">
                Tips mengerjakan
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Baca setiap soal dengan teliti dan
                pastikan jawaban Anda sudah benar sebelum
                mengirimkan worksheet.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}