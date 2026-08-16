/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { Document } from '../types/document'
import { useAuth } from '../hooks/useAuth'
import {
  fetchDocuments,
  uploadDocument as uploadDocumentApi,
  deleteDocument as deleteDocumentApi,
  updateDocument as updateDocumentApi,
} from '../api/documents'

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

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()

  const mapBackendDoc = (doc: any): Document => ({
    id: doc.document_id,
    name: doc.source || doc.file_name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').trim(),
    filename: doc.file_name,
    status: doc.status === 'completed' ? 'ready' : doc.status === 'failed' ? 'failed' : 'processing',
    fileSize: doc.file_size || 0,
    pageCount: doc.page_count || 0,
    uploadedAt: doc.created_at || new Date().toISOString(),
  })

  // Load documents on mount / when user changes
  useEffect(() => {
    if (!user) {
      setDocuments([])
      return
    }

    const load = async () => {
      try {
        const res = await fetchDocuments()
        setDocuments(res.map(mapBackendDoc))
      } catch (err: any) {
        toast.error(err.message || 'Failed to load documents')
      }
    }

    load()
  }, [user])

  // Poll while documents are processing
  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === 'processing')
    if (!hasProcessing || !user) return

    const interval = setInterval(async () => {
      try {
        const res = await fetchDocuments()
        setDocuments(res.map(mapBackendDoc))
      } catch {
        // ignore polling connection errors silently
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [documents, user])

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents
    const q = searchQuery.toLowerCase()
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q),
    )
  }, [documents, searchQuery])

  const uploadDocument = async (file: File) => {
    const tempId = `temp-${Date.now()}`
    const name = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').trim()
    const tempDoc: Document = {
      id: tempId,
      name: name || file.name,
      filename: file.name,
      status: 'processing',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    }
    setDocuments((prev) => [tempDoc, ...prev])

    try {
      const res = await uploadDocumentApi(file)
      setDocuments((prev) =>
        prev.map((d) => (d.id === tempId ? mapBackendDoc(res.document) : d)),
      )
      toast.success(`Successfully uploaded "${tempDoc.name}"`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload document')
      setDocuments((prev) => prev.filter((d) => d.id !== tempId))
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await deleteDocumentApi(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete document')
    }
  }

  const renameDocument = async (id: string, name: string) => {
    if (!name.trim()) return
    try {
      const updated = await updateDocumentApi(id, name.trim())
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, name: name.trim(), source: updated.source || d.source }
            : d,
        ),
      )
      toast.success('Document renamed')
    } catch (err: any) {
      toast.error(err.message || 'Failed to rename document')
    }
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
