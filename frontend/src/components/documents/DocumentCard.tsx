import { useState } from 'react'
import { Check, Pencil, RefreshCw, Trash2, X } from 'lucide-react'

import { useDocuments } from '../../hooks/useDocuments'
import { formatDate, formatFileSize } from '../../utils/formatters'
import type { Document } from '../../types/document'
import { DocumentStatus } from './DocumentStatus'

interface DocumentCardProps {
  document: Document
  onDelete: (doc: Document) => void
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const { renameDocument } = useDocuments()
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(document.name)

  const commitRename = () => {
    renameDocument(document.id, name)
    setRenaming(false)
  }

  const cancelRename = () => {
    setName(document.name)
    setRenaming(false)
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-[8px] bg-surface p-4 border border-border transition-all hover:border-accent hover:bg-surface-raised select-none shadow-sm">
      {/* Top row: Icon Top-Left, Status Badge Top-Right */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent-tint text-accent border border-accent/25 shadow-sm">
          <span className="text-xs font-bold">▣</span>
        </div>
        <DocumentStatus status={document.status} />
      </div>


      {/* Center: Document Filename & Meta Line */}
      <div className="min-w-0 flex-1">
        {renaming ? (
          <div className="flex items-center gap-1 my-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') cancelRename()
              }}
              autoFocus
              className="w-full rounded-[6px] bg-surface-raised px-2.5 py-1 text-xs text-text-primary outline-none border border-accent font-sans"
            />
            <button
              type="button"
              onClick={commitRename}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-accent hover:bg-surface-raised cursor-pointer"
              aria-label="Save"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={cancelRename}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-raised cursor-pointer"
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div>
            <h3 
              className="truncate text-xs sm:text-sm font-semibold text-text-primary font-sans leading-tight group-hover:text-accent transition-colors" 
              title={document.name}
            >
              {document.name}
            </h3>
            <p className="font-mono text-[11px] text-text-muted mt-1">
              {document.filename}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Metadata & Action Footer */}
      <div className="mt-4 pt-2.5 flex items-center justify-between border-t border-border">
        <span className="font-mono text-[10px] text-text-muted">
          {document.fileSize ? formatFileSize(document.fileSize) : 'PDF'} · {formatDate(document.uploadedAt)}
        </span>

        <div className="flex items-center gap-1">
          {document.status === 'failed' && (
            <button
              type="button"
              onClick={() => alert(`Retrying ingestion for ${document.filename}...`)}
              className="flex items-center gap-1 rounded-[6px] bg-warning/10 px-2 py-0.5 text-[10px] font-mono text-warning hover:bg-warning/20 transition-colors border border-warning/20 cursor-pointer"
              title="Retry Ingestion"
            >
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Retry</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setRenaming(true)}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-surface-raised hover:text-text-primary transition-colors cursor-pointer"
            title="Rename"
            aria-label="Rename document"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(document)}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-surface-raised hover:text-danger transition-colors cursor-pointer"
            title="Delete"
            aria-label="Delete document"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>


  )
}








