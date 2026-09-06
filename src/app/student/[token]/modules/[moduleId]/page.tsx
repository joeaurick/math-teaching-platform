import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Sparkles,
  Target,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type StudentModulePageProps = {
  params: Promise<{
    token: string
    moduleId: string
  }>
}

type StudentModuleQuestion = {
  module_id: string
  module_title: string
  module_description: string | null
  question_id: string | null
  question_title: string | null
  question_type: string | null
  question_content: string | null
  question_explanation: string | null
  question_status: string | null
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  short_answer: 'Jawaban Singkat',
  numeric: 'Numerik',
  essay: 'Esai',
}

const questionTypeStyles: Record<string, string> = {
  multiple_choice:
    'border-sky-300/15 bg-sky-400/10 text-sky-200',
  true_false:
    'border-emerald-300/15 bg-emerald-400/10 text-emerald-200',
  short_answer:
    'border-violet-300/15 bg-violet-400/10 text-violet-200',
  numeric:
    'border-amber-300/15 bg-amber-400/10 text-amber-200',
  essay:
    'border-rose-300/15 bg-rose-400/10 text-rose-200',
}

export default async function StudentModulePage({
  params,
}: StudentModulePageProps) {
  const { token, moduleId } = await params
  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. Validasi student access
  // ------------------------------------------------------------

  const {
    data: accessData,
    error: accessError,
  } = await supabase.rpc('get_student_access_by_token', {
    access_token: token,
  })

  if (accessError) {
    throw new Error(
      `Gagal memeriksa student access: ${accessError.message}`,
    )
  }

  const access = accessData?.[0]

  if (!access) {
    notFound()
  }

  // ------------------------------------------------------------
  // 2. Ambil module + questions
  // ------------------------------------------------------------

  const {
    data: moduleData,
    error: moduleError,
  } = await supabase.rpc(
    'get_student_module_detail_by_token',
    {
      access_token: token,
      target_module_id: moduleId,
    },
  )

  if (moduleError) {
    throw new Error(
      `Gagal mengambil module: ${moduleError.message}`,
    )
  }

  const rows = (moduleData ??
    []) as StudentModuleQuestion[]

  if (rows.length === 0) {
    notFound()
  }

  // ------------------------------------------------------------
  // 3. Informasi module berasal dari row pertama
  // ------------------------------------------------------------

  const module = rows[0]

  const questions = rows.filter(
    (question) => question.question_id !== null,
  )

  const totalQuestions = questions.length

  // ------------------------------------------------------------
  // 4. Progress
  //
  // Belum ada data submission/progress di RPC ini.
  // Karena itu kita tidak membuat progress palsu.
  // ------------------------------------------------------------

  const progress =
    totalQuestions > 0 ? 0 : 0

  // ------------------------------------------------------------
  // 5. First question
  // ------------------------------------------------------------

  const firstQuestion = questions[0]

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ================================================== */}
        {/* BACK                                               */}
        {/* ================================================== */}

        <div className="mb-6">
          <Link
            href={`/student/${token}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke My Modules
          </Link>
        </div>

        {/* ================================================== */}
        {/* HERO                                               */}
        {/* ================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-sky-300/10 bg-gradient-to-br from-sky-400/[0.10] via-violet-400/[0.055] to-emerald-400/[0.045] p-6 shadow-[0_20px_80px_rgba(56,189,248,0.06)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-sky-300/[0.08]" />

          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-400/[0.05] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-400/[0.05] blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                <BookOpen className="h-3.5 w-3.5" />
                Module Pembelajaran
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {module.module_title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                {module.module_description ||
                  'Pelajari materi ini dan kerjakan soal yang tersedia untuk meningkatkan pemahaman Anda.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-xs text-white/50">
                  <GraduationCap className="h-4 w-4 text-sky-300/70" />
                  {access.student_name || 'Student'}
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-xs text-white/50">
                  <FileText className="h-4 w-4 text-violet-300/70" />
                  {totalQuestions} soal
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-[32px] border border-white/[0.08] bg-white/[0.035]">
                <div className="absolute inset-3 rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-400/10 to-sky-400/10" />

                <div className="relative flex flex-col items-center">
                  <Sparkles className="h-7 w-7 text-violet-300" />

                  <span className="mt-2 text-xs font-medium text-white/50">
                    Keep Learning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* LEARNING SUMMARY                                   */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-sky-300/10 bg-sky-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10">
                <BookOpen className="h-5 w-5 text-sky-300" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-white/35">
                  Materi
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {module.module_title}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-300/10 bg-violet-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10">
                <FileText className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <p className="text-xs text-white/35">
                  Jumlah Soal
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {totalQuestions} soal
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/10 bg-emerald-400/[0.035]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10">
                <Target className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-white/35">
                    Progress
                  </p>

                  <span className="text-xs font-medium text-emerald-300/70">
                    {progress}%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================================================== */}
        {/* START LEARNING                                     */}
        {/* ================================================== */}

        {firstQuestion && (
          <section className="mt-8">
            <Card className="overflow-hidden border-emerald-300/10 bg-gradient-to-r from-emerald-400/[0.055] via-sky-400/[0.035] to-transparent">
              <CardContent className="p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-400/10">
                      <Sparkles className="h-5 w-5 text-emerald-300" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-300/60">
                        Mulai Belajar
                      </p>

                      <h2 className="mt-1.5 text-base font-semibold text-white">
                        Siap mengerjakan soal pertama?
                      </h2>

                      <p className="mt-1.5 text-sm text-white/35">
                        Mulai dari soal pertama dan lanjutkan
                        sesuai kemampuan Anda.
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/student/${token}/modules/${moduleId}/questions/${firstQuestion.question_id}`}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Mulai Belajar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ================================================== */}
        {/* QUESTIONS                                          */}
        {/* ================================================== */}

        <section className="mt-9">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-400/10">
                <FileText className="h-4 w-4 text-violet-300" />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Daftar Soal
              </h2>
            </div>

            <p className="mt-2 text-sm text-white/35">
              Pilih soal untuk mulai mengerjakan.
            </p>
          </div>

          {questions.length === 0 ? (
            <Card className="border-amber-300/10 bg-amber-400/[0.025]">
              <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-400/10">
                  <FileText className="h-6 w-6 text-amber-300" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Belum ada soal
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Module ini belum memiliki soal yang
                  dapat dikerjakan.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => {
                const questionType =
                  question.question_type
                    ? questionTypeLabels[
                        question.question_type
                      ] ??
                      question.question_type
                    : 'Soal'

                const questionStyle =
                  question.question_type
                    ? questionTypeStyles[
                        question.question_type
                      ] ??
                      'border-white/[0.08] bg-white/[0.035] text-white/50'
                    : 'border-white/[0.08] bg-white/[0.035] text-white/50'

                return (
                  <Link
                    key={question.question_id}
                    href={`/student/${token}/modules/${moduleId}/questions/${question.question_id}`}
                    className="group block"
                  >
                    <Card className="overflow-hidden border-white/[0.07] bg-white/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-400/[0.025] hover:shadow-[0_14px_40px_rgba(56,189,248,0.05)]">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center gap-4">
                          {/* Number */}

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-300/10 bg-sky-400/[0.07] text-sm font-bold text-sky-200/80 transition-colors group-hover:border-sky-300/20 group-hover:bg-sky-400/10">
                            {String(index + 1).padStart(
                              2,
                              '0',
                            )}
                          </div>

                          {/* Content */}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/25">
                                Soal {index + 1}
                              </span>

                              <Badge
                                className={questionStyle}
                              >
                                {questionType}
                              </Badge>
                            </div>

                            <h3 className="mt-1.5 truncate text-sm font-semibold text-white transition-colors group-hover:text-sky-100 sm:text-base">
                              {question.question_title ||
                                `Soal ${index + 1}`}
                            </h3>

                            {question.question_content && (
                              <p className="mt-1 line-clamp-1 text-xs text-white/30">
                                {question.question_content}
                              </p>
                            )}
                          </div>

                          {/* Action */}

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.035] transition-all group-hover:bg-sky-400/10">
                            <ArrowRight className="h-4 w-4 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-sky-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* LEARNING TIP                                       */}
        {/* ================================================== */}

        <Card className="mt-9 overflow-hidden border-sky-300/10 bg-gradient-to-r from-sky-400/[0.045] via-violet-400/[0.025] to-transparent">
          <CardContent className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10">
              <CheckCircle2 className="h-4 w-4 text-sky-300" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/75">
                Tips belajar
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Kerjakan setiap soal dengan tenang. Jika
                belum yakin, baca kembali materi sebelum
                memilih jawaban.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* BACK                                               */}
        {/* ================================================== */}

        <div className="mt-8">
          <Link href={`/student/${token}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke My Modules
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}