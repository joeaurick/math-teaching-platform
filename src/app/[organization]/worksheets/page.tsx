import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  Plus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

  const publishedCount = worksheets.filter(
    (worksheet) =>
      worksheet.status === 'published',
  ).length

  const draftCount = worksheets.filter(
    (worksheet) =>
      worksheet.status === 'draft',
  ).length

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
            >
              <Button>
                <Plus className="h-4 w-4" />
                New Worksheet
              </Button>
            </Link>
          }
        />

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="overflow-hidden border-sky-200/10 bg-gradient-to-br from-sky-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(56,189,248,0.04)]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                <FileText className="h-5 w-5 text-sky-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-sky-200/45">
                  Total Worksheets
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {worksheets.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-emerald-200/10 bg-gradient-to-br from-emerald-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(52,211,153,0.04)]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10">
                <FileText className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-200/45">
                  Published
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {publishedCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-amber-200/10 bg-gradient-to-br from-amber-400/[0.07] via-white/[0.02] to-transparent shadow-[0_14px_40px_rgba(251,191,36,0.04)]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                <FileText className="h-5 w-5 text-amber-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-amber-200/45">
                  Draft
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {draftCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Worksheet List */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              All Worksheets
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Kelola worksheet yang tersedia di organization
              ini.
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
                >
                  <Button>
                    <Plus className="h-4 w-4" />
                    Create Worksheet
                  </Button>
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
                  <Card className="h-full overflow-hidden border-violet-200/10 bg-gradient-to-br from-violet-400/[0.035] via-white/[0.02] to-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300/20 hover:shadow-[0_16px_40px_rgba(139,92,246,0.06)]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 transition-colors duration-200 group-hover:bg-violet-400/15">
                          <FileText className="h-[18px] w-[18px] text-violet-300" />
                        </div>

                        <Badge
                          variant={
                            worksheet.status ===
                            'published'
                              ? 'success'
                              : worksheet.status ===
                                  'archived'
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
                        <span className="text-xs text-sky-200/35">
                          Worksheet
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-200/45 transition-all duration-200 group-hover:gap-1.5 group-hover:text-violet-200">
                          Open
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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