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
          {/* YOUR CLASSES */}
          <Card className="group overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100">
            <CardContent className="!p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
                  <Users className="h-5 w-5 text-sky-600" />
                </div>

                <Badge
                  variant="info"
                  className="border-sky-200 bg-sky-50 text-sky-700"
                >
                  Coming next
                </Badge>
              </div>

              <h2 className="mt-6 text-base font-semibold text-slate-900">
                Your Classes
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create and manage classes for your students.
              </p>

              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100"
                >
                  <Plus className="h-4 w-4" />
                  Create Class
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* STUDENT ACCESS */}
          <Card className="group overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm shadow-violet-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100">
            <CardContent className="!p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>

                <Badge
                  variant="success"
                  className="border-violet-200 bg-violet-50 text-violet-700"
                >
                  Student
                </Badge>
              </div>

              <h2 className="mt-6 text-base font-semibold text-slate-900">
                Student Access
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Generate secure links that students can use to access their
                learning environment.
              </p>

              <div className="mt-6">
                <Link
                  href={`/${organization.slug}/classes/student-access`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
                >
                  Manage student access
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMPTY STATE */}
        <Card className="mt-4 overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100/50">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center !p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
              <Users className="h-6 w-6 text-amber-600" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-900">
              No classes yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
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