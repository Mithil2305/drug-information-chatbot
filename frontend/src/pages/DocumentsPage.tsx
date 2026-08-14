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
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-fg">Manage Documents</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Uploaded approved drug-label documents are used as knowledge sources for the chatbot. Manage your PDFs below.
            </p>
          </header>

          <div className="mb-6">
            <DocumentUpload />
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
              Documents
            </h2>
            <DocumentSearch />
          </div>

          <DocumentList onDelete={setPendingDelete} />
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
