import { apiFetch } from './client'
import type { Document } from '../types/document'

export const fetchDocuments = () => apiFetch<Document[]>('/api/documents')
export const uploadDocument = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<Document>('/api/documents', { method: 'POST', body: formData })
}
export const deleteDocument = (id: string) =>
  apiFetch<void>(`/api/documents/${id}`, { method: 'DELETE' })
