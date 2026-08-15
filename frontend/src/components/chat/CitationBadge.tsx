import { FileText } from 'lucide-react'
import type { Citation } from '../../types/chat'

interface CitationBadgeProps {
  citation: Citation
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const docName = citation.documentName
    ? citation.documentName.length > 20
      ? citation.documentName.slice(0, 20) + '…'
      : citation.documentName
    : null

  return (
    <button
      type="button"
      onClick={() =>
        alert(`Open source: ${citation.documentName}, page ${citation.page}`)
      }
      role="listitem"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-highlight px-2.5 py-1 text-xs font-medium text-fg-muted transition-all hover:border-primary/40 hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Source: ${citation.documentName}, page ${citation.page}. Click to open.`}
    >
      <FileText className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
      {docName && (
        <span className="hidden sm:inline">{docName} · </span>
      )}
      <span>Page {citation.page}</span>
    </button>
  )
}
