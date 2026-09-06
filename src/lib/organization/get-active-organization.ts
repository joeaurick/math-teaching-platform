import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getActiveOrganization() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: membership, error } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      role,
      organizations (
        id,
        name,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Gagal mengambil organization: ${error.message}`
    )
  }

  if (!membership) {
    redirect('/create-organization')
  }

  const organization = Array.isArray(membership.organizations)
    ? membership.organizations[0]
    : membership.organizations

  if (!organization) {
    throw new Error('Organization tidak ditemukan.')
  }

  return {
    user,
    organization,
    role: membership.role,
  }
}