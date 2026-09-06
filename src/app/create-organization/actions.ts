'use server'

import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createOrganization(name: string) {
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

  const organizationName = name.trim()

  if (!organizationName) {
    return {
      success: false,
      error: 'Nama organization wajib diisi.',
    }
  }

  const slug = createSlug(organizationName)

  if (!slug) {
    return {
      success: false,
      error: 'Nama organization tidak valid.',
    }
  }

  const organizationId = randomUUID()

  const { error: organizationError } = await supabase
    .from('organizations')
    .insert({
      id: organizationId,
      name: organizationName,
      slug,
      created_by: user.id,
    })

  if (organizationError) {
    return {
      success: false,
      error: organizationError.message,
    }
  }

  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: organizationId,
      user_id: user.id,
      role: 'owner',
    })

  if (memberError) {
    await supabase
      .from('organizations')
      .delete()
      .eq('id', organizationId)

    return {
      success: false,
      error: memberError.message,
    }
  }

  return {
    success: true,
  }
}