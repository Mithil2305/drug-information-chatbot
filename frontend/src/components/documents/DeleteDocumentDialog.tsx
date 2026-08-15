import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
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
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-xl border border-line bg-surface-raised p-6 shadow-xl animate-fade-in"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
            <AlertTriangle className="h-4.5 w-4.5 h-[18px] w-[18px] text-danger" aria-hidden="true" />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="text-[15px] font-semibold text-fg">
              Delete document?
            </h2>
            <p className="text-sm text-fg-muted">This action cannot be undone.</p>
          </div>
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
            className="h-9 rounded-lg border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-lg bg-danger px-4 text-sm font-medium text-white transition-colors hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
