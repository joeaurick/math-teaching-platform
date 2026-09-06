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
    await getOrganizationContext(organizationSlug)

  return (
    <div className="min-h-full">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href={`/${organization.slug}`}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-rose-300/70 transition-colors hover:text-rose-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>

        <PageHeader
          eyebrow="Math Tools"
          title="Photo / Scan"
          description="Tambahkan foto pekerjaan matematika atau gambar soal untuk digunakan dalam proses mengajar."
          actions={
            <Badge variant="info">
              <Camera className="mr-1.5 h-3.5 w-3.5" />
              Photo / Scan
            </Badge>
          }
        />

        <Card className="mt-8 overflow-hidden border-rose-300/10 bg-gradient-to-br from-rose-400/[0.07] via-violet-400/[0.04] to-transparent">
          <CardContent className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-rose-300/[0.07]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-400/10">
                <Camera className="h-6 w-6 text-rose-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Bawa pekerjaan matematika ke workspace.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  Ambil atau pilih foto pekerjaan matematika,
                  lalu lihat hasilnya sebelum digunakan lebih
                  lanjut.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={Camera}
            color="rose"
            title="Ambil Foto"
            description="Gunakan kamera perangkat atau pilih gambar dari perangkat."
          />

          <InfoCard
            icon={FileImage}
            color="sky"
            title="Preview"
            description="Periksa gambar terlebih dahulu sebelum digunakan."
          />

          <InfoCard
            icon={CheckCircle2}
            color="emerald"
            title="Siap Digunakan"
            description="Gambar dapat digunakan sebagai bagian dari materi atau pekerjaan siswa."
          />
        </div>

        <PhotoScanWorkspace />
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
      border: 'border-rose-300/10',
      icon: 'bg-rose-400/10 text-rose-300',
    },
    sky: {
      border: 'border-sky-300/10',
      icon: 'bg-sky-400/10 text-sky-300',
    },
    emerald: {
      border: 'border-emerald-300/10',
      icon: 'bg-emerald-400/10 text-emerald-300',
    },
  }[color]

  return (
    <Card className={styles.border}>
      <CardContent className="p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/35">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}