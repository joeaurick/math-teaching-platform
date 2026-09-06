import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Plus,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type ClassesPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function ClassesPage({
  params,
}: ClassesPageProps) {
  const { organization: organizationSlug } = await params

  const { organization } =
    await getOrganizationContext(organizationSlug)

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="Classes"
          description="Manage your classes and give students access to learning materials."
          actions={
            <Button>
              <Plus className="h-4 w-4" />
              New Class
            </Button>
          }
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="group overflow-hidden border-sky-200/60 bg-gradient-to-br from-sky-50/[0.10] via-white/[0.045] to-transparent shadow-[0_12px_40px_rgba(56,189,248,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/70 hover:bg-sky-50/[0.13]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/30 bg-sky-400/15">
                  <Users className="h-5 w-5 text-sky-300" />
                </div>

                <Badge
                  variant="info"
                  className="border-sky-300/20 bg-sky-400/10 text-sky-200"
                >
                  Coming next
                </Badge>
              </div>

              <h2 className="mt-6 text-base font-semibold text-white">
                Your Classes
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                Create and manage classes for your students.
              </p>

              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="border-sky-300/20 bg-sky-400/10 text-sky-100 hover:border-sky-300/30 hover:bg-sky-400/15"
                >
                  <Plus className="h-4 w-4" />
                  Create Class
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-violet-200/60 bg-gradient-to-br from-violet-50/[0.10] via-white/[0.045] to-transparent shadow-[0_12px_40px_rgba(139,92,246,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300/70 hover:bg-violet-50/[0.13]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-400/15">
                  <BookOpen className="h-5 w-5 text-violet-300" />
                </div>

                <Badge
                  variant="success"
                  className="border-violet-300/20 bg-violet-400/10 text-violet-200"
                >
                  Student
                </Badge>
              </div>

              <h2 className="mt-6 text-base font-semibold text-white">
                Student Access
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                Generate secure links that students can use to access their
                learning environment.
              </p>

              <div className="mt-6">
                <Link
                  href={`/${organization.slug}/classes/student-access`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-violet-200 transition-colors hover:text-violet-100"
                >
                  Manage student access
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50/[0.08] via-white/[0.025] to-transparent">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10">
              <Users className="h-6 w-6 text-amber-300" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              No classes yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
              Classes will allow you to organize students, modules, questions,
              and submissions in one place.
            </p>

            <Button className="mt-6">
              <Plus className="h-4 w-4" />
              Create your first class
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}