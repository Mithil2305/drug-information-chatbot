import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-hover"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="text-base font-semibold text-fg">
              Delete document?
            </h2>
            <p className="text-sm text-fg-muted">This action cannot be undone.</p>
          </div>
        </div>
        <p className="mb-6 text-sm text-fg-muted">
          Are you sure you want to delete <span className="font-medium text-fg">{document.name}</span>? It will no longer be available as a chatbot knowledge source.
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
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
