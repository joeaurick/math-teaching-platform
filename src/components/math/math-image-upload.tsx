'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

type MathImageUploadProps = {
  value: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

export function MathImageUpload({
  value,
  onChange,
  disabled = false,
}: MathImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  function handleSelect(file: File | undefined) {
    setError('')

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.')
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      setError('Ukuran gambar maksimal 5 MB.')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const url = URL.createObjectURL(file)

    setPreviewUrl(url)
    onChange(file)
  }

  function handleRemove() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(null)
    onChange(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleSelect(event.target.files?.[0])
        }}
      />

      {!value ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-5 text-sm text-white/55 transition hover:border-white/[0.20] hover:bg-white/[0.04] hover:text-white/80 disabled:pointer-events-none disabled:opacity-40"
        >
          <ImagePlus className="h-5 w-5" />

          <span>
            Tambahkan foto langkah pengerjaan
          </span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-white/[0.10] bg-white/[0.03]">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview langkah pengerjaan"
              className="max-h-[400px] w-full object-contain"
            />
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-black/70 text-white/70 backdrop-blur transition hover:bg-black/90 hover:text-white disabled:opacity-40"
            aria-label="Hapus foto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="text-xs text-white/35">
        JPG, PNG, atau gambar lainnya. Maksimal 5 MB.
      </p>
    </div>
  )
}