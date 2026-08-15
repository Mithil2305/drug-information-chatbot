import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { Document } from '../../types/document'

interface DeleteDocumentDialogProps {
  document: Document | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDocumentDialog({
  document,
  onCancel,
  onConfirm,
}: DeleteDocumentDialogProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-hover"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="text-[15px] font-semibold text-fg">
              Delete document?
            </h2>
            <p className="text-sm text-fg-muted">This action cannot be undone.</p>
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

        <p id="delete-dialog-desc" className="mb-6 text-sm text-fg-muted">
          Are you sure you want to delete{' '}
          <span className="font-medium text-fg">{document.name}</span>? It will
          no longer be available as a knowledge source.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-highlight"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-pill bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger/90"
          >
            Delete Document
          </button>
        </div>
      </div>



    </div>
  )
}




