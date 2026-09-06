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
    <div className="min-h-full">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href={`/${organization.slug}`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-300/70 transition-colors hover:text-violet-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>

        <PageHeader
          eyebrow="Math Tools"
          title="Math Symbols"
          description="Cari dan salin simbol matematika yang dapat digunakan dalam soal dan materi."
          actions={
            <Badge variant="info">
              <FunctionSquare className="mr-1.5 h-3.5 w-3.5" />
              Math Symbols
            </Badge>
          }
        />

        <Card className="mt-8 overflow-hidden border-violet-300/10 bg-gradient-to-br from-violet-400/[0.07] via-sky-400/[0.04] to-transparent">
          <CardContent className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-300/[0.07]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10">
                <FunctionSquare className="h-6 w-6 text-violet-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Simbol matematika siap digunakan.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  Klik simbol untuk menyalinnya ke clipboard.
                  Gunakan simbol ini ketika membuat soal,
                  materi, atau penjelasan matematika.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <MathSymbolsClient />
      </main>
    </div>
  )
}