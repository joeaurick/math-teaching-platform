'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult = {
  success: boolean
  message: string
}

async function getQuestionContext(
  organizationSlug: string,
  questionId: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: organization, error: organizationError } =
    await supabase
      .from('organizations')
      .select('id, slug')
      .eq('slug', organizationSlug)
      .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    return {
      success: false as const,
      message: 'Organization tidak ditemukan.',
    }
  }

  const { data: membership, error: membershipError } =
    await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organization.id)
      .eq('user_id', user.id)
      .maybeSingle()

  if (membershipError) {
    throw new Error(
      `Gagal memeriksa membership: ${membershipError.message}`,
    )
  }

  if (!membership) {
    return {
      success: false as const,
      message: 'Anda tidak memiliki akses ke organization ini.',
    }
  }

  const { data: question, error: questionError } =
    await supabase
      .from('questions')
      .select(
        'id, title, created_by, status, deleted_at',
      )
      .eq('id', questionId)
      .eq('organization_id', organization.id)
      .maybeSingle()

  if (questionError) {
    throw new Error(
      `Gagal mengambil question: ${questionError.message}`,
    )
  }

  if (!question) {
    return {
      success: false as const,
      message: 'Soal tidak ditemukan.',
    }
  }

  if (question.created_by !== user.id) {
    return {
      success: false as const,
      message:
        'Anda tidak memiliki izin untuk mengubah soal ini.',
    }
  }

  return {
    success: true as const,
    supabase,
    organization,
    question,
  }
}

export async function deleteQuestion(
  organizationSlug: string,
  questionId: string,
): Promise<ActionResult> {
  const context = await getQuestionContext(
    organizationSlug,
    questionId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    organization,
    question,
  } = context

  if (question.deleted_at) {
    return {
      success: false,
      message: 'Soal sudah dihapus.',
    }
  }

  const { error: deleteError } = await supabase
    .from('questions')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', question.id)
    .eq('organization_id', organization.id)
    .is('deleted_at', null)

  if (deleteError) {
    throw new Error(
      `Gagal menghapus soal: ${deleteError.message}`,
    )
  }

  return {
    success: true,
    message: 'Soal berhasil dihapus.',
  }
}

export async function archiveQuestion(
  organizationSlug: string,
  questionId: string,
): Promise<ActionResult> {
  const context = await getQuestionContext(
    organizationSlug,
    questionId,
  )

  if (!context.success) {
    return context
  }

  const {
    supabase,
    organization,
    question,
  } = context

  if (question.deleted_at) {
    return {
      success: false,
      message: 'Soal sudah dihapus.',
    }
  }

  if (question.status === 'archived') {
    return {
      success: false,
      message: 'Soal sudah diarsipkan.',
    }
  }

  const { error: updateError } = await supabase
    .from('questions')
    .update({
      status: 'archived',
    })
    .eq('id', question.id)
    .eq('organization_id', organization.id)

  if (updateError) {
    throw new Error(
      `Gagal mengarsipkan soal: ${updateError.message}`,
    )
  }

  return {
    success: true,
    message: 'Soal berhasil diarsipkan.',
  }
}