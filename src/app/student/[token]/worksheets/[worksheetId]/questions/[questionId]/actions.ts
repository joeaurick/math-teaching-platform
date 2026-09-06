'use server'

import { createClient } from '@/lib/supabase/server'

type SubmitStudentWorksheetAnswerInput = {
  token: string
  worksheetId: string
  questionId: string
  questionType: string
  optionId?: string
  textAnswer?: string
  numericAnswer?: string
  imagePath?: string
}

export async function submitStudentWorksheetAnswer({
  token,
  worksheetId,
  questionId,
  questionType,
  optionId,
  textAnswer,
  numericAnswer,
  imagePath,
}: SubmitStudentWorksheetAnswerInput) {
  const supabase = await createClient()

  let numericValue: number | null = null

  if (
    numericAnswer !== undefined &&
    numericAnswer !== ''
  ) {
    numericValue = Number(numericAnswer)

    if (Number.isNaN(numericValue)) {
      return {
        success: false,
        error: 'Jawaban angka tidak valid.',
      }
    }
  }

  const { data, error } = await supabase.rpc(
    'submit_student_worksheet_answer',
    {
      access_token: token,
      target_worksheet_id: worksheetId,
      target_question_id: questionId,
      answer_text_value:
        textAnswer?.trim() || null,
      answer_numeric_value: numericValue,
      answer_option_value:
        optionId || null,
        answer_image_path_value: imagePath || null,
    },
  )

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  const submission = data?.[0]

  if (!submission) {
    return {
      success: false,
      error: 'Submission tidak berhasil dibuat.',
    }
  }

  return {
    success: true,
    submissionId: submission.submission_id,
    status: submission.submission_status,
  }
}