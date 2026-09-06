'use client'

import {
  Camera,
  FileImage,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { MathImageUpload } from '@/components/math/math-image-upload'

export function PhotoScanWorkspace() {
  const [file, setFile] = useState<File | null>(null)

  function handleReset() {
    setFile(null)
  }

  return (
    <section className="mt-8">
      <Card className="border-white/[0.08] bg-white/[0.02]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10">
                  <Camera className="h-5 w-5 text-rose-300" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Upload Gambar
                  </h2>

                  <p className="mt-0.5 text-xs text-white/35">
                    Foto pekerjaan atau soal matematika
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <Badge variant="success">
                Gambar siap
              </Badge>
            )}
          </div>

          <div className="mt-7">
            <MathImageUpload
              value={file}
              onChange={setFile}
            />
          </div>

          {file && (
            <div className="mt-6 rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.04] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <FileImage className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/80">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-3 text-xs font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Pilih Ulang
                </button>
              </div>
            </div>
          )}

          {!file && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-300/10 bg-violet-400/[0.035] p-5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

              <div>
                <p className="text-sm font-medium text-white/70">
                  Tips
                </p>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Gunakan foto yang terang dan pastikan tulisan
                  matematika terlihat jelas agar mudah digunakan
                  pada tahap berikutnya.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}