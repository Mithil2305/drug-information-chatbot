import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { FileText, ArrowLeft, BookOpen, MessageSquare } from 'lucide-react'
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

  const readyCount = documents.filter((d) => d.status === 'ready').length

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteDocument(pendingDelete.id)
    toast.success(`Deleted "${pendingDelete.name}"`)
    setPendingDelete(null)
  }

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-fg-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
                <span className="text-xs text-fg-muted">•</span>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Prescribing Documents
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Pharmaceutical Label Documents
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-fg-secondary">
                Uploaded FDA prescribing information PDFs are parsed, chunked, and vectorized in Qdrant for grounded question answering.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/drugs"
                className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary transition-all"
              >
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                <span>Drug Library</span>
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-white shadow-card hover:bg-primary-hover transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Open Chat</span>
              </Link>
            </div>
          </div>

          {/* Upload Area */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h2 className="text-sm font-bold text-primary mb-3">Upload Approved Drug Label (PDF)</h2>
            <DocumentUpload />
          </div>

          {/* Search & List */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Repository Labels ({readyCount} Active)
                </h2>
              </div>
              <DocumentSearch />
            </div>

            <DocumentList onDelete={setPendingDelete} />
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
