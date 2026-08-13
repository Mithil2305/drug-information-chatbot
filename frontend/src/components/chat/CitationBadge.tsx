import { FileText } from 'lucide-react'
import type { Citation } from '../../types/chat'

interface CitationBadgeProps {
  citation: Citation
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => alert(`Open source: ${citation.documentName}, page ${citation.page}`)}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-highlight px-2.5 py-1 text-xs font-medium text-fg transition-colors hover:border-primary hover:text-primary"
      aria-label={`Source: ${citation.documentName}, page ${citation.page}`}
    >
      <FileText className="h-3.5 w-3.5 text-ai" aria-hidden="true" />
      <span>Page {citation.page}</span>
    </button>
  )
}
