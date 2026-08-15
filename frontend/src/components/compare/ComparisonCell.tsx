import { AlertTriangle } from 'lucide-react'
import type { ComparisonCell as ComparisonCellType, ComparisonCitation } from '../../types/comparison'
import { ComparisonCitationBadge } from './ComparisonCitationBadge'

interface ComparisonCellProps {
  cell: ComparisonCellType
  onCitationClick?: (citation: ComparisonCitation) => void
}

export function ComparisonCell({ cell, onCitationClick }: ComparisonCellProps) {
  const isUnavailable = cell.status === 'unavailable' || (!cell.content && cell.citations.length === 0)
  const isWarning = cell.status === 'warning'
  const isHighlight = cell.status === 'highlight'

  return (
    <td
      className={`border-b border-border/60 px-4 py-4 align-top text-sm leading-6 transition-colors duration-150 ${
        isWarning
          ? 'bg-warning/5'
          : isHighlight
            ? 'bg-primary/[0.03]'
            : ''
      }`}
    >
      {isUnavailable ? (
        <p className="italic text-fg-muted text-[13px]">Not available in source document.</p>
      ) : (
        <div className="space-y-2">
          {isWarning && (
            <div className="flex items-start gap-1.5 text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Warning</span>
            </div>
          )}
          <p className="text-fg text-[14px] leading-6">{cell.content}</p>
          {cell.citations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cell.citations.map((c) => (
                <ComparisonCitationBadge
                  key={c.citationId}
                  citation={c}
                  onClick={onCitationClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </td>
  )
}

export default ComparisonCell
