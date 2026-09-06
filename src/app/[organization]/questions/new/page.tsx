import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'
import { QuestionForm } from './question-form'

type NewQuestionPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function NewQuestionPage({
  params,
}: NewQuestionPageProps) {
  const { organization: slug } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: organization, error: organizationError } =
    await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    notFound()
  }

  const { data: membership, error: membershipError } =
    await supabase
      .from('organization_members')
      .select('id, role')
      .eq('organization_id', organization.id)
      .eq('user_id', user.id)
      .maybeSingle()

  if (membershipError) {
    throw new Error(
      `Gagal mengambil membership: ${membershipError.message}`,
    )
  }

  if (!membership) {
    notFound()
  }

  const { data: modules, error: modulesError } =
    await supabase
      .from('modules')
      .select('id, title')
      .eq('organization_id', organization.id)
      .order('title', { ascending: true })

  if (modulesError) {
    throw new Error(
      `Gagal mengambil modules: ${modulesError.message}`,
    )
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}/questions`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Questions
        </Link>

        <PageHeader
          eyebrow="Teaching / Question Builder"
          title="New Question"
          description="Create a mathematics question and assign it to a module."
        />

        <div className="mt-8">
          <QuestionForm
            organizationSlug={organization.slug}
            modules={modules ?? []}
          />
        </div>
      </div>
    </div>
  )
}