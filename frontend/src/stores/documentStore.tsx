import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Document } from '../types/document'

interface DocumentContextValue {
  documents: Document[]
  selectedId: string | null
  setDocuments: (docs: Document[]) => void
  select: (id: string | null) => void
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const select = (id: string | null) => setSelectedId(id)

  return (
    <DocumentContext.Provider value={{ documents, selectedId, setDocuments, select }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocumentStore() {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocumentStore must be used within DocumentProvider')
  return ctx
}
