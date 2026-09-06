import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MessageSquare,
  Send,
  Sparkles,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'
import { getStudentSubmissionImageByToken } from '@/lib/submissions/get-student-submission-image-by-token'

type SubmissionDetailPageProps = {
  params: Promise<{
    token: string
    submissionId: string
  }>
}

type SubmissionDetail = {
  submission_id: string
  student_name: string
  question_id: string
  question_title: string
  question_type: string
  question_content: string | null
  explanation: string | null
  answer_text: string | null
  answer_numeric: number | null
  answer_option_id: string | null
  answer_option_text: string | null
  answer_image_path: string | null
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string | null
  created_at: string
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'graded':
      return 'Sudah Dinilai'

    case 'submitted':
      return 'Menunggu Penilaian'

    case 'draft':
      return 'Draft'

    default:
      return status
  }
}

function getQuestionTypeLabel(type: string) {
  switch (type) {
    case 'multiple_choice':
      return 'Pilihan Ganda'

    case 'true_false':
      return 'Benar / Salah'

    case 'short_answer':
      return 'Jawaban Singkat'

    case 'numeric':
      return 'Numerik'

    case 'essay':
      return 'Esai'

    default:
      return type
  }
}

export default async function StudentSubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const {
    token,
    submissionId,
  } = await params

  const supabase = await createClient()

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_submission_detail_by_token',
    {
      access_token: token,
      target_submission_id: submissionId,
    },
  )

  if (error) {
    throw new Error(
      `Gagal mengambil detail submission: ${error.message}`,
    )
  }

  const rows =
    (data ?? []) as SubmissionDetail[]

  if (rows.length === 0) {
    notFound()
  }

  const submission = rows[0]

  const isGraded =
    submission.status === 'graded'

  const answerValue =
    submission.answer_option_text ??
    (submission.answer_numeric !== null
      ? String(submission.answer_numeric)
      : submission.answer_text)

  let answerImageUrl: string | null = null

  if (submission.answer_image_path) {
    const imageResult =
      await getStudentSubmissionImageByToken({
        token,
        submissionId,
      })

    if (imageResult.success) {
      answerImageUrl =
        imageResult.signedUrl ?? null
    }
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-4xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-violet-300/10 bg-gradient-to-br from-violet-400/[0.07] via-sky-400/[0.04] to-emerald-400/[0.035] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-violet-300/[0.08]" />

          <div className="relative">
            <Link
              href={`/student/${token}/submissions`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali ke Jawaban Saya
            </Link>

            <div className="mt-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-xs font-medium text-violet-200/80">
                <Sparkles className="h-3.5 w-3.5" />
                Hasil Belajar
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Detail Jawaban
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                    Lihat soal, jawaban Anda, nilai,
                    dan feedback dari guru.
                  </p>
                </div>

                <Badge
                  variant={
                    isGraded
                      ? 'success'
                      : 'warning'
                  }
                  className="w-fit shrink-0"
                >
                  {getStatusLabel(
                    submission.status,
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* ------------------------------------------------ */}
          {/* Submission Info                                  */}
          {/* ------------------------------------------------ */}

          <Card className="border-white/[0.08] bg-white/[0.02]">
            <CardContent className="p-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-violet-300/50">
                    Soal
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    {submission.question_title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="info">
                      {getQuestionTypeLabel(
                        submission.question_type,
                      )}
                    </Badge>

                    <span className="text-xs text-white/30">
                      Dikirim{' '}
                      {formatDate(
                        submission.submitted_at,
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    isGraded
                      ? 'bg-emerald-400/10'
                      : 'bg-amber-400/10'
                  }`}
                >
                  {isGraded ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  ) : (
                    <Clock3 className="h-6 w-6 text-amber-300" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* Question                                         */}
          {/* ------------------------------------------------ */}

          {submission.question_content && (
            <Card className="border-sky-300/10 bg-gradient-to-br from-sky-400/[0.045] to-transparent">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10">
                    <FileQuestionIcon />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Soal
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      Pertanyaan yang Anda kerjakan.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-sky-300/10 bg-sky-400/[0.025] p-5 sm:p-6">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
                    {submission.question_content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ------------------------------------------------ */}
          {/* Student Answer                                   */}
          {/* ------------------------------------------------ */}

          <Card className="border-violet-300/10 bg-gradient-to-br from-violet-400/[0.045] to-transparent">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
                  <Send className="h-5 w-5 text-violet-300" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Jawaban Anda
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Jawaban yang dikirim kepada guru.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-violet-300/10 bg-violet-400/[0.025] p-5 sm:p-6">
                {answerValue ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
                    {answerValue}
                  </p>
                ) : (
                  <p className="text-sm text-white/30">
                    Tidak ada jawaban teks.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* Answer Image                                     */}
          {/* ------------------------------------------------ */}

          {answerImageUrl && (
            <Card className="border-amber-300/10 bg-gradient-to-br from-amber-400/[0.045] to-transparent">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                    <ImageIcon className="h-5 w-5 text-amber-300" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Foto Jawaban
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      Foto yang dikirim bersama jawaban.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-amber-300/10 bg-black/20 p-2">
                  <img
                    src={answerImageUrl}
                    alt="Foto jawaban siswa"
                    className="block max-h-[700px] w-full rounded-xl object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ------------------------------------------------ */}
          {/* Grading Result                                   */}
          {/* ------------------------------------------------ */}

          {isGraded && (
            <>
              <Card className="border-emerald-300/10 bg-gradient-to-br from-emerald-400/[0.06] to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-white">
                        Hasil Penilaian
                      </h2>

                      <p className="mt-1 text-xs text-white/35">
                        Nilai yang diberikan oleh guru.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.04] p-6 text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-300/50">
                      Nilai Anda
                    </p>

                    <p className="mt-2 text-5xl font-semibold tracking-tight text-emerald-200">
                      {submission.score !== null
                        ? submission.score
                        : '-'}
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      dari 100
                    </p>
                  </div>
                </CardContent>
              </Card>

              {submission.feedback && (
                <Card className="border-sky-300/10 bg-gradient-to-br from-sky-400/[0.045] to-transparent">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10">
                        <MessageSquare className="h-5 w-5 text-sky-300" />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold text-white">
                          Feedback Guru
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                          Catatan dan masukan dari guru.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-sky-300/10 bg-sky-400/[0.025] p-5 sm:p-6">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                        {submission.feedback}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* ------------------------------------------------ */}
          {/* Pending Grading                                  */}
          {/* ------------------------------------------------ */}

          {!isGraded && (
            <Card className="border-amber-300/10 bg-gradient-to-r from-amber-400/[0.05] via-white/[0.02] to-transparent">
              <CardContent className="flex items-start gap-4 p-5 sm:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                  <Clock3 className="h-5 w-5 text-amber-300" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/75">
                    Jawaban sedang menunggu penilaian
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Guru akan memberikan nilai dan
                    feedback setelah jawaban Anda diperiksa.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ------------------------------------------------ */}
          {/* Navigation                                       */}
          {/* ------------------------------------------------ */}

          <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row">
            <Link
              href={`/student/${token}/submissions`}
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Jawaban
              </Button>
            </Link>

            <Link
              href={`/student/${token}`}
            >
              <Button
                variant="ghost"
                className="w-full sm:w-auto"
              >
                Ruang Belajar
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-white/25">
            Dikirim{' '}
            {formatDate(
              submission.submitted_at,
            )}
          </p>
        </div>
      </main>
    </div>
  )
}

function FileQuestionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-sky-300"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9.5 13a2.5 2.5 0 1 1 4.8 1c-.6.8-1.8 1-2.3 1.8-.2.3-.3.6-.3 1" />
      <path d="M12 19h.01" />
    </svg>
  )
}