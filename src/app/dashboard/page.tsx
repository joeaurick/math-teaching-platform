import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Plus,
  Sparkles,
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
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <PageHeader
            eyebrow="Teacher Workspace"
            title="Teacher Dashboard"
            description={user.email ?? ''}
          />

          <Card className="mt-8 border-rose-200 bg-rose-50">
            <CardContent className="p-5">
              <p className="text-sm leading-6 text-rose-700">
                Gagal mengambil organization:{' '}
                {error.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
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

        {/* Organizations */}
        <section className="mt-8">
          <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50">
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Your Organizations
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Pilih organization untuk masuk
                    ke workspace.
                  </p>
                </div>
              </div>

              {memberships.length === 0 ? (
                <div className="mt-7 rounded-2xl border border-violet-200 bg-violet-50 px-6 py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                    <Building2 className="h-6 w-6 text-violet-600" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Belum ada organization
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Buat organization terlebih dahulu
                    untuk mulai membuat module dan
                    mengelola siswa.
                  </p>

                  <Link
                    href="/create-organization"
                    className="mt-6 inline-block"
                  >
                    <Button>
                      <Plus className="h-4 w-4" />
                      Buat Organization
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-7 grid gap-4 md:grid-cols-2">
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
                        className="group block"
                      >
                        <Card className="h-full border-slate-200 bg-white transition-all duration-200 group-hover:border-sky-300 group-hover:bg-sky-50/50 group-hover:shadow-md group-hover:shadow-sky-100/60">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex min-w-0 items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                                  <Building2 className="h-5 w-5 text-sky-600" />
                                </div>

                                <div className="min-w-0">
                                  <h3 className="truncate text-base font-semibold text-slate-900">
                                    {organization.name}
                                  </h3>

                                  <p className="mt-1 truncate text-sm text-slate-500">
                                    {organization.slug}
                                  </p>
                                </div>
                              </div>

                              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-sky-600" />
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
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

                              <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-sky-600">
                                Open Workspace
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}