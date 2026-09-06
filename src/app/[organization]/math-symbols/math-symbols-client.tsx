'use client'

import {
  Check,
  Copy,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import {
  Card,
  CardContent,
} from '@/components/ui/card'

type SymbolColor =
  | 'sky'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'

type SymbolCategory = {
  title: string
  description: string
  color: SymbolColor
  symbols: string[]
}

const symbolCategories: SymbolCategory[] = [
  {
    title: 'Operasi',
    description:
      'Simbol operasi matematika dasar.',
    color: 'sky',
    symbols: [
      '+',
      '−',
      '×',
      '÷',
      '=',
      '≠',
      '±',
      '∓',
    ],
  },
  {
    title: 'Perbandingan',
    description:
      'Simbol untuk membandingkan nilai.',
    color: 'violet',
    symbols: [
      '<',
      '>',
      '≤',
      '≥',
      '≈',
      '≡',
      '∝',
      '∼',
    ],
  },
  {
    title: 'Aljabar',
    description:
      'Simbol yang sering digunakan dalam aljabar.',
    color: 'emerald',
    symbols: [
      '√',
      '∛',
      '∞',
      '∑',
      '∏',
      '∂',
      '∆',
      '∇',
    ],
  },
  {
    title: 'Geometri',
    description:
      'Simbol untuk konsep geometri.',
    color: 'amber',
    symbols: [
      '°',
      '∠',
      '⊥',
      '∥',
      '△',
      '□',
      '⌒',
      'π',
    ],
  },
  {
    title: 'Himpunan',
    description:
      'Simbol dasar teori himpunan.',
    color: 'rose',
    symbols: [
      '∈',
      '∉',
      '⊂',
      '⊆',
      '⊃',
      '⊇',
      '∪',
      '∩',
    ],
  },
  {
    title: 'Logika',
    description:
      'Simbol logika dan implikasi.',
    color: 'cyan',
    symbols: [
      '∧',
      '∨',
      '¬',
      '⇒',
      '⇔',
      '∀',
      '∃',
      '∴',
    ],
  },
]

const categoryStyles = {
  sky: {
    border:
      'border-sky-200 hover:border-sky-300',
    background:
      'bg-gradient-to-br from-sky-50/80 via-white to-white',
    icon:
      'border-sky-200 bg-sky-50 text-sky-600',
    symbol:
      'border-sky-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50',
  },

  violet: {
    border:
      'border-violet-200 hover:border-violet-300',
    background:
      'bg-gradient-to-br from-violet-50/80 via-white to-white',
    icon:
      'border-violet-200 bg-violet-50 text-violet-600',
    symbol:
      'border-violet-200 bg-white text-slate-800 hover:border-violet-300 hover:bg-violet-50',
  },

  emerald: {
    border:
      'border-emerald-200 hover:border-emerald-300',
    background:
      'bg-gradient-to-br from-emerald-50/80 via-white to-white',
    icon:
      'border-emerald-200 bg-emerald-50 text-emerald-600',
    symbol:
      'border-emerald-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50',
  },

  amber: {
    border:
      'border-amber-200 hover:border-amber-300',
    background:
      'bg-gradient-to-br from-amber-50/80 via-white to-white',
    icon:
      'border-amber-200 bg-amber-50 text-amber-600',
    symbol:
      'border-amber-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50',
  },

  rose: {
    border:
      'border-rose-200 hover:border-rose-300',
    background:
      'bg-gradient-to-br from-rose-50/80 via-white to-white',
    icon:
      'border-rose-200 bg-rose-50 text-rose-600',
    symbol:
      'border-rose-200 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50',
  },

  cyan: {
    border:
      'border-cyan-200 hover:border-cyan-300',
    background:
      'bg-gradient-to-br from-cyan-50/80 via-white to-white',
    icon:
      'border-cyan-200 bg-cyan-50 text-cyan-600',
    symbol:
      'border-cyan-200 bg-white text-slate-800 hover:border-cyan-300 hover:bg-cyan-50',
  },
} satisfies Record<
  SymbolColor,
  {
    border: string
    background: string
    icon: string
    symbol: string
  }
>

export function MathSymbolsClient() {
  const [copiedSymbol, setCopiedSymbol] =
    useState<string | null>(null)

  async function copySymbol(symbol: string) {
    try {
      await navigator.clipboard.writeText(symbol)

      setCopiedSymbol(symbol)

      window.setTimeout(() => {
        setCopiedSymbol(null)
      }, 1200)
    } catch {
      setCopiedSymbol(null)
    }
  }

  return (
    <>
      <section className="mt-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Koleksi Simbol
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Pilih simbol yang Anda perlukan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {symbolCategories.map((category) => {
            const styles =
              categoryStyles[category.color]

            return (
              <Card
                key={category.title}
                className={`${styles.border} ${styles.background} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <CardContent className="!p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {category.title}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-600">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {category.symbols.map((symbol) => {
                      const isCopied =
                        copiedSymbol === symbol

                      return (
                        <button
                          key={symbol}
                          type="button"
                          onClick={() =>
                            copySymbol(symbol)
                          }
                          title={
                            isCopied
                              ? 'Tersalin'
                              : `Salin ${symbol}`
                          }
                          className={`group relative flex h-14 items-center justify-center rounded-xl border transition-all duration-150 ${styles.symbol}`}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-xl font-medium text-slate-800 transition-transform group-hover:scale-110">
                              {symbol}
                            </span>
                          )}

                          <Copy className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Card className="mt-8 border-sky-200 bg-gradient-to-r from-sky-50 via-violet-50/50 to-white">
        <CardContent className="flex items-start gap-3 !p-5 sm:!p-6">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50">
            <Sparkles className="h-4 w-4 text-sky-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Tips
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Klik simbol yang Anda perlukan. Simbol akan
              langsung disalin sehingga dapat ditempelkan
              ke editor soal atau materi.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}