import { randomBytes } from 'crypto'

import { createClient } from '@/lib/supabase/server'

function generateStudentToken() {
  return randomBytes(32).toString('hex')
}

export async function createStudentAccess(
  organizationId: string,
  studentName?: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Anda harus login.')
  }

  const { data: membership, error: membershipError } =
    await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .maybeSingle()

  if (membershipError) {
    throw new Error(
      `Gagal memeriksa membership: ${membershipError.message}`,
    )
  }

  if (!membership) {
    throw new Error('Anda bukan anggota organization ini.')
  }

  const token = generateStudentToken()

  const { data, error } = await supabase
    .from('student_access')
    .insert({
      organization_id: organizationId,
      token,
      student_name: studentName?.trim() || null,
    })
    .select('id, token, student_name, is_active, expires_at')
    .single()

  if (error) {
    throw new Error(
      `Gagal membuat student access: ${error.message}`,
    )
  }

  return data
}