import { useState } from 'react'
import { toast } from 'sonner'
import { ChatLayout } from '../components/layout/ChatLayout'
import { DeleteDocumentDialog } from '../components/documents/DeleteDocumentDialog'
import { DocumentList } from '../components/documents/DocumentList'
import { DocumentSearch } from '../components/documents/DocumentSearch'
import { DocumentUpload } from '../components/documents/DocumentUpload'
import { useDocuments } from '../hooks/useDocuments'
import type { Document } from '../types/document'

export default function DocumentsPage() {
  const { deleteDocument, documents } = useDocuments()
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null)

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteDocument(pendingDelete.id)
    toast.success(`Deleted "${pendingDelete.name}"`)
    setPendingDelete(null)
  }

  return (
    <ChatLayout title="Manage Documents">
      <div className="relative flex-1 overflow-y-auto bg-canvas bg-dot-pattern">
        {/* Ambient Scientific Linework Overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25 dark:opacity-10 select-none" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="doc-trace-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3E8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38EDFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d="M -60 200 C 240 180, 420 360, 900 260" fill="none" stroke="url(#doc-trace-grad-1)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="420" cy="360" r="2.5" fill="#22D3E8" fillOpacity="0.5" />
            <circle cx="900" cy="260" r="3" fill="#22D3E8" fillOpacity="0.6" />
          </svg>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 relative z-10">
          {/* Plain Text Header */}
          <header className="mb-6">
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Document Repository
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Manage approved drug labels and clinical documentation for verified intelligence queries.
            </p>
          </header>

          {/* Upload Drop Zone */}
          <div className="mb-6">
            <DocumentUpload />
          </div>

          {/* Real Computed Stat Counters (§3 & §4) */}
          {documents.length > 0 && (
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-[8px] bg-surface p-3.5 border border-border shadow-sm">
                <div className="text-[10px] font-mono text-text-tertiary">TOTAL DOCUMENTS</div>
                <div className="text-xl font-bold text-text-primary mt-1">{documents.length}</div>
              </div>
              <div className="rounded-[8px] bg-surface p-3.5 border border-border shadow-sm">
                <div className="text-[10px] font-mono text-text-tertiary">VERIFIED</div>
                <div className="text-xl font-bold text-[#3FCB78] mt-1">{documents.filter(d => d.status === 'ready').length}</div>
              </div>
              <div className="rounded-[8px] bg-surface p-3.5 border border-border shadow-sm">
                <div className="text-[10px] font-mono text-text-tertiary">ANALYZING</div>
                <div className="text-xl font-bold text-[#E0A83C] mt-1">{documents.filter(d => d.status === 'processing').length}</div>
              </div>
              <div className="rounded-[8px] bg-surface p-3.5 border border-border shadow-sm">
                <div className="text-[10px] font-mono text-text-tertiary">FAILED</div>
                <div className="text-xl font-bold text-[#E0554F] mt-1">{documents.filter(d => d.status === 'failed').length}</div>
              </div>
            </div>
          )}

          {/* Table Header & Search Bar */}
          <div className="mb-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary font-sans">
                Uploaded Documents
              </span>
              <span className="text-[11px] font-mono text-text-tertiary">
                ({documents.length})
              </span>
            </div>
            <DocumentSearch />
          </div>

          {/* Document Table List */}
          <DocumentList onDelete={setPendingDelete} />

          {/* Bottom Footer */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-4 text-[10.5px] font-mono text-text-tertiary">
            <span>LABELPROOF PLATFORM v2.4</span>
            <span className="text-[#3FCB78] flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3FCB78]" />
              Regulatory Verified
            </span>
          </div>

        </div>
      </div>








      <DeleteDocumentDialog
        document={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </ChatLayout>
  )
}

