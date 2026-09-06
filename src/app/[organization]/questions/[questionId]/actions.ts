'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

const allowedTypes = [
  'multiple_choice',
  'true_false',
  'short_answer',
  'numeric',
  'essay',
]

const allowedStatuses = [
  'draft',
  'published',
  'archived',
]

export async function updateQuestion(
  organizationSlug: string,
  questionId: string,
  formData: FormData,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const moduleId = String(
    formData.get('module_id') ?? '',
  ).trim()

  const title = String(
    formData.get('title') ?? '',
  ).trim()

  const questionType = String(
    formData.get('question_type') ?? '',
  ).trim()

  const content = String(
    formData.get('content') ?? '',
  ).trim()

  const explanation = String(
    formData.get('explanation') ?? '',
  ).trim()

  const status = String(
    formData.get('status') ?? '',
  ).trim()

  if (!moduleId) {
    return {
      success: false,
      error: 'Module wajib dipilih.',
    }
  }

  if (!title) {
    return {
      success: false,
      error: 'Question title wajib diisi.',
    }
  }

  if (!content) {
    return {
      success: false,
      error: 'Question content wajib diisi.',
    }
  }

  if (!allowedTypes.includes(questionType)) {
    return {
      success: false,
      error: 'Question type tidak valid.',
    }
  }

  if (!allowedStatuses.includes(status)) {
    return {
      success: false,
      error: 'Status tidak valid.',
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

  const { data: membership, error: membershipError } =
    await supabase
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
      error: 'Anda bukan member organization ini.',
    }
  }

  const { data: module, error: moduleError } =
    await supabase
      .from('modules')
      .select('id')
      .eq('id', moduleId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (moduleError) {
    return {
      success: false,
      error: moduleError.message,
    }
  }

  if (!module) {
    return {
      success: false,
      error: 'Module tidak ditemukan.',
    }
  }

  const { data: question, error: questionError } =
    await supabase
      .from('questions')
      .select('id, created_by')
      .eq('id', questionId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (questionError) {
    return {
      success: false,
      error: questionError.message,
    }
  }

  if (!question) {
    return {
      success: false,
      error: 'Question tidak ditemukan.',
    }
  }

  if (question.created_by !== user.id) {
    return {
      success: false,
      error: 'Anda tidak memiliki akses untuk mengubah question ini.',
    }
  }

  let options:
    | {
        option_text: string
        is_correct: boolean
        sort_order: number
      }[]
    | null = null

  if (questionType === 'multiple_choice') {
    options = [0, 1, 2, 3].map((index) => ({
      option_text: String(
        formData.get(`option_${index}`) ?? '',
      ).trim(),

      is_correct:
        String(formData.get('correct_option') ?? '') ===
        String(index),

      sort_order: index,
    }))

    const invalidOption = options.some(
      (option) => !option.option_text,
    )

    if (invalidOption) {
      return {
        success: false,
        error:
          'Semua pilihan jawaban wajib diisi untuk Multiple Choice.',
      }
    }

    const correctCount = options.filter(
      (option) => option.is_correct,
    ).length

    if (correctCount !== 1) {
      return {
        success: false,
        error:
          'Pilih tepat satu jawaban yang benar.',
      }
    }
  }

  const { error: updateError } = await supabase
    .from('questions')
    .update({
      module_id: module.id,
      title,
      question_type: questionType,
      content,
      explanation: explanation || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', question.id)

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    }
  }

  const { error: deleteOptionsError } = await supabase
    .from('question_options')
    .delete()
    .eq('question_id', question.id)

  if (deleteOptionsError) {
    return {
      success: false,
      error: deleteOptionsError.message,
    }
  }

  if (options) {
    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(
        options.map((option) => ({
          question_id: question.id,
          option_text: option.option_text,
          is_correct: option.is_correct,
          sort_order: option.sort_order,
        })),
      )

    if (optionsError) {
      return {
        success: false,
        error: optionsError.message,
      }
    }
  }

  redirect(
    `/${organization.slug}/questions/${question.id}`,
  )
}