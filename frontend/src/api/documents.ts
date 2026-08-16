import { apiFetch } from './client'
import type { Document } from '../types/document'

export const fetchDocuments = () => apiFetch<Document[]>('/api/v1/documents')
export const uploadDocument = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<{ document: any; message: string }>('/api/v1/documents/upload', { method: 'POST', body: formData })
}
export const deleteDocument = (id: string) =>
  apiFetch<void>(`/api/v1/documents/${id}`, { method: 'DELETE' })

export const updateDocument = (id: string, source: string) =>
  apiFetch<Document>(`/api/v1/documents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ source }),
  })

export const getDocumentStatus = (id: string) =>
  apiFetch<{ document_id: string; status: string; stage: string; message: string }>(
    `/api/v1/documents/${id}/status`
  )

export const viewDocumentUrl = (id: string) => {
  const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')
  return `${base}/api/v1/documents/${id}/view`
}
