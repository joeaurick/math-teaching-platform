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

export async function createQuestion(
  organizationSlug: string,
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
      .insert({
        organization_id: organization.id,
        module_id: module.id,
        title,
        question_type: questionType,
        content,
        explanation: explanation || null,
        status: 'draft',
        created_by: user.id,
      })
      .select('id')
      .single()

  if (questionError) {
    return {
      success: false,
      error: questionError.message,
    }
  }

  /*
   * Multiple Choice
   */
  if (questionType === 'multiple_choice') {
    const options = [0, 1, 2, 3].map((index) => ({
      question_id: question.id,
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
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

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
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error:
          'Pilih tepat satu jawaban yang benar.',
      }
    }

    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(options)

    if (optionsError) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: optionsError.message,
      }
    }
  }

  /*
   * True / False
   */
  if (questionType === 'true_false') {
    const correctAnswer = String(
      formData.get('true_false_answer') ?? '',
    ).trim()

    if (
      correctAnswer !== 'true' &&
      correctAnswer !== 'false'
    ) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: 'Pilih jawaban True atau False.',
      }
    }

    const options = [
      {
        question_id: question.id,
        option_text: 'True',
        is_correct: correctAnswer === 'true',
        sort_order: 0,
      },
      {
        question_id: question.id,
        option_text: 'False',
        is_correct: correctAnswer === 'false',
        sort_order: 1,
      },
    ]

    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(options)

    if (optionsError) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: optionsError.message,
      }
    }
  }

  /*
   * Short Answer
   */
  if (questionType === 'short_answer') {
    const answer = String(
      formData.get('short_answer') ?? '',
    ).trim()

    if (!answer) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: 'Jawaban yang diharapkan wajib diisi.',
      }
    }

    const { error: answerError } = await supabase
      .from('question_options')
      .insert({
        question_id: question.id,
        option_text: answer,
        is_correct: true,
        sort_order: 0,
      })

    if (answerError) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: answerError.message,
      }
    }
  }

  /*
   * Numeric
   */
  if (questionType === 'numeric') {
    const answer = String(
      formData.get('numeric_answer') ?? '',
    ).trim()

    if (!answer) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: 'Jawaban numeric wajib diisi.',
      }
    }

    if (!Number.isFinite(Number(answer))) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: 'Jawaban numeric harus berupa angka.',
      }
    }

    const { error: answerError } = await supabase
      .from('question_options')
      .insert({
        question_id: question.id,
        option_text: answer,
        is_correct: true,
        sort_order: 0,
      })

    if (answerError) {
      await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      return {
        success: false,
        error: answerError.message,
      }
    }
  }

  /*
   * Essay
   *
   * Essay tidak membutuhkan jawaban otomatis.
   * Guru akan melakukan penilaian manual.
   */

  redirect(`/${organization.slug}/questions`)
}