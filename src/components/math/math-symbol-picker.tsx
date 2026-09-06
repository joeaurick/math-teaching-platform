'use client'

import { MathInputRef } from './math-input'

type MathSymbol = {
  label: string
  latex: string
  title: string
}

type MathSymbolGroup = {
  label: string
  symbols: MathSymbol[]
}

const symbolGroups: MathSymbolGroup[] = [
  {
    label: 'Dasar',
    symbols: [
      {
        label: '+',
        latex: '+',
        title: 'Tambah',
      },
      {
        label: '−',
        latex: '-',
        title: 'Kurang',
      },
      {
        label: '×',
        latex: '\\times',
        title: 'Kali',
      },
      {
        label: '÷',
        latex: '\\div',
        title: 'Bagi',
      },
      {
        label: '=',
        latex: '=',
        title: 'Sama dengan',
      },
      {
        label: '≠',
        latex: '\\ne',
        title: 'Tidak sama dengan',
      },
      {
        label: '≈',
        latex: '\\approx',
        title: 'Hampir sama dengan',
      },
    ],
  },
  {
    label: 'Perbandingan',
    symbols: [
      {
        label: '<',
        latex: '<',
        title: 'Lebih kecil',
      },
      {
        label: '>',
        latex: '>',
        title: 'Lebih besar',
      },
      {
        label: '≤',
        latex: '\\le',
        title: 'Lebih kecil atau sama dengan',
      },
      {
        label: '≥',
        latex: '\\ge',
        title: 'Lebih besar atau sama dengan',
      },
      {
        label: '±',
        latex: '\\pm',
        title: 'Plus minus',
      },
    ],
  },
  {
    label: 'Pangkat & Akar',
    symbols: [
      {
        label: 'x²',
        latex: '^{2}',
        title: 'Pangkat dua',
      },
      {
        label: 'xⁿ',
        latex: '^{}',
        title: 'Pangkat',
      },
      {
        label: '√',
        latex: '\\sqrt{}',
        title: 'Akar kuadrat',
      },
      {
        label: '∛',
        latex: '\\sqrt[3]{}',
        title: 'Akar pangkat tiga',
      },
      {
        label: '½',
        latex: '\\frac{1}{2}',
        title: 'Setengah',
      },
      {
        label: 'a⁄b',
        latex: '\\frac{}{}',
        title: 'Pecahan',
      },
    ],
  },
  {
    label: 'Geometri',
    symbols: [
      {
        label: '°',
        latex: '^\\circ',
        title: 'Derajat',
      },
      {
        label: '∠',
        latex: '\\angle',
        title: 'Sudut',
      },
      {
        label: '△',
        latex: '\\triangle',
        title: 'Segitiga',
      },
      {
        label: '⊥',
        latex: '\\perp',
        title: 'Tegak lurus',
      },
      {
        label: '∥',
        latex: '\\parallel',
        title: 'Sejajar',
      },
    ],
  },
  {
    label: 'Greek',
    symbols: [
      {
        label: 'α',
        latex: '\\alpha',
        title: 'Alpha',
      },
      {
        label: 'β',
        latex: '\\beta',
        title: 'Beta',
      },
      {
        label: 'γ',
        latex: '\\gamma',
        title: 'Gamma',
      },
      {
        label: 'θ',
        latex: '\\theta',
        title: 'Theta',
      },
      {
        label: 'π',
        latex: '\\pi',
        title: 'Pi',
      },
      {
        label: 'Δ',
        latex: '\\Delta',
        title: 'Delta',
      },
    ],
  },
  {
    label: 'Lainnya',
    symbols: [
      {
        label: '∞',
        latex: '\\infty',
        title: 'Tak hingga',
      },
      {
        label: 'Σ',
        latex: '\\sum',
        title: 'Sigma',
      },
      {
        label: '∫',
        latex: '\\int',
        title: 'Integral',
      },
    ],
  },
]

type MathSymbolPickerProps = {
  mathInputRef: React.RefObject<MathInputRef | null>
}

export function MathSymbolPicker({
  mathInputRef,
}: MathSymbolPickerProps) {
  return (
    <div className="space-y-4">
      {symbolGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-medium text-white/40">
            {group.label}
          </p>

          <div className="flex flex-wrap gap-2">
            {group.symbols.map((symbol) => (
              <button
                key={`${group.label}-${symbol.label}`}
                type="button"
                title={symbol.title}
                onClick={() => {
                  mathInputRef.current?.insert(symbol.latex)
                }}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-base text-white/75 transition hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white active:scale-[0.97]"
              >
                {symbol.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}