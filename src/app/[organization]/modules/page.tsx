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
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'
import { getModules } from '@/lib/modules/get-modules'

type ModulesPageProps = {
  params: Promise<{
    organization: string
  }>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const quickLinks = [
  {
    title: 'Question Builder',
    description: 'Create mathematics questions.',
    href: 'questions',
    icon: PenLine,
  },
  {
    title: 'Geometry',
    description: 'Build interactive geometry content.',
    href: 'geometry',
    icon: Shapes,
  },
  {
    title: 'Question Bank',
    description: 'Browse reusable questions.',
    href: 'question-bank',
    icon: FileQuestion,
  },
  {
    title: 'Classes',
    description: 'Manage classes and students.',
    href: 'classes',
    icon: Users,
  },
  {
    title: 'Live Classroom',
    description: 'Start an interactive session.',
    href: 'live-classroom',
    icon: Video,
  },
  {
    title: 'Photo / Scan',
    description: 'Capture mathematics work.',
    href: 'photo-scan',
    icon: Camera,
  },
]

export default async function ModulesPage({
  params,
}: ModulesPageProps) {
  const { organization: slug } = await params

  const { organization } =
    await getOrganizationContext(slug)

  const modules = await getModules(organization.id)

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="My Modules"
          description="Create and organize your mathematics teaching modules."
          actions={
            <Link
              href={`/${organization.slug}/modules/new`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              New Module
            </Link>
          }
        />

        {modules.length === 0 ? (
          <>
            <div className="mt-8">
              <EmptyState
                icon={<BookOpen className="h-5 w-5" />}
                title="No modules yet"
                description="Create your first teaching module to start organizing your mathematics content."
                action={
                  <Link
                    href={`/${organization.slug}/modules/new`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first module
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
                      <Card className="transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04]">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                            <Icon className="h-[18px] w-[18px] text-white/45" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-white/80">
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
                {modules.length === 1 ? '' : 's'} in this workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.id}
                  href={`/${organization.slug}/modules/${module.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                          <BookOpen className="h-[18px] w-[18px] text-white/55" />
                        </div>

                        <Badge
                          variant={
                            module.status === 'published'
                              ? 'success'
                              : module.status === 'archived'
                                ? 'muted'
                                : 'warning'
                          }
                          className="capitalize"
                        >
                          {module.status}
                        </Badge>
                      </div>

                      <h2 className="mt-5 line-clamp-2 text-base font-semibold tracking-tight text-white">
                        {module.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-white/35">
                        {module.description ||
                          'No description added yet.'}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-white/30">
                        <Clock3 className="h-3.5 w-3.5" />

                        <span>
                          Updated {formatDate(module.updated_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}