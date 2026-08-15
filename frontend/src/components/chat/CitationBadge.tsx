import { useState } from 'react'
import type { Citation } from '../../types/chat'


interface CitationBadgeProps {
  citation: Citation
  onClick?: () => void
}

export function CitationBadge({ citation, onClick }: CitationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const pageLabel = `PAGE ${citation.page || '1'}`
  const sectionLabel = citation.section ? `§${citation.section} · ` : ''

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="group inline-flex items-center gap-2.5 rounded-[6px] bg-surface-raised px-3 py-1.5 text-xs text-text-primary transition-all hover:border-[#22D3E8]/50 hover:bg-surface border border-border shadow-sm cursor-pointer"
        aria-label={`Citation reference: ${citation.documentName}, ${sectionLabel}${pageLabel}`}
      >
        <span className="text-[#22D3E8] text-xs">▣</span>

        <span className="font-semibold text-text-primary font-sans truncate max-w-[180px] sm:max-w-[220px]">
          {citation.documentName}
        </span>

        <span className="font-mono text-[11px] text-text-tertiary font-medium">
          {sectionLabel}{pageLabel}
        </span>

        <span className="text-text-tertiary group-hover:text-[#22D3E8] group-hover:translate-x-0.5 transition-all font-bold">
          →
        </span>
      </button>

      {showTooltip && (
        <div 
          role="tooltip" 
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 whitespace-nowrap rounded-[6px] border border-border bg-surface-elevated px-3 py-2 text-[11px] font-sans text-text-primary shadow-console"
        >

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#22D3E8] font-bold">
            <span>SOURCE DOCUMENT:</span>
            <span className="text-text-primary font-medium">{citation.documentName}</span>
          </div>

          <div className="text-[11px] text-text-secondary truncate max-w-[280px] mt-0.5 font-sans">
            {citation.text || `Verified excerpt from ${pageLabel}`}
          </div>
        </div>
      )}
    </div>
  )
}






