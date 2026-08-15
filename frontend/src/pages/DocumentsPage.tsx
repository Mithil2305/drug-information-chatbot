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
  const { deleteDocument } = useDocuments()
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null)

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteDocument(pendingDelete.id)
    toast.success(`Deleted "${pendingDelete.name}"`)
    setPendingDelete(null)
  }

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-fg">
              Manage Documents
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
              Uploaded approved drug-label documents are used as knowledge sources
              for LabelProof. Only PDF files are supported.
            </p>
          </header>

          {/* Upload Area */}
          <section aria-label="Upload document" className="mb-8">
            <DocumentUpload />
          </section>

          {/* Documents Section */}
          <section aria-label="Document library">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-fg-subtle">
                Documents
              </h2>
              <DocumentSearch />
            </div>

            <DocumentList onDelete={setPendingDelete} />
          </section>
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
