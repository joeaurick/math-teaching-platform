'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import 'mathlive'

type MathFieldElement = HTMLElement & {
  value: string
  executeCommand: (
    command: string,
    ...args: unknown[]
  ) => boolean
}

type MathFieldConstructor = {
  fontsDirectory: string | null
}

export type MathInputRef = {
  insert: (latex: string) => void
  focus: () => void
}

type MathInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const MathInput = forwardRef<MathInputRef, MathInputProps>(
  function MathInput(
    {
      value,
      onChange,
      placeholder = 'Masukkan jawaban matematika...',
      disabled = false,
      className = '',
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mathFieldRef = useRef<MathFieldElement | null>(null)

    useImperativeHandle(ref, () => ({
      insert(latex: string) {
        const mathField = mathFieldRef.current

        if (!mathField) return

        mathField.executeCommand('insert', latex)
        mathField.focus()
      },

      focus() {
        mathFieldRef.current?.focus()
      },
    }))

    useEffect(() => {
      if (!containerRef.current) return

      const MathField = customElements.get(
        'math-field',
      ) as unknown as MathFieldConstructor | undefined

      if (MathField) {
        MathField.fontsDirectory = '/mathlive/fonts/'
      }

      const mathField = document.createElement(
        'math-field',
      ) as MathFieldElement

      mathField.setAttribute('virtual-keyboard-mode', 'manual')
      mathField.setAttribute('smart-mode', 'true')
      mathField.setAttribute('placeholder', placeholder)

      mathField.style.display = 'block'
      mathField.style.width = '100%'
      mathField.style.minHeight = '48px'
      mathField.style.padding = '12px 14px'
      mathField.style.border =
        '1px solid rgba(255, 255, 255, 0.12)'
      mathField.style.borderRadius = '12px'
      mathField.style.background =
        'rgba(255, 255, 255, 0.04)'
      mathField.style.color = 'white'
      mathField.style.fontSize = '18px'
      mathField.style.boxSizing = 'border-box'

      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(mathField)

      mathFieldRef.current = mathField

      const handleInput = () => {
        onChange(mathField.value)
      }

      mathField.addEventListener('input', handleInput)

      return () => {
        mathField.removeEventListener('input', handleInput)
        mathFieldRef.current = null
      }
    }, [onChange, placeholder])

    useEffect(() => {
      const mathField = mathFieldRef.current

      if (!mathField) return

      if (mathField.value !== value) {
        mathField.value = value
      }

      mathField.toggleAttribute('disabled', disabled)
    }, [value, disabled])

    return (
      <div
        ref={containerRef}
        className={className}
      />
    )
  },
)