import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Plus,
} from 'lucide-react'
import { redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: memberships,
    error,
  } = await supabase
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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <PageHeader
            eyebrow="Teacher Workspace"
            title="Teacher Dashboard"
            description={user.email ?? ''}
          />

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />

            <p className="text-sm leading-6 text-rose-700">
              Gagal mengambil organization:{' '}
              {error.message}
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teacher Workspace"
          title="Teacher Dashboard"
          description={
            user.email
              ? `Selamat datang kembali, ${user.email}.`
              : 'Kelola organization dan workspace pembelajaran Anda.'
          }
          actions={
            <Link href="/create-organization">
              <Button>
                <Plus className="h-4 w-4" />
                Buat Organization
              </Button>
            </Link>
          }
        />

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Your Organizations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pilih organization untuk masuk ke workspace.
              </p>
            </div>

            {memberships.length > 0 && (
              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                {memberships.length}{' '}
                {memberships.length === 1
                  ? 'organization'
                  : 'organizations'}
              </span>
            )}
          </div>

          {memberships.length === 0 ? (
            <Card className="mt-6 border-slate-200 bg-white shadow-sm shadow-slate-200/50">
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center !p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Building2 className="h-6 w-6 text-slate-500" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  Belum ada organization
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Buat organization terlebih dahulu untuk mulai
                  membuat module dan mengelola siswa.
                </p>

                <Link
                  href="/create-organization"
                  className="mt-6"
                >
                  <Button>
                    <Plus className="h-4 w-4" />
                    Buat Organization
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-2 divide-y divide-slate-200">
              {memberships.map((membership) => {
                const organization =
                  Array.isArray(
                    membership.organizations,
                  )
                    ? membership.organizations[0]
                    : membership.organizations

                if (!organization) {
                  return null
                }

                return (
                  <Link
                    key={
                      membership.organization_id
                    }
                    href={`/${organization.slug}`}
                    className="group flex items-center gap-4 py-5 transition-colors first:pt-5 hover:bg-slate-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-colors duration-200 group-hover:bg-sky-100">
                      <Building2 className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-sky-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {organization.name}
                        </h3>

                        <Badge
                          variant={
                            membership.role ===
                            'owner'
                              ? 'info'
                              : 'muted'
                          }
                          className="capitalize"
                        >
                          {membership.role}
                        </Badge>
                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {organization.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 group-hover:text-sky-600">
                      <span className="hidden sm:block">
                        Open Workspace
                      </span>

                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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