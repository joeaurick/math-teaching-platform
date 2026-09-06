'use server'

import { createClient } from '@/lib/supabase/server'

type GradeSubmissionInput = {
  submissionId: string
  organizationId: string
  score: number
  feedback: string
}

export async function gradeStudentSubmission({
  submissionId,
  organizationId,
  score,
  feedback,
}: GradeSubmissionInput) {
  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. User
  // ------------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'Anda harus login.',
    }
  }

  // ------------------------------------------------------------
  // 2. Membership
  // ------------------------------------------------------------

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    return {
      success: false,
      error: membershipError.message,
    }
  }

  if (!membership) {
    return {
      success: false,
      error: 'Anda tidak memiliki akses ke organization ini.',
    }
  }

  // ------------------------------------------------------------
  // 3. Validasi nilai
  // ------------------------------------------------------------

  if (!Number.isFinite(score)) {
    return {
      success: false,
      error: 'Nilai harus berupa angka.',
    }
  }

  if (score < 0 || score > 100) {
    return {
      success: false,
      error: 'Nilai harus berada antara 0 dan 100.',
    }
  }

  // ------------------------------------------------------------
  // 4. Pastikan submission ada di organization
  // ------------------------------------------------------------

  const {
    data: submission,
    error: submissionError,
  } = await supabase
    .from('student_submissions')
    .select('id, status')
    .eq('id', submissionId)
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (submissionError) {
    return {
      success: false,
      error: submissionError.message,
    }
  }

  if (!submission) {
    return {
      success: false,
      error: 'Submission tidak ditemukan.',
    }
  }

  // ------------------------------------------------------------
  // 5. Update nilai
  // ------------------------------------------------------------

  const {
    error: updateError,
  } = await supabase
    .from('student_submissions')
    .update({
      score,
      feedback: feedback.trim() || null,
      status: 'graded',
      updated_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .eq('organization_id', organizationId)

  if (updateError) {
    return {
      success: false,
      error: `Gagal menyimpan penilaian: ${updateError.message}`,
    }
  }

  return {
    success: true,
  }
}