'use client'

import { useRef, useState } from 'react'
import {
  Camera,
  ImagePlus,
  X,
} from 'lucide-react'

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
  const galleryInputRef =
    useRef<HTMLInputElement | null>(null)

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null)

  const [error, setError] = useState('')

  function handleSelect(
    file: File | undefined,
  ) {
    setError('')

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(
        'File harus berupa gambar.',
      )
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        'Ukuran gambar maksimal 5 MB.',
      )
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const url =
      URL.createObjectURL(file)

    setPreviewUrl(url)
    onChange(file)
  }

  function handleRemove() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(null)
    onChange(null)

    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  function openGallery() {
    if (disabled) {
      return
    }

    galleryInputRef.current?.click()
  }

  function openCamera() {
    if (disabled) {
      return
    }

    cameraInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* ================================================== */}
      {/* HIDDEN INPUT - GALLERY                            */}
      {/* ================================================== */}

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleSelect(
            event.target.files?.[0],
          )
        }}
      />

      {/* ================================================== */}
      {/* HIDDEN INPUT - CAMERA                             */}
      {/* ================================================== */}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleSelect(
            event.target.files?.[0],
          )
        }}
      />

      {!value ? (
        <div className="space-y-3">
          {/* ============================================== */}
          {/* CAMERA + GALLERY                              */}
          {/* ============================================== */}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={disabled}
              onClick={openCamera}
              className="group flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sky-300/15 bg-sky-400/[0.035] px-4 py-5 text-center transition hover:border-sky-300/30 hover:bg-sky-400/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10 transition group-hover:scale-105">
                <Camera className="h-5 w-5 text-sky-300" />
              </span>

              <span>
                <span className="block text-sm font-medium text-white/75">
                  Ambil dari Kamera
                </span>

                <span className="mt-1 block text-xs text-white/30">
                  Foto langsung
                </span>
              </span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={openGallery}
              className="group flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-300/15 bg-violet-400/[0.035] px-4 py-5 text-center transition hover:border-violet-300/30 hover:bg-violet-400/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 transition group-hover:scale-105">
                <ImagePlus className="h-5 w-5 text-violet-300" />
              </span>

              <span>
                <span className="block text-sm font-medium text-white/75">
                  Pilih dari Galeri
                </span>

                <span className="mt-1 block text-xs text-white/30">
                  Pilih foto yang sudah ada
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ================================================== */
        /* IMAGE PREVIEW                                      */
        /* ================================================== */

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-white/[0.03]">
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