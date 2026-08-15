import type { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'right' | 'top' | 'bottom' | 'left'
}

/**
 * Lightweight CSS-only tooltip wrapper.
 * Shows a tooltip on hover/focus of the child element.
 */
export function Tooltip({ content, children, side = 'right' }: TooltipProps) {
  const sideClasses: Record<string, string> = {
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  }

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className={`
          pointer-events-none absolute z-50 whitespace-nowrap
          rounded-md border border-line bg-surface-raised px-2 py-1
          text-xs font-medium text-fg shadow-sm
          opacity-0 transition-opacity duration-150
          group-hover:opacity-100 group-focus-within:opacity-100
          ${sideClasses[side] ?? sideClasses.right}
        `}
      >
        {content}
      </div>
    </div>
  )
}
