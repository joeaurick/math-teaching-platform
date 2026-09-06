'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type UploadStudentWorksheetImageInput = {
  token: string
  worksheetId: string
  questionId: string
  file: File
}

export async function uploadStudentWorksheetImage({
  token,
  worksheetId,
  questionId,
  file,
}: UploadStudentWorksheetImageInput) {
  const supabase = await createClient()

  if (!file || file.size === 0) {
    return {
      success: false,
      error: 'File gambar tidak ditemukan.',
    }
  }

  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: 'File harus berupa gambar.',
    }
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'Ukuran gambar maksimal 5 MB.',
    }
  }

  /*
   * Validasi akses student dilakukan melalui RPC
   * yang sama dengan flow worksheet kita.
   */
  const { data: access, error: accessError } =
    await supabase.rpc(
      'get_student_access_by_token',
      {
        access_token: token,
      },
    )

  if (accessError || !access?.[0]) {
    return {
      success: false,
      error: 'Akses student tidak valid atau sudah kedaluwarsa.',
    }
  }

  const studentAccessId = access[0].id
  const organizationId = access[0].organization_id

  /*
   * Pastikan worksheet memang dimiliki student.
   */
  const { data: assignment, error: assignmentError } =
    await supabase
      .from('student_worksheets')
      .select(`
        id,
        worksheet:worksheets!inner(
          id,
          organization_id,
          status
        )
      `)
      .eq('student_access_id', studentAccessId)
      .eq('worksheet_id', worksheetId)
      .maybeSingle()

  if (
    assignmentError ||
    !assignment ||
    !assignment.worksheet
  ) {
    return {
      success: false,
      error: 'Worksheet tidak ditemukan atau tidak ditugaskan.',
    }
  }

  const worksheet = Array.isArray(assignment.worksheet)
    ? assignment.worksheet[0]
    : assignment.worksheet

  if (
    worksheet.organization_id !== organizationId ||
    worksheet.status !== 'published'
  ) {
    return {
      success: false,
      error: 'Worksheet tidak dapat digunakan.',
    }
  }

  /*
   * Pastikan question memang berada di worksheet.
   */
  const { data: worksheetQuestion, error: questionError } =
    await supabase
      .from('worksheet_questions')
      .select(`
        id,
        question:questions!inner(
          id,
          organization_id,
          status
        )
      `)
      .eq('worksheet_id', worksheetId)
      .eq('question_id', questionId)
      .maybeSingle()

  if (
    questionError ||
    !worksheetQuestion ||
    !worksheetQuestion.question
  ) {
    return {
      success: false,
      error: 'Soal tidak ditemukan di worksheet.',
    }
  }

  const question = Array.isArray(
    worksheetQuestion.question,
  )
    ? worksheetQuestion.question[0]
    : worksheetQuestion.question

  if (
    question.organization_id !== organizationId ||
    question.status !== 'published'
  ) {
    return {
      success: false,
      error: 'Soal tidak dapat digunakan.',
    }
  }

  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'jpg'

  const fileName = `${crypto.randomUUID()}.${extension}`

  const filePath =
    `${organizationId}/` +
    `${studentAccessId}/` +
    `${questionId}/` +
    fileName

  const fileBuffer = Buffer.from(
    await file.arrayBuffer(),
  )

  const adminSupabase = createAdminClient()

const { error: uploadError } =
  await adminSupabase.storage
    .from('student-submissions')
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return {
      success: false,
      error: uploadError.message,
    }
  }

  return {
    success: true,
    path: filePath,
  }
}