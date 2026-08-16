import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, FileText, Maximize2, Minimize2, FileX, Download } from 'lucide-react'
import type { Document } from '../../types/document'
import { fetchDocumentFile, getDocumentViewUrl } from '../../api/viewer'
// @ts-ignore
import * as mammoth from 'mammoth'

interface DocumentViewerModalProps {
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

export function DocumentViewerModal({ document, open, onClose }: DocumentViewerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const docName = document?.name || document?.filename || 'Document'
  const fileType = useMemo(
    () => (document ? getFileType(document.filename || document.name) : 'unknown'),
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
          // Attempt mammoth conversion fallback for .doc or other formats
          try {
            const arrayBuffer = await blob.arrayBuffer()
            const result = await mammoth.convertToHtml({ arrayBuffer })
            if (result.value && result.value.trim().length > 0) {
              setHtml(result.value)
            } else {
              setError('Preview is not available for this file type. Please download the file to view it.')
            }
          } catch {
            setError('Preview is not available for legacy .doc format. Please download or convert to PDF/DOCX.')
          }
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
        isFullscreen ? '' : 'p-4'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`View ${docName}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden border border-border bg-surface shadow-hover transition-all duration-200 ${
          isFullscreen ? 'fixed inset-0 h-screen w-screen rounded-none' : 'h-[88vh] max-w-5xl rounded-3xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-surface/90">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="min-w-0 truncate text-sm font-bold text-fg" title={docName}>
                  {docName}
                </h2>
                <span className="rounded-pill bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary shrink-0">
                  {fileType.toUpperCase()} Document
                </span>
              </div>
              <p className="truncate text-[11px] text-fg-muted mt-0.5">
                {document.pageCount ? `${document.pageCount} pages` : 'Prescribing reference file'}
                {document.uploadedAt ? ` • Uploaded ${new Date(document.uploadedAt).toLocaleDateString()}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={getDocumentViewUrl(document.id)}
              download={document.filename || docName}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label="Download original document"
              title="Download original document"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 overflow-hidden bg-background p-4 flex flex-col">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2.5 text-fg-muted">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-xs font-semibold text-fg">Loading document…</span>
              <span className="text-[11px] text-fg-muted">Parsing {fileType.toUpperCase()} file contents</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-fg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-danger/10 text-danger">
                <FileX className="h-6 w-6" />
              </div>
              <p className="max-w-md text-sm font-semibold text-danger">{error}</p>
              <a
                href={getDocumentViewUrl(document.id)}
                download={document.filename || docName}
                className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Document</span>
              </a>
            </div>
          )}

          {!loading && !error && fileType === 'pdf' && pdfUrl && (
            <iframe
              title={docName}
              src={pdfUrl}
              className="h-full w-full rounded-2xl border border-border bg-white shadow-xs"
            />
          )}

          {!loading && !error && html && (
            <div className="h-full w-full overflow-y-auto rounded-2xl border border-border bg-white p-8 text-black shadow-xs">
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold">{docName}</span>
                  <span>Word Document Preview</span>
                </div>
                <div
                  className="prose prose-sm max-w-none leading-relaxed text-gray-800 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-50 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    window.document.body,
  )
}

export default DocumentViewerModal
