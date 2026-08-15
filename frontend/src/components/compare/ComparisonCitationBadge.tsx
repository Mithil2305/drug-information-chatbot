import { FileText, CheckCircle2 } from 'lucide-react'
import type { ComparisonCitation } from '../../types/comparison'

interface ComparisonCitationBadgeProps {
  citation: ComparisonCitation
  onClick?: (citation: ComparisonCitation) => void
}

export function ComparisonCitationBadge({ citation, onClick }: ComparisonCitationBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(citation)}
      className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-fg transition-all duration-150 hover:border-primary hover:text-primary"
      aria-label={`Source: ${citation.documentName}, page ${citation.page}`}
    >
      <FileText className="h-3 w-3 text-accent" />
      <span>Page {citation.page}</span>
      <CheckCircle2 className="h-2.5 w-2.5 text-success" />
    </button>
  )
}

export default ComparisonCitationBadge
