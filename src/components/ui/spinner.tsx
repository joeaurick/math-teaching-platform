import * as React from 'react'

import { cn } from '@/lib/utils'

type SpinnerProps = React.SVGAttributes<SVGSVGElement>

export function Spinner({
  className,
  ...props
}: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        'h-4 w-4 animate-spin',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        className="stroke-current opacity-20"
        strokeWidth="2"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}