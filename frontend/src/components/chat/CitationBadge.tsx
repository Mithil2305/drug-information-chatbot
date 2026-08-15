import { FileText, CheckCircle2 } from 'lucide-react'
import type { Citation } from '../../types/chat'
import { useChat } from '../../hooks/useChat'

interface CitationBadgeProps {
  citation: Citation
  onClick?: () => void
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const { setSelectedCitation, selectedCitation } = useChat()
  const isSelected = selectedCitation?.citationId === citation.citationId

  return (
    <button
      type="button"
      onClick={() => setSelectedCitation(citation)}
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary text-white shadow-subtle'
          : 'border-border bg-surface text-fg hover:border-primary hover:text-primary'
      }`}
      aria-label={`Source: ${citation.documentName}, page ${citation.page}`}
    >
      <FileText className={`h-3.5 w-3.5 ${isSelected ? 'text-surface-warm' : 'text-accent'}`} />
      <span>
        {citation.documentName.slice(0, 14)}… p.{citation.page}
      </span>
      {citation.section && (
        <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-fg-muted'}`}>
          • {citation.section.slice(0, 16)}
        </span>
      )}
      <CheckCircle2 className={`h-3 w-3 ${isSelected ? 'text-emerald-300' : 'text-success'}`} />
    </button>
  )
}

export default CitationBadge
