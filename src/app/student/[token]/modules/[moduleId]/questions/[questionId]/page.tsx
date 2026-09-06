import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { QuestionAnswerForm } from './question-answer-form'

type StudentWorksheetQuestionPageProps = {
  params: Promise<{
    token: string
    worksheetId: string
    questionId: string
  }>
}

type StudentWorksheetQuestionRow = {
  worksheet_id: string
  worksheet_title: string
  question_id: string
  question_title: string
  question_type: string
  question_content: string
  question_explanation: string | null
  option_id: string | null
  option_text: string | null
  option_sort_order: number | null
}

type QuestionOption = {
  id: string
  text: string
  sortOrder: number
}

type SubmissionRow = {
  submission_id: string
  submission_status: string
  answer_text: string | null
  answer_numeric: number | null
  answer_option_id: string | null
  score: number | null
  feedback: string | null
  submitted_at: string | null
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  short_answer: 'Jawaban Singkat',
  numeric: 'Jawaban Angka',
  essay: 'Esai',
}

export default async function StudentWorksheetQuestionPage({
  params,
}: StudentWorksheetQuestionPageProps) {
  const {
    token,
    worksheetId,
    questionId,
  } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // Question
  // ------------------------------------------------------------

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_student_worksheet_question_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
    },
  )

  if (error) {
    throw new Error(
      `Gagal mengambil soal: ${error.message}`,
    )
  }

  const rows =
    (data ?? []) as StudentWorksheetQuestionRow[]

  if (rows.length === 0) {
    notFound()
  }

  const question = rows[0]

  // ------------------------------------------------------------
  // Options
  // ------------------------------------------------------------

  const options: QuestionOption[] = rows
    .filter(
      (row) =>
        row.option_id &&
        row.option_text !== null,
    )
    .map((row) => ({
      id: row.option_id as string,
      text: row.option_text as string,
      sortOrder:
        row.option_sort_order ?? 0,
    }))
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    )

  // ------------------------------------------------------------
  // Existing Submission
  // ------------------------------------------------------------

  const {
    data: submissionData,
    error: submissionError,
  } = await supabase.rpc(
    'get_student_worksheet_question_submission_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
    },
  )

  if (submissionError) {
    throw new Error(
      `Gagal mengambil status jawaban: ${submissionError.message}`,
    )
  }

  const submission =
    (submissionData?.[0] as
      | SubmissionRow
      | undefined) ?? null

  const isSubmitted =
    submission?.submission_status ===
      'submitted' ||
    submission?.submission_status ===
      'graded'

  const questionType =
    questionTypeLabels[
      question.question_type
    ] ?? question.question_type

  // ------------------------------------------------------------
  // Submitted Answer Display
  // ------------------------------------------------------------

  let submittedAnswer: string | null = null

  if (submission) {
    if (
      question.question_type ===
        'multiple_choice' ||
      question.question_type ===
        'true_false'
    ) {
      const selectedOption =
        options.find(
          (option) =>
            option.id ===
            submission.answer_option_id,
        )

      submittedAnswer =
        selectedOption?.text ?? null
    } else if (
      question.question_type === 'numeric'
    ) {
      submittedAnswer =
        submission.answer_numeric !== null
          ? String(
              submission.answer_numeric,
            )
          : null
    } else {
      submittedAnswer =
        submission.answer_text?.trim() || null
    }
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}

        <div className="mb-6">
          <Link
            href={`/student/${token}/worksheets/${worksheetId}`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Worksheet
          </Link>
        </div>

        {/* Header */}

        <PageHeader
          eyebrow={question.worksheet_title}
          title={question.question_title}
          description={
            isSubmitted
              ? 'Soal ini sudah Anda kerjakan.'
              : 'Kerjakan soal berikut dengan jawaban yang paling tepat.'
          }
          actions={
            isSubmitted ? (
              <Badge variant="success">
                Sudah Dikirim
              </Badge>
            ) : (
              <Badge>
                {questionType}
              </Badge>
            )
          }
        />

        {/* Question */}

        <div className="mt-8">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  {questionType}
                </Badge>

                {isSubmitted && (
                  <Badge variant="success">
                    Sudah Dikirim
                  </Badge>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold">
                  {question.question_title}
                </h2>

                <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                    {question.question_content}
                  </p>
                </div>
              </div>

              {/* ------------------------------------------------
                  Submitted State
              ------------------------------------------------ */}

              {isSubmitted ? (
                <div className="mt-8 border-t border-white/[0.07] pt-8">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]">
                        <CheckCircle2 className="h-5 w-5 text-white/70" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold">
                          Jawaban Sudah Dikirim
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-white/40">
                          Soal ini sudah Anda kerjakan
                          dan tidak dapat diubah kembali.
                        </p>
                      </div>
                    </div>

                    {submittedAnswer && (
                      <div className="mt-6">
                        <p className="text-xs text-white/35">
                          Jawaban Anda
                        </p>

                        <div className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                          <p className="whitespace-pre-wrap text-sm leading-6 text-white/75">
                            {submittedAnswer}
                          </p>
                        </div>
                      </div>
                    )}

                    {submission?.submitted_at && (
                      <div className="mt-5">
                        <p className="text-xs text-white/30">
                          Dikirim pada
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          {new Date(
                            submission.submitted_at,
                          ).toLocaleString(
                            'id-ID',
                          )}
                        </p>
                      </div>
                    )}

                    {submission?.score !==
                      null &&
                      submission?.score !==
                        undefined && (
                        <div className="mt-5">
                          <p className="text-xs text-white/30">
                            Nilai
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {submission.score}
                          </p>
                        </div>
                      )}

                    {submission?.feedback && (
                      <div className="mt-5">
                        <p className="text-xs text-white/30">
                          Feedback
                        </p>

                        <div className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                          <p className="whitespace-pre-wrap text-sm leading-6 text-white/60">
                            {submission.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ------------------------------------------------
                   Answer Form
                ------------------------------------------------ */

                <div className="mt-8 border-t border-white/[0.07] pt-8">
                  <QuestionAnswerForm
                    token={token}
                    worksheetId={worksheetId}
                    questionId={questionId}
                    questionType={
                      question.question_type
                    }
                    options={options}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/student/${token}/worksheets/${worksheetId}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" />
            Worksheet
          </Link>

          <div className="flex items-center gap-2 text-xs text-white/30">
            <FileText className="h-3.5 w-3.5" />
            {questionType}
          </div>

          {isSubmitted ? (
            <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-4 text-sm text-white/30">
              <CheckCircle2 className="h-4 w-4" />
              Selesai
            </div>
          ) : (
            <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-4 text-sm text-white/30">
              Soal
            </div>
          )}
        </div>
      </main>
    </div>
  )
}