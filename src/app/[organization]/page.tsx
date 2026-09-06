import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Camera,
  FileQuestion,
  PenLine,
  Shapes,
  Users,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type OrganizationPageProps = {
  params: Promise<{
    organization: string
  }>
}

const quickActions = [
  {
    title: 'Create Question',
    description: 'Build a new mathematics question.',
    href: 'questions',
    icon: PenLine,
  },
  {
    title: 'My Modules',
    description: 'Create and manage teaching modules.',
    href: 'modules',
    icon: BookOpen,
  },
  {
    title: 'Question Bank',
    description: 'Browse your reusable questions.',
    href: 'question-bank',
    icon: FileQuestion,
  },
  {
    title: 'Geometry',
    description: 'Create interactive geometry content.',
    href: 'geometry',
    icon: Shapes,
  },
]

const teachingActions = [
  {
    title: 'Classes',
    description: 'Manage classes and students.',
    href: 'classes',
    icon: Users,
  },
  {
    title: 'Live Classroom',
    description: 'Start an interactive teaching session.',
    href: 'live-classroom',
    icon: Video,
  },
  {
    title: 'Photo / Scan',
    description: 'Capture or scan mathematics work.',
    href: 'photo-scan',
    icon: Camera,
  },
]

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { organization: slug } = await params

  const {
    organization,
    membership,
    user,
  } = await getOrganizationContext(slug)

  const firstName =
    user.email?.split('@')[0] || 'Teacher'

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        <PageHeader
          eyebrow="Workspace"
          title={`Good to see you, ${firstName}`}
          description={`Everything you need to prepare, manage, and deliver mathematics lessons in ${organization.name}.`}
          actions={
            <Badge
              variant="default"
              className="w-fit capitalize"
            >
              {membership.role}
            </Badge>
          }
        />

        {/* Quick Actions */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Quick actions
            </h2>

            <p className="mt-1 text-xs text-white/35">
              Start creating something for your next lesson.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.045]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.045]">
                          <Icon className="h-[18px] w-[18px] text-white/60" />
                        </div>

                        <ArrowRight className="h-4 w-4 text-white/20 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-white">
                        {action.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/35">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Teaching Workspace */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Teaching workspace
            </h2>

            <p className="mt-1 text-xs text-white/35">
              Tools for managing your classroom experience.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {teachingActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={`/${organization.slug}/${action.href}`}
                  className="group"
                >
                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                      <Icon className="h-[18px] w-[18px] text-white/45" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-white/80">
                        {action.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-white/30">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Workspace Information */}

        <section className="mt-8">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/25">
                  Workspace
                </p>

                <h2 className="mt-2 text-base font-semibold text-white">
                  {organization.name}
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Your mathematics teaching workspace is ready.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="muted">
                  /{organization.slug}
                </Badge>

                <Badge
                  variant="success"
                  className="capitalize"
                >
                  {membership.role}
                </Badge>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  )
}