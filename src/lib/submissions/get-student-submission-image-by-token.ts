import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type GetStudentSubmissionImageByTokenInput = {
  token: string
  submissionId: string
}

type SubmissionRow = {
  submission_id: string
  answer_image_path: string | null
}

export async function getStudentSubmissionImageByToken({
  token,
  submissionId,
}: GetStudentSubmissionImageByTokenInput) {
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
    return {
      success: false,
      error: error.message,
    }
  }

  const rows =
    (data ?? []) as SubmissionRow[]

  if (rows.length === 0) {
    return {
      success: false,
      error: 'Submission tidak ditemukan.',
    }
  }

  const submission = rows[0]

  if (!submission.answer_image_path) {
    return {
      success: false,
      error: 'Submission tidak memiliki foto jawaban.',
    }
  }

  const adminSupabase = createAdminClient()

  const {
    data: signedUrlData,
    error: signedUrlError,
  } =
    await adminSupabase.storage
      .from('student-submissions')
      .createSignedUrl(
        submission.answer_image_path,
        60 * 10,
      )

  if (
    signedUrlError ||
    !signedUrlData?.signedUrl
  ) {
    return {
      success: false,
      error:
        signedUrlError?.message ??
        'Gagal membuat URL foto jawaban.',
    }
  }

  return {
    success: true,
    signedUrl: signedUrlData.signedUrl,
  }
}