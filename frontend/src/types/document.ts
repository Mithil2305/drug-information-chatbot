export interface Document {
  id: string
  filename: string
  status: 'pending' | 'processing' | 'ready' | 'error'
  uploadedAt: string
  pageCount?: number
}
