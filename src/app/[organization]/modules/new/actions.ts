'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function createModule(
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

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()

  if (!title) {
    return {
      success: false,
      error: 'Module title wajib diisi.',
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

  const { error: moduleError } = await supabase
    .from('modules')
    .insert({
      organization_id: organization.id,
      title,
      description: description || null,
      status: 'draft',
      created_by: user.id,
    })

  if (moduleError) {
    return {
      success: false,
      error: moduleError.message,
    }
  }

  redirect(`/${organization.slug}/modules`)
}