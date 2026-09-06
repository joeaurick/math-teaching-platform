import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function getModules(organizationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('modules')
    .select(`
      id,
      organization_id,
      title,
      description,
      status,
      created_by,
      created_at,
      updated_at
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(
      `Gagal mengambil modules: ${error.message}`
    )
  }

  return data
}