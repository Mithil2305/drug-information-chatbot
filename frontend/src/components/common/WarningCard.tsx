import React from 'react'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

export interface WarningCardProps {
  title: string
  children: React.ReactNode
  type?: 'warning' | 'danger' | 'info'
  sourceLink?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function WarningCard({
  title,
  children,
  type = 'warning',
  sourceLink,
  className = '',
}: WarningCardProps) {
  const styles = {
    warning: {
      container: 'border-warning/30 bg-warning/5 text-fg',
      iconBg: 'bg-warning/10 text-warning',
      Icon: AlertTriangle,
      title: 'text-warning font-semibold',
    },
    danger: {
      container: 'border-danger/30 bg-danger/5 text-fg',
      iconBg: 'bg-danger/10 text-danger',
      Icon: AlertCircle,
      title: 'text-danger font-semibold',
    },
    info: {
      container: 'border-accent/30 bg-accent/5 text-fg',
      iconBg: 'bg-accent/10 text-accent',
      Icon: Info,
      title: 'text-primary font-semibold',
    },
  }[type]

  const IconComponent = styles.Icon

  return (
    <div className={`rounded-lg border p-4.5 transition-all ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-pill ${styles.iconBg}`}>
          <IconComponent className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm ${styles.title}`}>{title}</h4>
          <div className="mt-1 text-xs leading-relaxed text-fg-secondary">
            {children}
          </div>
          {sourceLink && (
            <button
              type="button"
              onClick={sourceLink.onClick}
              className="mt-2.5 inline-flex items-center text-xs font-semibold text-accent hover:underline"
            >
              [{sourceLink.label}]
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WarningCard
