import { FileText } from 'lucide-react'
import { useDocuments } from '../../hooks/useDocuments'
import type { Document } from '../../types/document'
import { DocumentCard } from './DocumentCard'

interface DocumentListProps {
  onDelete: (doc: Document) => void
}

export function DocumentList({ onDelete }: DocumentListProps) {
  const { filteredDocuments, documents } = useDocuments()

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-highlight text-fg-muted">
          <FileText className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-fg">No documents yet</h3>
        <p className="max-w-sm text-xs text-fg-muted">
          Upload approved drug-label PDFs to use them as knowledge sources for the chatbot.
        </p>
      </div>
    )
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center">
        <h3 className="mb-1 text-sm font-semibold text-fg">No matching documents</h3>
        <p className="text-xs text-fg-muted">Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDocuments.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
      ))}
    </div>
  )
}
