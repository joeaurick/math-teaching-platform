import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
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

type QuestionNavigation = {
  question_id: string
  sort_order: number
  question_number: number
  total_questions: number
  previous_question_id: string | null
  next_question_id: string | null
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
  // 1. Ambil soal
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
  // 2. Ambil navigasi soal
  // ------------------------------------------------------------

  const {
    data: navigationData,
    error: navigationError,
  } = await supabase.rpc(
    'get_student_worksheet_question_navigation_by_token',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
    },
  )

  if (navigationError) {
    throw new Error(
      `Gagal mengambil navigasi soal: ${navigationError.message}`,
    )
  }

  const navigation =
    (navigationData?.[0] as QuestionNavigation | undefined) ??
    null

  if (!navigation) {
    notFound()
  }

  // ------------------------------------------------------------
  // 3. Options
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

  const questionType =
    questionTypeLabels[
      question.question_type
    ] ?? question.question_type

  const previousQuestionUrl =
    navigation.previous_question_id
      ? `/student/${token}/worksheets/${worksheetId}/questions/${navigation.previous_question_id}`
      : null

  const nextQuestionUrl =
    navigation.next_question_id
      ? `/student/${token}/worksheets/${worksheetId}/questions/${navigation.next_question_id}`
      : null

  const finishUrl =
    `/student/${token}/worksheets/${worksheetId}`

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------- */}
        {/* Back                                                 */}
        {/* ---------------------------------------------------- */}

        <div className="mb-6">
          <Link
            href={`/student/${token}/worksheets/${worksheetId}`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Worksheet
          </Link>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Header                                               */}
        {/* ---------------------------------------------------- */}

        <PageHeader
          eyebrow={question.worksheet_title}
          title={question.question_title}
          description="Kerjakan soal berikut dengan jawaban yang paling tepat."
        />

        {/* ---------------------------------------------------- */}
        {/* Question Counter                                     */}
        {/* ---------------------------------------------------- */}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-white/45">
            Soal{' '}
            <span className="font-medium text-white/80">
              {navigation.question_number}
            </span>
            {' '}dari{' '}
            <span className="font-medium text-white/80">
              {navigation.total_questions}
            </span>
          </div>

          <div className="text-xs text-white/30">
            {questionType}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Progress                                             */}
        {/* ---------------------------------------------------- */}

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{
              width: `${
                (navigation.question_number /
                  navigation.total_questions) *
                100
              }%`,
            }}
          />
        </div>

        {/* ---------------------------------------------------- */}
        {/* Question Card                                        */}
        {/* ---------------------------------------------------- */}

        <div className="mt-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  {questionType}
                </Badge>

                <span className="text-xs text-white/40">
                  Soal {navigation.question_number}
                </span>
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

              <div className="mt-8 border-t border-white/[0.07] pt-8">
                <QuestionAnswerForm
                  token={token}
                  worksheetId={worksheetId}
                  questionId={questionId}
                  questionType={
                    question.question_type
                  }
                  options={options}
                  nextQuestionId={
                    navigation.next_question_id
                  }
                  isLastQuestion={
                    !navigation.next_question_id
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Navigation                                           */}
        {/* ---------------------------------------------------- */}

        <div className="mt-6 flex items-center justify-between gap-3">
          {previousQuestionUrl ? (
            <Link
              href={previousQuestionUrl}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Sebelumnya
            </Link>
          ) : (
            <span />
          )}

          {nextQuestionUrl ? (
            <Link
              href={nextQuestionUrl}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              Berikutnya
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={finishUrl}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Selesai
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* Footer Info                                          */}
        {/* ---------------------------------------------------- */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
          <FileText className="h-3.5 w-3.5" />
          Soal {navigation.question_number} dari{' '}
          {navigation.total_questions}
        </div>
      </main>
    </div>
  )
}