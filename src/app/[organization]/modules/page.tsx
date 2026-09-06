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
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(new Date(value))
}

const quickLinks = [
  {
    title: 'Question Builder',
    description:
      'Create mathematics questions.',
    href: 'questions',
    icon: PenLine,
    iconClass:
      'border-sky-300/20 bg-sky-400/10 text-sky-300',
  },
  {
    title: 'Geometry',
    description:
      'Build interactive geometry content.',
    href: 'geometry',
    icon: Shapes,
    iconClass:
      'border-violet-300/20 bg-violet-400/10 text-violet-300',
  },
  {
    title: 'Question Bank',
    description:
      'Browse reusable questions.',
    href: 'question-bank',
    icon: FileQuestion,
    iconClass:
      'border-amber-300/20 bg-amber-400/10 text-amber-300',
  },
  {
    title: 'Classes',
    description:
      'Manage classes and students.',
    href: 'classes',
    icon: Users,
    iconClass:
      'border-emerald-300/20 bg-emerald-400/10 text-emerald-300',
  },
  {
    title: 'Live Classroom',
    description:
      'Start an interactive session.',
    href: 'live-classroom',
    icon: Video,
    iconClass:
      'border-rose-300/20 bg-rose-400/10 text-rose-300',
  },
  {
    title: 'Photo / Scan',
    description:
      'Capture mathematics work.',
    href: 'photo-scan',
    icon: Camera,
    iconClass:
      'border-cyan-300/20 bg-cyan-400/10 text-cyan-300',
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
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="My Modules"
          description="Create, publish, and share your mathematics teaching modules with students."
          actions={
            <Link
              href={`/${organization.slug}/modules/new`}
            >
              <Button
                type="button"
                variant="primary"
                size="md"
                className="border-white/10 bg-white text-black hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                New Module
              </Button>
            </Link>
          }
        />

        {modules.length === 0 ? (
          <>
            <div className="mt-8">
              <EmptyState
                icon={
                  <BookOpen className="h-5 w-5 text-sky-300" />
                }
                title="No modules yet"
                description="Create your first teaching module to start organizing your mathematics content."
                action={
                  <Link
                    href={`/${organization.slug}/modules/new`}
                  >
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="border-white/10 bg-white text-black hover:bg-white/90"
                    >
                      <Plus className="h-4 w-4" />
                      Create your first module
                    </Button>
                  </Link>
                }
              />
            </div>

            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">
                  Other teaching tools
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Continue building your teaching workspace.
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
                      <Card className="h-full border-white/[0.07] bg-white/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconClass}`}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                              {item.title}
                            </h3>

                            <p className="mt-1 truncate text-xs text-white/30">
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
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white">
                Your modules
              </h2>

              <p className="mt-1 text-xs text-white/35">
                {modules.length} module
                {modules.length === 1
                  ? ''
                  : 's'}{' '}
                in this workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="h-full overflow-hidden border-white/[0.07] bg-white/[0.025] transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04]"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        href={`/${organization.slug}/modules/${module.id}`}
                        className="group"
                        aria-label={`Open ${module.title}`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10 transition-colors group-hover:border-sky-300/30 group-hover:bg-sky-400/15">
                          <BookOpen className="h-[18px] w-[18px] text-sky-300" />
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
                        className="capitalize"
                      >
                        {module.status}
                      </Badge>
                    </div>

                    <Link
                      href={`/${organization.slug}/modules/${module.id}`}
                      className="group block"
                    >
                      <h2 className="mt-5 line-clamp-2 text-base font-semibold tracking-tight text-white transition-colors group-hover:text-sky-100">
                        {module.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-white/35">
                        {module.description ||
                          'No description added yet.'}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-white/30">
                        <Clock3 className="h-3.5 w-3.5 text-sky-300/50" />

                        <span>
                          Updated{' '}
                          {formatDate(
                            module.updated_at,
                          )}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-4 border-t border-white/[0.07] pt-4">
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