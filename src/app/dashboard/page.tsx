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
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <PageHeader
            eyebrow="Ruang Kerja Guru"
            title="Dasbor Guru"
            description={user.email ?? ''}
          />

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 sm:mt-8 sm:px-5">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />

            <p className="min-w-0 text-sm leading-6 text-rose-700">
              Gagal mengambil organisasi:{' '}
              {error.message}
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Ruang Kerja Guru"
          title="Dasbor Guru"
          description={
            user.email
              ? `Selamat datang kembali, ${user.email}.`
              : 'Kelola organisasi dan ruang kerja pembelajaran Anda.'
          }
          actions={
            <Link
              href="/create-organization"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Buat Organisasi
              </Button>
            </Link>
          }
        />

        <section className="mt-8 sm:mt-10">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Organisasi Anda
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Pilih organisasi untuk masuk ke ruang kerja.
              </p>
            </div>

            {memberships.length > 0 && (
              <span className="text-xs font-medium text-slate-400 sm:shrink-0">
                {memberships.length}{' '}
                {memberships.length === 1
                  ? 'organisasi'
                  : 'organisasi'}
              </span>
            )}
          </div>

          {memberships.length === 0 ? (
            <Card className="mt-5 border-slate-200 bg-white shadow-sm shadow-slate-200/50 sm:mt-6">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center !p-6 text-center sm:min-h-[300px] sm:!p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Building2 className="h-6 w-6 text-slate-500" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  Belum ada organisasi
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Buat organisasi terlebih dahulu untuk mulai
                  membuat modul dan mengelola siswa.
                </p>

                <Link
                  href="/create-organization"
                  className="mt-6 w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Buat Organisasi
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-1 divide-y divide-slate-200">
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
                    className="group flex min-w-0 items-center gap-3 py-4 transition-colors first:pt-5 hover:bg-slate-50 sm:gap-4 sm:py-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-colors duration-200 group-hover:bg-sky-100">
                      <Building2 className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-sky-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900">
                          {organization.name}
                        </h3>

                        <Badge
                          variant={
                            membership.role ===
                            'owner'
                              ? 'info'
                              : 'muted'
                          }
                          className="shrink-0 capitalize"
                        >
                          {membership.role === 'owner'
                            ? 'Pemilik'
                            : membership.role}
                        </Badge>
                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {organization.slug}
                      </p>
                    </div>

                    <div className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-slate-400 transition-colors duration-200 group-hover:text-sky-600 sm:gap-2 sm:px-2">
                      <span className="hidden sm:block">
                        Buka Ruang Kerja
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