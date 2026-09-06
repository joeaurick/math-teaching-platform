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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <Users className="h-5 w-5 text-white/60" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              Your Classes
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Create and manage classes for your students.
            </p>

            <div className="mt-5">
              <Badge variant="muted">
                Coming next
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <BookOpen className="h-5 w-5 text-white/60" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              Student Access
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Generate secure links that students can use to access their
              learning environment.
            </p>

            <div className="mt-5">
              <Link
                href={`/${organization.slug}/classes/student-access`}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Manage student access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <Users className="h-5 w-5 text-white/35" />
          </div>

          <h2 className="mt-5 text-base font-medium text-white/80">
            No classes yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
            Classes will allow you to organize students, modules, questions,
            and submissions in one place.
          </p>

          <Button className="mt-5">
            <Plus className="h-4 w-4" />
            Create your first class
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}