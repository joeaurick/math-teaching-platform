'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

async function getAuthorizedOrganization(
  organizationSlug: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      supabase,
      user: null,
      organization: null,
      error: 'Anda harus login.',
    }
  }

  const {
    data: organization,
    error: organizationError,
  } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', organizationSlug)
    .maybeSingle()

  if (organizationError) {
    return {
      supabase,
      user,
      organization: null,
      error: organizationError.message,
    }
  }

  if (!organization) {
    return {
      supabase,
      user,
      organization: null,
      error: 'Organization tidak ditemukan.',
    }
  }

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
      supabase,
      user,
      organization,
      error: membershipError.message,
    }
  }

  if (!membership) {
    return {
      supabase,
      user,
      organization,
      error: 'Anda bukan anggota organization ini.',
    }
  }

  return {
    supabase,
    user,
    organization,
    error: null,
  }
}

export async function updateModuleStatus(
  organizationSlug: string,
  moduleId: string,
  status: 'published' | 'draft',
) {
  const {
    supabase,
    organization,
    error,
  } = await getAuthorizedOrganization(
    organizationSlug,
  )

  if (error || !organization) {
    return {
      success: false,
      error:
        error ?? 'Organization tidak ditemukan.',
    }
  }

  const {
    data: module,
    error: moduleError,
  } = await supabase
    .from('modules')
    .select('id, status')
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

  const { error: updateError } =
    await supabase
      .from('modules')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', moduleId)
      .eq(
        'organization_id',
        organization.id,
      )

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    }
  }

  revalidatePath(
    `/${organization.slug}/modules`,
  )

  revalidatePath(
    `/${organization.slug}/modules/${moduleId}`,
  )

  revalidatePath(
    `/${organization.slug}/modules/${moduleId}/students`,
  )

  return {
    success: true,
  }
}

export async function deleteModule(
  organizationSlug: string,
  moduleId: string,
) {
  const {
    supabase,
    organization,
    error,
  } = await getAuthorizedOrganization(
    organizationSlug,
  )

  if (error || !organization) {
    return {
      success: false,
      error:
        error ?? 'Organization tidak ditemukan.',
    }
  }

  const {
    data: module,
    error: moduleError,
  } = await supabase
    .from('modules')
    .select('id, title')
    .eq('id', moduleId)
    .eq(
      'organization_id',
      organization.id,
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

  /*
   * Lepaskan assignment siswa terlebih dahulu.
   *
   * Ini tidak menghapus student access.
   * Hanya menghapus hubungan antara siswa
   * dengan module yang akan dihapus.
   */
  const {
    error: assignmentError,
  } = await supabase
    .from('student_modules')
    .delete()
    .eq('module_id', moduleId)

  if (assignmentError) {
    return {
      success: false,
      error:
        `Assignment siswa tidak dapat dilepas: ${assignmentError.message}`,
    }
  }

  /*
   * Hapus module.
   *
   * Jika masih ada foreign key/data terkait yang
   * mencegah penghapusan, database akan menolak
   * operasi ini dan kita tidak akan menghapus data
   * lain secara paksa.
   */
  const {
    error: deleteError,
  } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId)
    .eq(
      'organization_id',
      organization.id,
    )

  if (deleteError) {
    return {
      success: false,
      error:
        'Module tidak dapat dihapus karena masih memiliki data yang terkait. Hapus atau lepaskan data terkait terlebih dahulu.',
    }
  }

  revalidatePath(
    `/${organization.slug}/modules`,
  )

  revalidatePath(
    `/${organization.slug}/classes/student-access`,
  )

  return {
    success: true,
  }
}