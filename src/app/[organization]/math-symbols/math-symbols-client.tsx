'use client'

import {
  Check,
  Copy,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'

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
      'border-sky-300/10 hover:border-sky-300/20',
    background: 'bg-sky-400/[0.035]',
    icon: 'bg-sky-400/10 text-sky-300',
    symbol:
      'border-sky-300/10 hover:border-sky-300/25 hover:bg-sky-400/10',
  },
  violet: {
    border:
      'border-violet-300/10 hover:border-violet-300/20',
    background: 'bg-violet-400/[0.035]',
    icon: 'bg-violet-400/10 text-violet-300',
    symbol:
      'border-violet-300/10 hover:border-violet-300/25 hover:bg-violet-400/10',
  },
  emerald: {
    border:
      'border-emerald-300/10 hover:border-emerald-300/20',
    background: 'bg-emerald-400/[0.035]',
    icon: 'bg-emerald-400/10 text-emerald-300',
    symbol:
      'border-emerald-300/10 hover:border-emerald-300/25 hover:bg-emerald-400/10',
  },
  amber: {
    border:
      'border-amber-300/10 hover:border-amber-300/20',
    background: 'bg-amber-400/[0.035]',
    icon: 'bg-amber-400/10 text-amber-300',
    symbol:
      'border-amber-300/10 hover:border-amber-300/25 hover:bg-amber-400/10',
  },
  rose: {
    border:
      'border-rose-300/10 hover:border-rose-300/20',
    background: 'bg-rose-400/[0.035]',
    icon: 'bg-rose-400/10 text-rose-300',
    symbol:
      'border-rose-300/10 hover:border-rose-300/25 hover:bg-rose-400/10',
  },
  cyan: {
    border:
      'border-cyan-300/10 hover:border-cyan-300/20',
    background: 'bg-cyan-400/[0.035]',
    icon: 'bg-cyan-400/10 text-cyan-300',
    symbol:
      'border-cyan-300/10 hover:border-cyan-300/25 hover:bg-cyan-400/10',
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
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Koleksi Simbol
          </h2>

          <p className="mt-1 text-sm text-white/35">
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
                className={`${styles.border} ${styles.background}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {category.title}
                      </h3>

                      <p className="mt-0.5 text-xs text-white/30">
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
                          className={`group relative flex h-14 items-center justify-center rounded-xl border bg-white/[0.02] transition-all duration-150 ${styles.symbol}`}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-300" />
                          ) : (
                            <span className="text-xl font-medium text-white/80 transition-transform group-hover:scale-110">
                              {symbol}
                            </span>
                          )}

                          <Copy className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 text-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
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

      <Card className="mt-8 border-sky-300/10 bg-gradient-to-r from-sky-400/[0.045] via-violet-400/[0.025] to-transparent">
        <CardContent className="flex items-start gap-3 p-5 sm:p-6">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

          <div>
            <p className="text-sm font-medium text-white/70">
              Tips
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
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