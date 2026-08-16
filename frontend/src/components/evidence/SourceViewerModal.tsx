import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, FileText, Maximize2, Minimize2, FileX } from 'lucide-react'
import { fetchDocumentFile } from '../../api/viewer'
import type { Citation } from '../../types/chat'
import type { Document } from '../../types/document'

interface SourceViewerModalProps {
  citation: Citation | null
  document: Document | null
  open: boolean
  onClose: () => void
}

function getFileType(filename?: string): 'pdf' | 'docx' | 'doc' | 'unknown' {
  if (!filename) return 'unknown'
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'doc') return 'doc'
  return 'unknown'
}

export function SourceViewerModal({ citation, document, open, onClose }: SourceViewerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const fileType = document ? getFileType(document.filename) : 'unknown'

  useEffect(() => {
    if (!open || !citation || !document) return

    let cancelled = false
    let objectUrl: string | null = null

    setLoading(true)
    setError(null)
    setPdfUrl(null)

    const load = async () => {
      try {
        const blob = await fetchDocumentFile(document.id)
        if (cancelled) return

        if (fileType !== 'pdf') {
          setError(
            'Source page preview is currently available for PDF labels. DOCX/DOC sources can be opened from the Documents page.',
          )
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load the source document')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, citation, document, fileType])

  if (!open || !citation) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
        isFullscreen ? '' : 'p-4'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`View source: ${citation.documentName}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden border border-border bg-surface shadow-hover transition-all duration-200 ${
          isFullscreen ? 'fixed inset-0 h-screen w-screen rounded-none' : 'h-[85vh] max-w-5xl rounded-2xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <FileText className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <h2 className="min-w-0 truncate text-sm font-bold text-fg">
                {document?.name || citation.documentName}
              </h2>
              <p className="truncate text-[11px] text-fg-muted">
                Page {citation.page}
                {citation.section ? ` — ${citation.section}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="relative flex-1 overflow-hidden bg-surface p-4">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Loading source…</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-fg-muted">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-highlight text-danger">
                <FileX className="h-5 w-5" />
              </div>
              <p className="max-w-md text-sm text-danger">{error}</p>
            </div>
          )}

          {!loading && !error && fileType === 'pdf' && pdfUrl && (
            <iframe
              title={document?.name || citation.documentName}
              src={`${pdfUrl}#page=${citation.page}`}
              className="h-full w-full rounded-xl border border-border bg-white"
            />
          )}

          {!document && !loading && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-fg-muted">
              <p className="text-sm">Document not found. The file may have been deleted or is still processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    window.document.body,
  )
}
