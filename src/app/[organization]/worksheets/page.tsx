import Link from 'next/link'
import {
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type WorksheetsPageProps = {
  params: Promise<{
    organization: string
  }>
}

type Worksheet = {
  id: string
  title: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export default async function WorksheetsPage({
  params,
}: WorksheetsPageProps) {
  const { organization: slug } = await params

  const {
    supabase,
    organization,
  } = await getOrganizationContext(slug)

  const {
    data: worksheetData,
    error: worksheetsError,
  } = await supabase
    .from('worksheets')
    .select(`
      id,
      title,
      description,
      status,
      created_at,
      updated_at
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  if (worksheetsError) {
    throw new Error(
      `Gagal mengambil worksheets: ${worksheetsError.message}`,
    )
  }

  const worksheets = (worksheetData ?? []) as Worksheet[]

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Teaching"
          title="Worksheets"
          description="Buat dan kelola lembar kerja matematika untuk siswa."
          actions={
            <Link
              href={`/${organization.slug}/worksheets/new`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              New Worksheet
            </Link>
          }
        />

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Total Worksheets
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {worksheets.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Published
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {
                  worksheets.filter(
                    (worksheet) =>
                      worksheet.status === 'published',
                  ).length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-white/40">
                Draft
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {
                  worksheets.filter(
                    (worksheet) =>
                      worksheet.status === 'draft',
                  ).length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Worksheet List */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              All Worksheets
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Kelola worksheet yang tersedia di organization ini.
            </p>
          </div>

          {worksheets.length === 0 ? (
            <EmptyState
              icon={
                <FileText className="h-5 w-5" />
              }
              title="Belum ada worksheet"
              description="Buat worksheet pertama dan tambahkan soal dari Question Bank."
              action={
                <Link
                  href={`/${organization.slug}/worksheets/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  Create Worksheet
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {worksheets.map((worksheet) => (
                <Link
                  key={worksheet.id}
                  href={`/${organization.slug}/worksheets/${worksheet.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.03]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                          <FileText className="h-[18px] w-[18px] text-white/55" />
                        </div>

                        <Badge
                          variant={
                            worksheet.status === 'published'
                              ? 'success'
                              : worksheet.status === 'archived'
                                ? 'muted'
                                : 'warning'
                          }
                          className="capitalize"
                        >
                          {worksheet.status}
                        </Badge>
                      </div>

                      <h3 className="mt-5 line-clamp-2 text-base font-semibold text-white">
                        {worksheet.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/35">
                        {worksheet.description ||
                          'Tidak ada deskripsi worksheet.'}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                        <span className="text-xs text-white/30">
                          Worksheet
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs text-white/40 transition-colors group-hover:text-white/70">
                          Open
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}