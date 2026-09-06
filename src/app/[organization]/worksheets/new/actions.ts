'use server'

import { createClient } from '@/lib/supabase/server'

type CreateWorksheetInput = {
  organizationSlug: string
  title: string
  description: string
}

export async function createWorksheet(
  input: CreateWorksheetInput,
) {
  const supabase = await createClient()

  const {
    organizationSlug,
    title,
    description,
  } = input

  try {
    // ----------------------------------------------------------
    // 1. User
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // 2. Validate title
    // ----------------------------------------------------------

    const worksheetTitle = title.trim()

    if (!worksheetTitle) {
      return {
        success: false,
        error: 'Judul worksheet wajib diisi.',
      }
    }

    // ----------------------------------------------------------
    // 3. Organization
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
    // 4. Membership
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
    // 5. Create worksheet
    // ----------------------------------------------------------

    const {
      data: worksheet,
      error: worksheetError,
    } = await supabase
      .from('worksheets')
      .insert({
        organization_id: organization.id,
        title: worksheetTitle,
        description:
          description.trim() || null,
        status: 'draft',
        created_by: user.id,
      })
      .select('id')
      .single()

    if (worksheetError) {
      return {
        success: false,
        error: worksheetError.message,
      }
    }

    return {
      success: true,
      worksheetId: worksheet.id,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal membuat worksheet.',
    }
  }
}