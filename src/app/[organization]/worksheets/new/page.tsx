import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { WorksheetForm } from './worksheet-form'

type NewWorksheetPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function NewWorksheetPage({
  params,
}: NewWorksheetPageProps) {
  const { organization: slug } = await params

  const { organization } =
    await getOrganizationContext(slug)

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="New Worksheet"
          description="Buat worksheet baru untuk mengumpulkan soal-soal matematika."
        />

        <div className="mt-8">
          <WorksheetForm
            organizationSlug={organization.slug}
          />
        </div>
      </div>
    </div>
  )
}