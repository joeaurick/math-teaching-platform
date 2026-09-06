import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: memberships, error } = await supabase
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

  if (error) {
    return (
      <main className="min-h-screen bg-[#090909] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
            <p className="text-sm text-red-300">
              Gagal mengambil organization: {error.message}
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="text-sm text-white/40">
            Teacher Workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Teacher Dashboard
          </h1>

          <p className="mt-2 text-sm text-white/40">
            {user.email}
          </p>
        </div>

        {/* Organizations */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Your Organizations
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Pilih organization untuk masuk ke workspace.
              </p>
            </div>

            <Link
              href="/create-organization"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Buat Organization
            </Link>
          </div>

          {memberships.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                <Building2 className="h-5 w-5 text-white/50" />
              </div>

              <h3 className="mt-4 text-base font-semibold">
                Belum ada organization
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
                Buat organization terlebih dahulu untuk mulai
                membuat module dan mengelola siswa.
              </p>

              <Link
                href="/create-organization"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Buat Organization
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {memberships.map((membership) => {
                const organization = Array.isArray(
                  membership.organizations,
                )
                  ? membership.organizations[0]
                  : membership.organizations

                if (!organization) {
                  return null
                }

                return (
                  <Link
                    key={membership.organization_id}
                    href={`/${organization.slug}`}
                    className="group block"
                  >
                    <div className="rounded-2xl border border-white/[0.10] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.20] hover:bg-white/[0.04]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                            <Building2 className="h-5 w-5 text-white/60" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold">
                              {organization.name}
                            </h3>

                            <p className="mt-1 text-sm text-white/40">
                              {organization.slug}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/70" />
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                        <span className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-xs font-medium capitalize text-white/70">
                          {membership.role}
                        </span>

                        <span className="text-xs text-white/35">
                          Open Workspace
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}