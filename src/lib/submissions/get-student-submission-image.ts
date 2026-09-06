import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type GetStudentSubmissionImageInput = {
  submissionId: string
}

export async function getStudentSubmissionImage({
  submissionId,
}: GetStudentSubmissionImageInput) {
  const supabase = await createClient()

  // Pastikan teacher sudah login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'Anda harus login.',
    }
  }

  // Ambil submission melalui client biasa
  // sehingga RLS organization tetap berlaku.
  const { data: submission, error } =
    await supabase
      .from('student_submissions')
      .select(`
        id,
        organization_id,
        answer_image_path
      `)
      .eq('id', submissionId)
      .maybeSingle()

  if (error || !submission) {
    return {
      success: false,
      error: 'Submission tidak ditemukan.',
    }
  }

  if (!submission.answer_image_path) {
    return {
      success: false,
      error: 'Submission tidak memiliki gambar.',
    }
  }

  // Admin client HANYA digunakan server-side
  // untuk membuat signed URL dari bucket private.
  const adminSupabase = createAdminClient()

  const { data, error: signedUrlError } =
    await adminSupabase.storage
      .from('student-submissions')
      .createSignedUrl(
        submission.answer_image_path,
        60 * 10,
      )

  if (signedUrlError || !data?.signedUrl) {
    return {
      success: false,
      error:
        signedUrlError?.message ??
        'Gagal membuat URL gambar.',
    }
  }

  return {
    success: true,
    signedUrl: data.signedUrl,
  }
}