import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, FileText, Maximize2, Minimize2 } from 'lucide-react'
import type { Document } from '../../types/document'
import { fetchDocumentFile } from '../../api/viewer'
// @ts-ignore
import * as mammoth from 'mammoth'

interface DocumentViewerModalProps {
  document: Document | null
  open: boolean
  onClose: () => void
}

function getFileType(filename: string): 'pdf' | 'docx' | 'doc' | 'unknown' {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'doc') return 'doc'
  return 'unknown'
}

export function DocumentViewerModal({ document, open, onClose }: DocumentViewerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const fileType = useMemo(() =>
    document ? getFileType(document.filename || document.name) : 'unknown',
    [document],
  )

  useEffect(() => {
    if (!open || !document) return

    let cancelled = false
    let objectUrl: string | null = null

    setLoading(true)
    setError(null)
    setHtml(null)
    setPdfUrl(null)

    const load = async () => {
      try {
        const blob = await fetchDocumentFile(document.id)

        if (cancelled) return

        if (fileType === 'pdf') {
          objectUrl = URL.createObjectURL(blob)
          setPdfUrl(objectUrl)
        } else if (fileType === 'docx') {
          const arrayBuffer = await blob.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setHtml(result.value)
        } else {
          // .doc and unknown types are not reliably renderable in the browser
          setError('Preview is not available for this file type. Please download the file to view it.')
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load document')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, document, fileType])

  if (!open || !document) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${isFullscreen ? '' : 'p-4'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`View ${document.name}`}
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
            <h2 className="min-w-0 truncate text-sm font-bold text-fg">{document.name}</h2>
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

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-surface p-4">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Loading document…</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-fg-muted">
              <p className="max-w-md text-sm text-danger">{error}</p>
            </div>
          )}

          {!loading && !error && fileType === 'pdf' && pdfUrl && (
            <iframe
              title={document.name}
              src={pdfUrl}
              className="h-full w-full rounded-xl border border-border bg-white"
            />
          )}

          {!loading && !error && fileType === 'docx' && html && (
            <div
              className="h-full w-full overflow-y-auto rounded-xl border border-border bg-white p-6 text-sm text-fg text-black"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>,
    window.document.body,
  )
}
