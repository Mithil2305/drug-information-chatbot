import { FileText, X } from 'lucide-react'
import type { Document } from '../../types/document'

interface SelectedDocChipsProps {
  selectedDocs: Document[]
  allSelected: boolean
  onClearAll: () => void
  onRemoveDoc: (id: string) => void
}

export function SelectedDocChips({
  selectedDocs,
  allSelected,
  onClearAll,
  onRemoveDoc,
}: SelectedDocChipsProps) {
  if (selectedDocs.length === 0) return null

  return (
    <div className="mb-1.5 flex flex-wrap gap-1.5 px-0.5">
      {allSelected ? (
        <span className="flex h-7 items-center gap-1.5 rounded-lg bg-primary/10 py-1 pr-1 pl-2 text-[11.5px] font-medium text-primary animate-fade-in">
          <FileText className="h-3 w-3 shrink-0" />
          <span>All documents</span>
          <button
            type="button"
            aria-label="Clear selection"
            onClick={onClearAll}
            className="flex h-4 w-4 items-center justify-center rounded text-primary/60 transition-colors hover:bg-primary/20 hover:text-primary"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ) : (
        selectedDocs.map((doc) => (
          <span
            key={doc.id}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-surface-highlight py-1 pr-1 pl-2 text-[11.5px] text-fg-muted animate-fade-in"
          >
            <FileText className="h-3 w-3 shrink-0 text-accent" />
            <span className="max-w-36 truncate">{doc.name}</span>
            <button
              type="button"
              aria-label={`Remove ${doc.name}`}
              onClick={() => onRemoveDoc(doc.id)}
              className="flex h-4 w-4 items-center justify-center rounded text-fg-muted transition-colors hover:bg-border hover:text-fg"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))
      )}
    </div>
  )
}

interface AttachmentChipsProps {
  attachments: string[]
  onRemove: (index: number) => void
}

export function AttachmentChips({ attachments, onRemove }: AttachmentChipsProps) {
  if (attachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5 px-0.5">
      {attachments.map((file, i) => (
        <span
          key={`${file}-${i}`}
          className="flex h-7 items-center gap-1.5 rounded-lg bg-surface-highlight py-1 pr-1 pl-2 text-[11.5px] text-fg-muted animate-fade-in"
        >
          <FileText className="h-3 w-3 shrink-0 text-accent" />
          <span className="max-w-36 truncate">{file}</span>
          <button
            type="button"
            aria-label={`Remove ${file}`}
            onClick={() => onRemove(i)}
            className="flex h-4 w-4 items-center justify-center rounded text-fg-muted transition-colors hover:bg-border hover:text-fg"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
    </div>
  )
}
