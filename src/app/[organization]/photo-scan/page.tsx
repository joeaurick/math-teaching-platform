import Link from 'next/link'
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileImage,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { PhotoScanWorkspace } from './photo-scan-workspace'

type PhotoScanPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function PhotoScanPage({
  params,
}: PhotoScanPageProps) {
  const { organization: organizationSlug } =
    await params

  const { organization } =
    await getOrganizationContext(
      organizationSlug,
    )

  return (
    <div className="min-h-full bg-slate-50/40">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href={`/${organization.slug}`}
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>

        <PageHeader
          eyebrow="Alat Matematika"
          title="Foto / Scan"
          description="Tambahkan foto pekerjaan matematika atau gambar soal untuk digunakan dalam proses mengajar."
          actions={
            <Badge variant="info">
              <Camera className="mr-1.5 h-3.5 w-3.5" />
              Foto / Scan
            </Badge>
          }
        />

        <Card className="mt-6 overflow-hidden border-rose-200 bg-gradient-to-br from-rose-50 via-violet-50/50 to-white shadow-sm shadow-rose-100/60 sm:mt-8">
          <CardContent className="relative !p-5 sm:!p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-rose-200/70" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50">
                <Camera className="h-6 w-6 text-rose-500" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    Bawa pekerjaan matematika ke ruang kerja.
                  </h2>

                  <Sparkles className="hidden h-4 w-4 text-violet-500 sm:block" />
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Ambil atau pilih foto pekerjaan matematika,
                  lalu lihat hasilnya sebelum digunakan lebih
                  lanjut.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          <InfoCard
            icon={Camera}
            color="rose"
            title="Ambil Foto"
            description="Gunakan kamera perangkat atau pilih gambar dari perangkat."
          />

          <InfoCard
            icon={FileImage}
            color="sky"
            title="Pratinjau"
            description="Periksa gambar terlebih dahulu sebelum digunakan."
          />

          <InfoCard
            icon={CheckCircle2}
            color="emerald"
            title="Siap Digunakan"
            description="Gambar dapat digunakan sebagai bagian dari materi atau pekerjaan siswa."
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <PhotoScanWorkspace />
        </div>
      </main>
    </div>
  )
}

type InfoCardProps = {
  icon: React.ComponentType<{
    className?: string
  }>
  color: 'rose' | 'sky' | 'emerald'
  title: string
  description: string
}

function InfoCard({
  icon: Icon,
  color,
  title,
  description,
}: InfoCardProps) {
  const styles = {
    rose: {
      border:
        'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-white shadow-rose-100/50',
      icon:
        'border-rose-200 bg-rose-50 text-rose-500',
    },

    sky: {
      border:
        'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sky-100/50',
      icon:
        'border-sky-200 bg-sky-50 text-sky-600',
    },

    emerald: {
      border:
        'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-emerald-100/50',
      icon:
        'border-emerald-200 bg-emerald-50 text-emerald-600',
    },
  }[color]

  return (
    <Card
      className={`h-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.border}`}
    >
      <CardContent className="!p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}