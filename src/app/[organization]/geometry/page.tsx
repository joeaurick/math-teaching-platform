import type { ComponentType } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Circle,
  Hexagon,
  Minus,
  MoveDiagonal,
  Pentagon,
  Play,
  Plus,
  Shapes,
  Sparkles,
  Square,
  Triangle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

type GeometryColor =
  | 'sky'
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'rose'
  | 'cyan'

type GeometryShape = {
  title: string
  description: string
  color: GeometryColor
  icon: ComponentType<{
    className?: string
  }>
}

type GeometryColorStyle = {
  card: string
  icon: string
  badge: string
}

const geometryColorStyles: Record<
  GeometryColor,
  GeometryColorStyle
> = {
  sky: {
    card:
      'border-sky-200 hover:border-sky-300 hover:bg-sky-50/50',
    icon:
      'border-sky-200 bg-sky-50 text-sky-600',
    badge: 'text-sky-600',
  },

  violet: {
    card:
      'border-violet-200 hover:border-violet-300 hover:bg-violet-50/50',
    icon:
      'border-violet-200 bg-violet-50 text-violet-600',
    badge: 'text-violet-600',
  },

  amber: {
    card:
      'border-amber-200 hover:border-amber-300 hover:bg-amber-50/50',
    icon:
      'border-amber-200 bg-amber-50 text-amber-600',
    badge: 'text-amber-600',
  },

  emerald: {
    card:
      'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50',
    icon:
      'border-emerald-200 bg-emerald-50 text-emerald-600',
    badge: 'text-emerald-600',
  },

  rose: {
    card:
      'border-rose-200 hover:border-rose-300 hover:bg-rose-50/50',
    icon:
      'border-rose-200 bg-rose-50 text-rose-600',
    badge: 'text-rose-600',
  },

  cyan: {
    card:
      'border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50/50',
    icon:
      'border-cyan-200 bg-cyan-50 text-cyan-600',
    badge: 'text-cyan-600',
  },
}

const geometryShapes: GeometryShape[] = [
  {
    title: 'Titik',
    description:
      'Representasi titik pada bidang koordinat.',
    color: 'sky',
    icon: Circle,
  },
  {
    title: 'Garis',
    description:
      'Garis, ruas garis, dan hubungan antar titik.',
    color: 'violet',
    icon: Minus,
  },
  {
    title: 'Sudut',
    description:
      'Pelajari dan visualisasikan berbagai jenis sudut.',
    color: 'amber',
    icon: MoveDiagonal,
  },
  {
    title: 'Segitiga',
    description:
      'Segitiga berdasarkan sisi dan besar sudut.',
    color: 'emerald',
    icon: Triangle,
  },
  {
    title: 'Persegi',
    description:
      'Eksplorasi persegi dan sifat-sifatnya.',
    color: 'rose',
    icon: Square,
  },
  {
    title: 'Poligon',
    description:
      'Bentuk datar dengan berbagai jumlah sisi.',
    color: 'cyan',
    icon: Pentagon,
  },
  {
    title: 'Lingkaran',
    description:
      'Radius, diameter, busur, dan bagian lingkaran.',
    color: 'sky',
    icon: Circle,
  },
  {
    title: 'Bentuk 3D',
    description:
      'Eksplorasi bentuk ruang dan karakteristiknya.',
    color: 'violet',
    icon: Hexagon,
  },
]

type GeometryPageProps = {
  params: Promise<{
    organization: string
  }>
}

export default async function GeometryPage({
  params,
}: GeometryPageProps) {
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
          title="Geometri"
          description="Eksplorasi bentuk, garis, sudut, dan konsep geometri secara visual."
          actions={
            <Badge variant="info">
              <Shapes className="mr-1.5 h-3.5 w-3.5" />
              Geometri
            </Badge>
          }
        />

        {/* Hero */}

        <Card className="mt-6 overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 via-indigo-50/60 to-white shadow-sm shadow-violet-100/50 sm:mt-8">
          <CardContent className="relative !p-5 sm:!p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-200/70" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100">
                  <Shapes className="h-5 w-5 text-violet-600" />
                </div>

                <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Visualisasikan matematika dengan lebih mudah.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Gunakan Geometri untuk membantu menjelaskan
                  konsep matematika melalui bentuk dan visual
                  yang lebih mudah dipahami.
                </p>
              </div>

              <div className="flex w-fit shrink-0 items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                <Sparkles className="h-4 w-4 text-violet-600" />

                <span className="text-xs font-medium text-violet-700">
                  Alat belajar visual
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geometry Shapes */}

        <section className="mt-8 sm:mt-10">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Bentuk Geometri
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Pilih bentuk yang ingin Anda eksplorasi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {geometryShapes.map((shape) => {
              const Icon = shape.icon
              const colors =
                geometryColorStyles[shape.color]

              return (
                <Card
                  key={shape.title}
                  className={`group cursor-pointer bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${colors.card}`}
                >
                  <CardContent className="flex h-full min-h-[190px] flex-col !p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${colors.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-slate-100">
                        <Plus className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-slate-900">
                      {shape.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {shape.description}
                    </p>

                    <div
                      className={`mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium ${colors.badge}`}
                    >
                      <Play className="h-3 w-3" />
                      Eksplorasi
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Workspace Info */}

        <Card className="mt-8 border-violet-200 bg-gradient-to-r from-violet-50 via-indigo-50/50 to-white shadow-sm shadow-violet-100/50">
          <CardContent className="flex items-start gap-3 !p-5 sm:!p-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Ruang Kerja Geometri
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Area ini dapat dikembangkan menjadi ruang
                interaktif untuk menggambar dan memanipulasi
                objek geometri.
              </p>
            </div>
          </CardContent>
        </Card>

        <Link
          href={`/${organization.slug}`}
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
        >
          Kembali ke Dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </main>
    </div>
  )
}