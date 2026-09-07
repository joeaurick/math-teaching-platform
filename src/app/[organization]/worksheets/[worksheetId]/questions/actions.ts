'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

type AddQuestionsInput = {
  organizationSlug: string
  worksheetId: string
  questionIds: string[]
}

export async function addQuestionsToWorksheet(
  input: AddQuestionsInput,
) {
  const supabase = await createClient()

  try {
    const {
      organizationSlug,
      worksheetId,
      questionIds,
    } = input

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Anda harus login.',
      }
    }

    if (
      !organizationSlug ||
      !worksheetId ||
      questionIds.length === 0
    ) {
      return {
        success: false,
        error: 'Data question tidak lengkap.',
      }
    }

    // ----------------------------------------------------------
    // Organization
    // ----------------------------------------------------------

    const {
      data: organization,
      error: organizationError,
    } = await supabase
      .from('organizations')
      .select('id, slug')
      .eq('slug', organizationSlug)
      .maybeSingle()

    if (organizationError) {
      return {
        success: false,
        error: organizationError.message,
      }
    }

    if (!organization) {
      return {
        success: false,
        error: 'Organization tidak ditemukan.',
      }
    }

    // ----------------------------------------------------------
    // Membership
    // ----------------------------------------------------------

    const {
      data: membership,
      error: membershipError,
    } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organization.id)
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
        error: 'Anda bukan anggota organization ini.',
      }
    }

    // ----------------------------------------------------------
    // Worksheet
    // ----------------------------------------------------------

    const {
      data: worksheet,
      error: worksheetError,
    } = await supabase
      .from('worksheets')
      .select('id')
      .eq('id', worksheetId)
      .eq('organization_id', organization.id)
      .maybeSingle()

    if (worksheetError) {
      return {
        success: false,
        error: worksheetError.message,
      }
    }

    if (!worksheet) {
      return {
        success: false,
        error: 'Worksheet tidak ditemukan.',
      }
    }

    // ----------------------------------------------------------
    // Questions
    // ----------------------------------------------------------

    const {
      data: questions,
      error: questionsError,
    } = await supabase
      .from('questions')
      .select('id')
      .eq('organization_id', organization.id)
      .is('deleted_at', null)
      .in('id', questionIds)

    if (questionsError) {
      return {
        success: false,
        error: questionsError.message,
      }
    }

    if (
      !questions ||
      questions.length !== questionIds.length
    ) {
      return {
        success: false,
        error:
          'Satu atau lebih question tidak ditemukan.',
      }
    }

    // ----------------------------------------------------------
    // Existing questions
    // ----------------------------------------------------------

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from('worksheet_questions')
      .select('question_id')
      .eq('worksheet_id', worksheetId)

    if (existingError) {
      return {
        success: false,
        error: existingError.message,
      }
    }

    const existingIds = new Set(
      (existing ?? []).map(
        (item) => item.question_id,
      ),
    )

    const newQuestionIds = questionIds.filter(
      (id) => !existingIds.has(id),
    )

    if (newQuestionIds.length === 0) {
      return {
        success: false,
        error: 'Semua question sudah ada di worksheet.',
      }
    }

    // ----------------------------------------------------------
    // Sort order
    // ----------------------------------------------------------

    const {
      count,
      error: countError,
    } = await supabase
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

    const startOrder = count ?? 0

    const rows = newQuestionIds.map(
      (questionId, index) => ({
        worksheet_id: worksheetId,
        question_id: questionId,
        sort_order: startOrder + index,
      }),
    )

    const { error: insertError } =
      await supabase
        .from('worksheet_questions')
        .insert(rows)

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      }
    }

    revalidatePath(
      `/${organizationSlug}/worksheets/${worksheetId}`,
    )

    revalidatePath(
      `/${organizationSlug}/worksheets/${worksheetId}/questions`,
    )

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal menambahkan questions.',
    }
  }
}