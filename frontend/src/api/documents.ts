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
