'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function toggleModuleStudent(
  organizationSlug: string,
  organizationId: string,
  moduleId: string,
  studentAccessId: string,
  assign: boolean,
) {
  const supabase = await createClient()

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

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from('organization_members')
    .select('id')
    .eq(
      'organization_id',
      organizationId,
    )
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
      error:
        'Anda bukan anggota organization ini.',
    }
  }

  const {
    data: module,
    error: moduleError,
  } = await supabase
    .from('modules')
    .select('id, status')
    .eq('id', moduleId)
    .eq(
      'organization_id',
      organizationId,
    )
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

  const {
    data: studentAccess,
    error: studentError,
  } = await supabase
    .from('student_access')
    .select('id')
    .eq('id', studentAccessId)
    .eq(
      'organization_id',
      organizationId,
    )
    .maybeSingle()

  if (studentError) {
    return {
      success: false,
      error: studentError.message,
    }
  }

  if (!studentAccess) {
    return {
      success: false,
      error:
        'Student Access tidak ditemukan.',
    }
  }

  if (assign) {
    const { error } =
      await supabase
        .from('student_modules')
        .insert({
          student_access_id:
            studentAccessId,
          module_id: moduleId,
        })

    if (
      error &&
      error.code !== '23505'
    ) {
      return {
        success: false,
        error: error.message,
      }
    }
  } else {
    const { error } =
      await supabase
        .from('student_modules')
        .delete()
        .eq(
          'student_access_id',
          studentAccessId,
        )
        .eq(
          'module_id',
          moduleId,
        )

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  revalidatePath(
    `/${organizationSlug}/modules/${moduleId}/students`,
  )

  revalidatePath(
    `/${organizationSlug}/modules/${moduleId}`,
  )

  revalidatePath(
    `/${organizationSlug}/classes/student-access`,
  )

  return {
    success: true,
  }
}