'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { createStudentAccess } from '@/lib/student/create-student-access'

export async function generateStudentLink(
  organizationId: string,
  studentName: string,
) {
  try {
    const access = await createStudentAccess(
      organizationId,
      studentName,
    )

    return {
      success: true,
      token: access.token,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal membuat student link.',
    }
  }
}

export async function toggleStudentAccess(
  organizationId: string,
  studentAccessId: string,
  isActive: boolean,
) {
  try {
    const supabase = await createClient()

    const {
      data: studentAccess,
      error: findError,
    } = await supabase
      .from('student_access')
      .select('id')
      .eq('id', studentAccessId)
      .eq('organization_id', organizationId)
      .maybeSingle()

    if (findError) {
      return {
        success: false,
        error:
          `Gagal memeriksa student access: ${findError.message}`,
      }
    }

    if (!studentAccess) {
      return {
        success: false,
        error: 'Student access tidak ditemukan.',
      }
    }

    const {
      error: updateError,
    } = await supabase
      .from('student_access')
      .update({
        is_active: isActive,
      })
      .eq('id', studentAccessId)
      .eq('organization_id', organizationId)

    if (updateError) {
      return {
        success: false,
        error:
          `Gagal mengubah status student: ${updateError.message}`,
      }
    }

    revalidatePath(
      '/[organization]/classes/student-access',
      'page',
    )

    return {
      success: true,
      isActive,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal mengubah status student.',
    }
  }
}

export async function deleteStudentAccess(
  organizationId: string,
  studentAccessId: string,
) {
  try {
    const supabase = await createClient()

    const {
      data: studentAccess,
      error: findError,
    } = await supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active
      `)
      .eq('id', studentAccessId)
      .eq('organization_id', organizationId)
      .maybeSingle()

    if (findError) {
      return {
        success: false,
        error:
          `Gagal memeriksa student access: ${findError.message}`,
      }
    }

    if (!studentAccess) {
      return {
        success: false,
        error: 'Student access tidak ditemukan.',
      }
    }

    if (studentAccess.is_active) {
      return {
        success: false,
        error:
          'Student yang masih aktif tidak dapat dihapus.',
      }
    }

    const {
      error: deleteError,
    } = await supabase
      .from('student_access')
      .delete()
      .eq('id', studentAccessId)
      .eq('organization_id', organizationId)
      .eq('is_active', false)

    if (deleteError) {
      return {
        success: false,
        error:
          `Gagal menghapus student access: ${deleteError.message}`,
      }
    }

    revalidatePath(
      '/[organization]/classes/student-access',
      'page',
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
          : 'Gagal menghapus student access.',
    }
  }
}