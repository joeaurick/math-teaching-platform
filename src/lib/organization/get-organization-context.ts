import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export const getOrganizationContext = cache(
  async (slug: string) => {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    const {
      data: membership,
      error,
    } = await supabase
      .from('organization_members')
      .select(`
        role,
        organization:organizations!inner (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', user.id)
      .eq('organization.slug', slug)
      .maybeSingle()

    if (error) {
      throw new Error(
        `Gagal mengambil organization: ${error.message}`,
      )
    }

    if (!membership) {
      notFound()
    }

    const organization = Array.isArray(
      membership.organization,
    )
      ? membership.organization[0]
      : membership.organization

    if (!organization) {
      notFound()
    }

    return {
      supabase,
      user,
      organization,
      membership: {
        role: membership.role,
      },
    }
  },
)