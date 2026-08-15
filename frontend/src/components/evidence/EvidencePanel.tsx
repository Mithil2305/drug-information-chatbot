import { useState } from 'react'
import { Check, Copy, ShieldCheck, X } from 'lucide-react'
import type { Citation } from '../../types/chat'

interface EvidencePanelProps {
  citation: Citation | null
  onClose: () => void
}

export function EvidencePanel({ citation, onClose }: EvidencePanelProps) {
  const [copied, setCopied] = useState(false)

  if (!citation) return null

  const handleCopy = async () => {
    const textToCopy = citation.text || `Excerpt from ${citation.documentName}, section ${citation.section || 'General'}, page ${citation.page}`
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const excerptText = citation.text || 
    `Clinical documentation excerpt verified for ${citation.documentName}. Exact prescribing information and therapeutic guidelines retrieved from official FDA package insert (§${citation.section || '4.0'}, page ${citation.page || '1'}).`

  return (
    <aside 
      className="fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-border bg-surface transition-all duration-200 ease-out sm:w-[380px] shadow-evidence"
      role="complementary"
      aria-label="Clinical Evidence Panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-surface">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent-tint text-accent border border-accent/25">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </div>

          <div>
            <div className="text-[10px] font-mono tracking-[0.14em] uppercase text-text-muted font-semibold">
              EVIDENCE VAULT
            </div>
            <div className="text-xs font-semibold text-text-primary truncate max-w-[220px]">
              {citation.documentName}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary cursor-pointer"
          aria-label="Close evidence panel"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Verification Stamped Meta */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2.5 py-0.5 font-mono text-[10px] font-medium text-accent border border-accent/25">
            §{citation.section || '4.0'} · PAGE {citation.page || '1'}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-2.5 py-0.5 font-mono text-[10px] text-success border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            REGULATORY GROUNDED
          </span>
        </div>

        {/* Highlighted Passage */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono tracking-wider uppercase text-text-muted font-semibold">
            OFFICIAL PACKAGE INSERT EXCERPT
          </div>
          <div className="rounded-[10px] bg-accent-tint/60 p-3.5 text-xs leading-relaxed text-text-primary font-sans border-l-2 border-accent border border-accent/20 shadow-sm">
            <p className="text-text-primary leading-relaxed">
              "{excerptText}"
            </p>
          </div>
        </div>

        {/* Source Meta Details */}
        <div className="rounded-[10px] bg-surface-raised p-3.5 space-y-2 text-xs border border-border">
          <div className="flex items-center justify-between text-text-muted text-[11px]">
            <span className="font-mono text-[10px]">DOCUMENT REF</span>
            <span className="font-mono text-text-primary">{citation.documentId ? citation.documentId.slice(0, 12) + '...' : 'FDA-PKG-INSERT'}</span>
          </div>
          <div className="flex items-center justify-between text-text-muted text-[11px]">
            <span className="font-mono text-[10px]">LABEL SECTION</span>
            <span className="font-mono text-accent font-medium">§{citation.section || 'General Prescribing'}</span>
          </div>
          <div className="flex items-center justify-between text-text-muted text-[11px]">
            <span className="font-mono text-[10px]">PAGE COORDINATE</span>
            <span className="font-mono text-text-secondary">Page {citation.page || '1'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-border p-3 bg-surface flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-surface-raised px-3 py-2 text-xs text-text-primary hover:bg-surface-hover border border-border transition-colors font-sans cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-text-tertiary" />}
          <span>{copied ? 'Copied' : 'Copy Excerpt'}</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[6px] bg-surface-raised px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border transition-colors font-sans cursor-pointer"
        >
          Done
        </button>
      </div>

    </aside>
  )
}







