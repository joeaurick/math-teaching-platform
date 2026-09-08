import Link from 'next/link'
import {
  ArrowLeft,
  FunctionSquare,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { MathSymbolsClient } from './math-symbols-client'

type MathSymbolsPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function MathSymbolsPage({
  params,
}: MathSymbolsPageProps) {
  const { organization: organizationSlug } =
    await params

  const { organization } =
    await getOrganizationContext(organizationSlug)

  return (
    <div className="min-h-full bg-slate-50/40">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}`}
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>

        <PageHeader
          eyebrow="Alat Matematika"
          title="Simbol Matematika"
          description="Cari dan salin simbol matematika yang dapat digunakan dalam soal dan materi."
          actions={
            <Badge variant="info">
              <FunctionSquare className="mr-1.5 h-3.5 w-3.5" />
              Simbol Matematika
            </Badge>
          }
        />

        <Card className="mt-6 overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-sky-50/60 to-white shadow-sm shadow-violet-100/50 sm:mt-8">
          <CardContent className="relative !p-5 sm:!p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-200/70" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100">
                <FunctionSquare className="h-6 w-6 text-violet-600" />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Simbol matematika siap digunakan.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Klik simbol untuk menyalinnya ke clipboard.
                  Gunakan simbol ini ketika membuat soal,
                  materi, atau penjelasan matematika.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8">
          <MathSymbolsClient />
        </div>
      </main>
    </div>
  )
}