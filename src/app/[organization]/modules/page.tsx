import Link from 'next/link'
import {
  BookOpen,
  Camera,
  Clock3,
  FileQuestion,
  PenLine,
  Plus,
  Shapes,
  Users,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'
import { getModules } from '@/lib/modules/get-modules'

import { ModuleActions } from './module-actions'

type ModulesPageProps = {
  params: Promise<{
    organization: string
  }>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

const quickLinks = [
  {
    title: 'Pembuat Soal',
    description: 'Buat soal matematika.',
    href: 'questions',
    icon: PenLine,
    iconClass:
      'border-sky-200 bg-sky-50 text-sky-600',
  },
  {
    title: 'Geometri',
    description:
      'Buat konten geometri interaktif.',
    href: 'geometry',
    icon: Shapes,
    iconClass:
      'border-violet-200 bg-violet-50 text-violet-600',
  },
  {
    title: 'Bank Soal',
    description:
      'Jelajahi soal yang dapat digunakan kembali.',
    href: 'question-bank',
    icon: FileQuestion,
    iconClass:
      'border-amber-200 bg-amber-50 text-amber-600',
  },
  {
    title: 'Kelas',
    description: 'Kelola kelas dan siswa.',
    href: 'classes',
    icon: Users,
    iconClass:
      'border-emerald-200 bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Kelas Langsung',
    description:
      'Mulai sesi pembelajaran interaktif.',
    href: 'live-classroom',
    icon: Video,
    iconClass:
      'border-rose-200 bg-rose-50 text-rose-600',
  },
  {
    title: 'Foto / Scan',
    description:
      'Ambil foto pekerjaan matematika.',
    href: 'photo-scan',
    icon: Camera,
    iconClass:
      'border-cyan-200 bg-cyan-50 text-cyan-600',
  },
]

export default async function ModulesPage({
  params,
}: ModulesPageProps) {
  const { organization: slug } =
    await params

  const { organization } =
    await getOrganizationContext(slug)

  const modules =
    await getModules(organization.id)

  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Pembelajaran"
          title="Modul Saya"
          description="Buat, terbitkan, dan bagikan modul pembelajaran matematika kepada siswa."
          actions={
            <Link
              href={`/${organization.slug}/modules/new`}
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Modul Baru
              </Button>
            </Link>
          }
        />

        {modules.length === 0 ? (
          <>
            <div className="mt-6 sm:mt-8">
              <EmptyState
                icon={
                  <BookOpen className="h-5 w-5 text-sky-600" />
                }
                title="Belum ada modul"
                description="Buat modul pembelajaran pertama Anda untuk mulai mengatur materi matematika."
                action={
                  <Link
                    href={`/${organization.slug}/modules/new`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Buat Modul Pertama
                    </Button>
                  </Link>
                }
              />
            </div>

            <section className="mt-8 sm:mt-10">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Alat Pembelajaran Lainnya
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Lanjutkan membangun ruang kerja
                  pembelajaran Anda.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.title}
                      href={`/${organization.slug}/${item.href}`}
                      className="group"
                    >
                      <Card className="h-full border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 !p-4 sm:!p-5">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconClass}`}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-slate-950">
                              {item.title}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-6 sm:mt-8">
            <div className="mb-4 sm:mb-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Modul Anda
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {modules.length} modul tersedia di ruang
                kerja ini.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="h-full overflow-hidden border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <CardContent className="!p-5 sm:!p-6">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        href={`/${organization.slug}/modules/${module.id}`}
                        className="group"
                        aria-label={`Buka ${module.title}`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 transition-colors group-hover:border-sky-300 group-hover:bg-sky-100">
                          <BookOpen className="h-[18px] w-[18px] text-sky-600" />
                        </div>
                      </Link>

                      <Badge
                        variant={
                          module.status ===
                          'published'
                            ? 'success'
                            : module.status ===
                                'archived'
                              ? 'muted'
                              : 'warning'
                        }
                      >
                        {module.status ===
                        'published'
                          ? 'Diterbitkan'
                          : module.status ===
                              'archived'
                            ? 'Diarsipkan'
                            : 'Draf'}
                      </Badge>
                    </div>

                    <Link
                      href={`/${organization.slug}/modules/${module.id}`}
                      className="group block"
                    >
                      <h2 className="mt-5 line-clamp-2 text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-violet-600">
                        {module.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-600">
                        {module.description ||
                          'Belum ada deskripsi untuk modul ini.'}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5 text-sky-500" />

                        <span>
                          Diperbarui{' '}
                          {formatDate(
                            module.updated_at,
                          )}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <ModuleActions
                        organizationSlug={
                          organization.slug
                        }
                        moduleId={module.id}
                        moduleTitle={
                          module.title
                        }
                        status={module.status}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}