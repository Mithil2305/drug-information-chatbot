/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState, type ReactNode } from 'react'
import type { Document } from '../types/document'

interface DocumentContextValue {
  documents: Document[]
  filteredDocuments: Document[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  uploadDocument: (file: File) => void
  deleteDocument: (id: string) => void
  renameDocument: (id: string, name: string) => void
}

export const DocumentContext = createContext<DocumentContextValue | null>(null)

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

const seedDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Rinvoq Prescribing Information',
    filename: 'rinvoq-prescribing-information.pdf',
    status: 'ready',
    fileSize: 2_400_000,
    uploadedAt: daysAgo(2),
    pageCount: 48,
  },
  {
    id: 'd2',
    name: 'Skyrizi Prescribing Information',
    filename: 'skyrizi-prescribing-information.pdf',
    status: 'processing',
    fileSize: 1_800_000,
    uploadedAt: daysAgo(0),
    pageCount: 32,
  },
  {
    id: 'd3',
    name: 'Humira Prescribing Information',
    filename: 'humira-prescribing-information.pdf',
    status: 'ready',
    fileSize: 3_100_000,
    uploadedAt: daysAgo(7),
    pageCount: 56,
  },
]

function makeId() {
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(seedDocuments)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents
    const q = searchQuery.toLowerCase()
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q),
    )
  }, [documents, searchQuery])

  const uploadDocument = (file: File) => {
    const id = makeId()
    const name = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').trim()
    const newDoc: Document = {
      id,
      name: name || file.name,
      filename: file.name,
      status: 'processing',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      pageCount: undefined,
    }
    setDocuments((prev) => [newDoc, ...prev])

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'ready',
                pageCount: Math.floor(Math.random() * 40) + 20,
              }
            : d,
        ),
      )
    }, 2500)
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const renameDocument = (id: string, name: string) => {
    if (!name.trim()) return
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: name.trim() } : d)),
    )
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        filteredDocuments,
        searchQuery,
        setSearchQuery,
        uploadDocument,
        deleteDocument,
        renameDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}
