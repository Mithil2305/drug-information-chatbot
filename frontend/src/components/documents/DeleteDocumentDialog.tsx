import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { Document } from '../../types/document'

interface DeleteDocumentDialogProps {
  document: Document | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDocumentDialog({ document, onCancel, onConfirm }: DeleteDocumentDialogProps) {
  useEffect(() => {
    if (!document) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [document, onCancel])

  if (!document) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        className="absolute inset-0"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-[10px] border border-border bg-surface-raised p-6 shadow-console"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-danger/10 text-danger border border-danger/20">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="delete-dialog-title" className="font-sans text-sm font-semibold text-text-primary">
                Remove document from repository?
              </h2>
              <p className="text-[10px] font-mono text-text-muted">This action cannot be undone.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-text-muted transition-colors hover:bg-surface hover:text-text-primary cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="my-4 text-xs leading-relaxed text-text-secondary font-sans">
          Are you sure you want to remove <strong className="font-semibold text-text-primary">{document.name}</strong>? Grounded citations linking to this package insert will no longer resolve.
        </p>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[6px] bg-surface px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-border transition-colors font-sans cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[6px] bg-danger px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors font-sans shadow-sm cursor-pointer"
          >
            Delete Document
          </button>
        </div>
      </div>



    </div>
  )
}




