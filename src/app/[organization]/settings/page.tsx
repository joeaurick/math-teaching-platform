import {
  Building2,
  CheckCircle2,
  Crown,
  Mail,
  Settings2,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type SettingsPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function SettingsPage({
  params,
}: SettingsPageProps) {
  const { organization: slug } = await params

  const {
    organization,
    membership,
    user,
  } = await getOrganizationContext(slug)

  const roleLabel =
    membership.role === 'owner'
      ? 'Pemilik'
      : membership.role === 'admin'
        ? 'Admin'
        : membership.role === 'teacher'
          ? 'Guru'
          : membership.role

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
        {/* Header */}

        <PageHeader
          eyebrow="Sistem"
          title="Pengaturan"
          description="Kelola informasi organisasi dan akun Anda."
        />

        {/* Banner */}

        <section className="relative mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-indigo-50 to-white shadow-sm shadow-violet-100/70 sm:mt-7 sm:rounded-3xl">
          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative flex min-h-[190px] flex-col justify-between gap-7 p-5 sm:min-h-[210px] sm:p-7 lg:flex-row lg:items-center lg:px-9 lg:py-8">
            <div className="min-w-0 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 shadow-sm">
                <Sparkles className="h-3 w-3" />
                Pengaturan Workspace
              </div>

              <h2 className="mt-4 max-w-xl break-words text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">
                Kelola workspace Anda dengan lebih mudah.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Informasi organisasi dan akun Anda dapat
                dilihat dari satu tempat dengan tampilan yang
                lebih sederhana.
              </p>
            </div>

            {/* Ilustrasi dekoratif */}

            <div className="hidden shrink-0 lg:flex lg:items-center lg:justify-center lg:pr-8">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="absolute inset-3 rounded-[28px] bg-violet-200/60 blur-sm" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] border border-white/80 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-white shadow-xl shadow-violet-300/40">
                  <Settings2
                    className="h-11 w-11"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="absolute -right-1 top-1 flex h-8 w-8 items-center justify-center rounded-xl border border-white bg-white text-violet-500 shadow-md">
                  <UserRound className="h-4 w-4" />
                </div>

                <div className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-xl border border-white bg-white text-indigo-500 shadow-md">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          {/* Informasi Organisasi */}

          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
                    <Building2 className="h-5 w-5 text-sky-600" />
                  </div>

                  <div className="min-w-0">
                    <CardTitle className="text-base text-slate-900">
                      Informasi Organisasi
                    </CardTitle>

                    <CardDescription className="mt-1 leading-5 text-slate-500">
                      Informasi dasar organisasi yang sedang Anda gunakan.
                    </CardDescription>
                  </div>
                </div>

                <Badge
                  variant="success"
                  className="hidden shrink-0 items-center gap-1.5 sm:inline-flex"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </Badge>
              </div>

              <Badge
                variant="success"
                className="mt-3 w-fit shrink-0 items-center gap-1.5 sm:hidden"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aktif
              </Badge>
            </CardHeader>

            <CardContent className="!p-5 sm:!p-6">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <p className="text-xs font-medium text-slate-500">
                    Nama Organisasi
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                    {organization.name}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <p className="text-xs font-medium text-slate-500">
                    Alamat Workspace
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-slate-700">
                    /{organization.slug}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Akun */}

          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-100">
                  <UserRound className="h-5 w-5 text-violet-600" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base text-slate-900">
                    Informasi Akun
                  </CardTitle>

                  <CardDescription className="mt-1 leading-5 text-slate-500">
                    Informasi akun yang digunakan untuk mengakses workspace.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="!p-5 sm:!p-6">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {/* Email */}

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      Alamat Email
                    </p>

                    <p className="mt-1.5 break-all text-sm font-medium text-slate-900">
                      {user.email || 'Tidak tersedia'}
                    </p>
                  </div>
                </div>

                {/* Role */}

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-violet-100">
                    <Crown className="h-4 w-4 text-violet-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      Peran Anda
                    </p>

                    <div className="mt-1.5">
                      <Badge
                        variant="info"
                        className="gap-1.5 border-violet-200 bg-violet-100 text-violet-700"
                      >
                        <Crown className="h-3 w-3" />
                        {roleLabel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Workspace */}

          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base text-slate-900">
                    Status Workspace
                  </CardTitle>

                  <CardDescription className="mt-1 leading-5 text-slate-500">
                    Kondisi workspace Anda saat ini.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="!p-5 sm:!p-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Workspace aktif
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Organisasi Anda siap digunakan untuk kegiatan pembelajaran.
                    </p>
                  </div>
                </div>

                <Badge
                  variant="success"
                  className="w-fit shrink-0"
                >
                  Aktif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}