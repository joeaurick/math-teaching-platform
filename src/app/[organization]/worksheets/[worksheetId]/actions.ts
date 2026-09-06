'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

async function getWorksheetContext(
  organizationSlug: string,
  worksheetId: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false as const,
      error: 'Anda harus login.',
      supabase,
    }
  }

  const { data: organization, error: organizationError } =
    await supabase
      .from('organizations')
      .select('id, slug')
      .eq('slug', organizationSlug)
      .maybeSingle()

  if (organizationError) {
    return {
      success: false as const,
      error: organizationError.message,
      supabase,
    }
  }

  if (!organization) {
    return {
      success: false as const,
      error: 'Organization tidak ditemukan.',
      supabase,
    }
  }

  const { data: membership, error: membershipError } =
    await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organization.id)
      .eq('user_id', user.id)
      .maybeSingle()

  if (membershipError) {
    return {
      success: false as const,
      error: membershipError.message,
      supabase,
    }
  }

  if (!membership) {
    return {
      success: false as const,
      error: 'Anda bukan anggota organization ini.',
      supabase,
    }
  }

  const { data: worksheet, error: worksheetError } =
  await supabase
    .from('worksheets')
    .select('id, organization_id, created_by, status')
      .eq('id', worksheetId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (worksheetError) {
    return {
      success: false as const,
      error: worksheetError.message,
      supabase,
    }
  }

  if (!worksheet) {
    return {
      success: false as const,
      error: 'Worksheet tidak ditemukan.',
      supabase,
    }
  }

  return {
    success: true as const,
    supabase,
    user,
    organization,
    worksheet,
  }
}

export async function removeQuestionFromWorksheet(input: {
  organizationSlug: string
  worksheetId: string
  worksheetQuestionId: string
}) {
  const {
    organizationSlug,
    worksheetId,
    worksheetQuestionId,
  } = input

  const context = await getWorksheetContext(
    organizationSlug,
    worksheetId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    worksheet,
  } = context

  if (worksheet.created_by !== context.user.id) {
    return {
      success: false,
      error: 'Anda tidak memiliki izin untuk mengubah worksheet ini.',
    }
  }

  const { data: worksheetQuestion, error: questionError } =
    await supabase
      .from('worksheet_questions')
      .select('id, worksheet_id, sort_order')
      .eq('id', worksheetQuestionId)
      .eq('worksheet_id', worksheetId)
      .maybeSingle()

  if (questionError) {
    return {
      success: false,
      error: questionError.message,
    }
  }

  if (!worksheetQuestion) {
    return {
      success: false,
      error: 'Soal tidak ditemukan di worksheet ini.',
    }
  }

  const { error: deleteError } = await supabase
    .from('worksheet_questions')
    .delete()
    .eq('id', worksheetQuestionId)
    .eq('worksheet_id', worksheetId)

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message,
    }
  }

  const { data: remainingQuestions, error: remainingError } =
    await supabase
      .from('worksheet_questions')
      .select('id, sort_order')
      .eq('worksheet_id', worksheetId)
      .order('sort_order', { ascending: true })

  if (remainingError) {
    return {
      success: false,
      error: remainingError.message,
    }
  }

  for (let index = 0; index < remainingQuestions.length; index += 1) {
    const question = remainingQuestions[index]

    if (question.sort_order !== index) {
      const { error: updateError } = await supabase
        .from('worksheet_questions')
        .update({
          sort_order: index,
        })
        .eq('id', question.id)

      if (updateError) {
        return {
          success: false,
          error: updateError.message,
        }
      }
    }
  }

  revalidatePath(
    `/${organizationSlug}/worksheets/${worksheetId}`,
  )

  revalidatePath(
    `/${organizationSlug}/worksheets/${worksheetId}/questions`,
  )

  revalidatePath(`/${organizationSlug}/worksheets`)

  return {
    success: true,
  }
}

export async function moveWorksheetQuestion(input: {
  organizationSlug: string
  worksheetId: string
  worksheetQuestionId: string
  direction: 'up' | 'down'
}) {
  const {
    organizationSlug,
    worksheetId,
    worksheetQuestionId,
    direction,
  } = input

  const context = await getWorksheetContext(
    organizationSlug,
    worksheetId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    worksheet,
  } = context

  if (worksheet.created_by !== context.user.id) {
    return {
      success: false,
      error: 'Anda tidak memiliki izin untuk mengubah worksheet ini.',
    }
  }

  const { data: questions, error: questionsError } =
    await supabase
      .from('worksheet_questions')
      .select('id, sort_order')
      .eq('worksheet_id', worksheetId)
      .order('sort_order', { ascending: true })

  if (questionsError) {
    return {
      success: false,
      error: questionsError.message,
    }
  }

  const currentIndex = questions.findIndex(
    (question) => question.id === worksheetQuestionId,
  )

  if (currentIndex === -1) {
    return {
      success: false,
      error: 'Soal tidak ditemukan di worksheet ini.',
    }
  }

  const targetIndex =
    direction === 'up'
      ? currentIndex - 1
      : currentIndex + 1

  if (
    targetIndex < 0 ||
    targetIndex >= questions.length
  ) {
    return {
      success: true,
    }
  }

  const currentQuestion = questions[currentIndex]
  const targetQuestion = questions[targetIndex]

  const currentSortOrder = currentQuestion.sort_order
  const targetSortOrder = targetQuestion.sort_order

  const { error: currentError } = await supabase
    .from('worksheet_questions')
    .update({
      sort_order: targetSortOrder,
    })
    .eq('id', currentQuestion.id)

  if (currentError) {
    return {
      success: false,
      error: currentError.message,
    }
  }

  const { error: targetError } = await supabase
    .from('worksheet_questions')
    .update({
      sort_order: currentSortOrder,
    })
    .eq('id', targetQuestion.id)

  if (targetError) {
    return {
      success: false,
      error: targetError.message,
    }
  }

  revalidatePath(
    `/${organizationSlug}/worksheets/${worksheetId}`,
  )

  return {
    success: true,
  }
}

export async function toggleWorksheetPublish(input: {
  organizationSlug: string
  worksheetId: string
  status: 'published' | 'draft'
}) {
  const {
    organizationSlug,
    worksheetId,
    status,
  } = input

  const context = await getWorksheetContext(
    organizationSlug,
    worksheetId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    worksheet,
    user,
  } = context

  if (worksheet.created_by !== user.id) {
    return {
      success: false,
      error: 'Anda tidak memiliki izin untuk mengubah worksheet ini.',
    }
  }

  const { count, error: countError } = await supabase
    .from('worksheet_questions')
    .select('id', {
      count: 'exact',
      head: true,
    })
    .eq('worksheet_id', worksheetId)

  if (countError) {
    return {
      success: false,
      error: countError.message,
    }
  }

  if (status === 'published' && (!count || count === 0)) {
    return {
      success: false,
      error: 'Worksheet harus memiliki minimal satu soal sebelum dipublish.',
    }
  }

  const { error: updateError } = await supabase
    .from('worksheets')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', worksheetId)
    .eq('organization_id', worksheet.organization_id)

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    }
  }

  revalidatePath(
    `/${organizationSlug}/worksheets/${worksheetId}`,
  )

  revalidatePath(
    `/${organizationSlug}/worksheets`,
  )

  return {
    success: true,
    status,
  }
}

export async function updateWorksheetStudentAssignments(input: {
  organizationSlug: string
  worksheetId: string
  studentAccessIds: string[]
}) {
  const {
    organizationSlug,
    worksheetId,
    studentAccessIds,
  } = input

  const context = await getWorksheetContext(
    organizationSlug,
    worksheetId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    worksheet,
    user,
  } = context

  if (worksheet.created_by !== user.id) {
    return {
      success: false,
      error:
        'Anda tidak memiliki izin untuk mengubah worksheet ini.',
    }
  }

  if (worksheet.status !== 'published') {
    return {
      success: false,
      error:
        'Worksheet harus dipublish sebelum diberikan kepada student.',
    }
  }

  const uniqueStudentAccessIds = [
    ...new Set(studentAccessIds),
  ]

  // ------------------------------------------------------------
  // Validasi semua student access berada di organization yang sama
  // ------------------------------------------------------------

  if (uniqueStudentAccessIds.length > 0) {
    const {
      data: studentAccesses,
      error: studentAccessError,
    } = await supabase
      .from('student_access')
      .select('id')
      .eq('organization_id', worksheet.organization_id)
      .in('id', uniqueStudentAccessIds)

    if (studentAccessError) {
      return {
        success: false,
        error: studentAccessError.message,
      }
    }

    if (
      (studentAccesses?.length ?? 0) !==
      uniqueStudentAccessIds.length
    ) {
      return {
        success: false,
        error:
          'Terdapat student access yang tidak valid.',
      }
    }
  }

  // ------------------------------------------------------------
  // Hapus assignment lama
  // ------------------------------------------------------------

  const { error: deleteError } = await supabase
    .from('student_worksheets')
    .delete()
    .eq('worksheet_id', worksheetId)

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message,
    }
  }

  // ------------------------------------------------------------
  // Buat assignment baru
  // ------------------------------------------------------------

  if (uniqueStudentAccessIds.length > 0) {
    const assignments = uniqueStudentAccessIds.map(
      (studentAccessId) => ({
        student_access_id: studentAccessId,
        worksheet_id: worksheetId,
      }),
    )

    const { error: insertError } = await supabase
      .from('student_worksheets')
      .insert(assignments)

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      }
    }
  }

  revalidatePath(
    `/${organizationSlug}/worksheets/${worksheetId}`,
  )

  revalidatePath(
    `/${organizationSlug}/worksheets`,
  )

  return {
    success: true,
  }
}