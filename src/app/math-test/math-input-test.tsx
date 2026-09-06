'use client'

import { useRef, useState } from 'react'
import { MathInput, MathInputRef } from '@/components/math/math-input'
import { MathSymbolPicker } from '@/components/math/math-symbol-picker'

export function MathInputTest() {
  const [value, setValue] = useState('')
  const mathInputRef = useRef<MathInputRef | null>(null)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-6">
        <div className="mb-3">
          <h2 className="text-sm font-medium text-white">
            Jawaban Matematika
          </h2>

          <p className="mt-1 text-xs text-white/40">
            Gunakan keyboard atau pilih simbol matematika.
          </p>
        </div>

        <MathInput
          ref={mathInputRef}
          value={value}
          onChange={setValue}
          placeholder="Contoh: x² + 2x + 1 = 0"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-6">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-white">
            Simbol Matematika
          </h2>

          <p className="mt-1 text-xs text-white/40">
            Klik simbol untuk memasukkannya ke jawaban.
          </p>
        </div>

        <MathSymbolPicker
          mathInputRef={mathInputRef}
        />
      </div>

      <div className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">
          LaTeX Value
        </p>

        <div className="min-h-12 rounded-xl border border-white/[0.08] bg-black/20 p-4">
          <code className="break-all text-sm text-white/70">
            {value || '(belum ada input)'}
          </code>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setValue('')
          mathInputRef.current?.insert('')
        }}
        className="rounded-xl border border-white/[0.10] bg-white/[0.05] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.08] hover:text-white"
      >
        Bersihkan
      </button>
    </div>
  )
}