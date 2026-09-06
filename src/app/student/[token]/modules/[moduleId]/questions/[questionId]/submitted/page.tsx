import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type SubmittedPageProps = {
  params: Promise<{
    token: string
    moduleId: string
    questionId: string
  }>
}

export default async function SubmittedPage({
  params,
}: SubmittedPageProps) {
  const { token, moduleId } = await params

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-8 sm:px-6">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06]">
              <CheckCircle2 className="h-7 w-7 text-white/70" />
            </div>

            <h1 className="mt-6 text-xl font-semibold">
              Jawaban Berhasil Dikirim
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/50">
              Jawaban Anda sudah berhasil dikirim dan
              tersimpan.
            </p>

            <div className="mt-8">
              <Link
                href={`/student/${token}/modules/${moduleId}`}
              >
                <Button>
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Module
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}