'use client'

import { useState } from 'react'
import { MathImageUpload } from '@/components/math/math-image-upload'

export function MathImageTest() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-6">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-white">
          Foto Langkah Pengerjaan
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Test pemilihan dan preview gambar.
        </p>
      </div>

      <MathImageUpload
        value={file}
        onChange={setFile}
      />

      {file && (
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-4">
          <p className="text-xs text-white/40">
            File terpilih
          </p>

          <p className="mt-1 break-all text-sm text-white/70">
            {file.name}
          </p>

          <p className="mt-1 text-xs text-white/35">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  )
}