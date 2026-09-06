import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
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
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  numeric: 'Numeric',
  essay: 'Essay',
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

  const rows = (moduleData ?? []) as StudentModuleQuestion[]

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

  // ------------------------------------------------------------
  // 4. Student workspace
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* -------------------------------------------------- */}
        {/* Back */}
        {/* -------------------------------------------------- */}

        <div className="mb-6">
          <Link
            href={`/student/${token}`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke My Modules
          </Link>
        </div>

        {/* -------------------------------------------------- */}
        {/* Module Header                                      */}
        {/* -------------------------------------------------- */}

        <PageHeader
          eyebrow="Module"
          title={module.module_title}
          description={
            module.module_description ||
            'Tidak ada deskripsi module.'
          }
        />

        {/* -------------------------------------------------- */}
        {/* Module Summary                                     */}
        {/* -------------------------------------------------- */}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <BookOpen className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Module
                </p>

                <p className="mt-1 text-sm font-medium">
                  {module.module_title}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <FileText className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Questions
                </p>

                <p className="mt-1 text-sm font-medium">
                  {questions.length} Soal
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <BookOpen className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Student
                </p>

                <p className="mt-1 text-sm font-medium">
                  {access.student_name || 'Student'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------------------------- */}
        {/* Questions                                          */}
        {/* -------------------------------------------------- */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Questions
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Pilih soal untuk mulai mengerjakan.
            </p>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <FileText className="h-5 w-5 text-white/50" />
                </div>

                <h3 className="text-base font-semibold">
                  Belum ada soal
                </h3>

                <p className="mt-2 max-w-md text-sm text-white/50">
                  Module ini belum memiliki soal yang
                  dipublikasikan.
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
                      ] ?? question.question_type
                    : 'Question'

                return (
                  <Card
                    key={question.question_id}
                    className="transition-colors hover:border-white/[0.18]"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          {/* Number */}

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-medium text-white/70">
                            {index + 1}
                          </div>

                          {/* Question Info */}

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">
                              {question.question_title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge>
                                {questionType}
                              </Badge>

                              <span className="text-xs text-white/40">
                                Soal {index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Open */}

                        <Link
                          href={`/student/${token}/modules/${moduleId}/questions/${question.question_id}`}
                          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
                        >
                          Buka Soal
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* -------------------------------------------------- */}
        {/* Back Button                                        */}
        {/* -------------------------------------------------- */}

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