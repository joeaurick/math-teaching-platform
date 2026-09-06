'use server'

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