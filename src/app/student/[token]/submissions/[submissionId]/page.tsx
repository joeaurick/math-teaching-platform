import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MessageSquare,
  Send,
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
      return 'Essay'

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
  answerImageUrl = imageResult.signedUrl ?? null
}
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader
          eyebrow="My Submissions"
          title="Detail Submission"
          description="Lihat jawaban dan hasil penilaian Anda."
        />

        <div className="mt-8 space-y-6">
          {/* ------------------------------------------------ */}
          {/* Submission Header                                */}
          {/* ------------------------------------------------ */}

          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs text-white/35">
                    Soal
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    {submission.question_title}
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    {getQuestionTypeLabel(
                      submission.question_type,
                    )}
                  </p>
                </div>

                <Badge
                  variant={
                    isGraded
                      ? 'success'
                      : 'default'
                  }
                >
                  {isGraded
                    ? 'Sudah Dinilai'
                    : getStatusLabel(
                        submission.status,
                      )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* Question                                         */}
          {/* ------------------------------------------------ */}

          {submission.question_content && (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Clock3 className="h-5 w-5 text-white/60" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold">
                      Soal
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      Pertanyaan yang Anda kerjakan.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
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

          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Send className="h-5 w-5 text-white/60" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">
                    Jawaban Anda
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Jawaban yang dikirim ke guru.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
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
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                    <ImageIcon className="h-5 w-5 text-white/60" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold">
                      Foto Jawaban
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      Foto yang dikirim bersama jawaban.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2">
                  <img
                    src={answerImageUrl}
                    alt="Foto jawaban student"
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
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                      <CheckCircle2 className="h-5 w-5 text-white/60" />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">
                        Hasil Penilaian
                      </h2>

                      <p className="mt-1 text-xs text-white/35">
                        Nilai yang diberikan guru.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                    <p className="text-xs text-white/40">
                      Nilai
                    </p>

                    <p className="mt-2 text-4xl font-semibold">
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
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                        <MessageSquare className="h-5 w-5 text-white/60" />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold">
                          Feedback Guru
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                          Catatan dari guru.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
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
          {/* Navigation                                       */}
          {/* ------------------------------------------------ */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/student/${token}/submissions`}
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke My Submissions
              </Button>
            </Link>

            <Link
              href={`/student/${token}`}
            >
              <Button
                variant="ghost"
                className="w-full sm:w-auto"
              >
                Student Workspace
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