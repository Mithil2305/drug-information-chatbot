import { useState, useEffect, useCallback } from 'react'
import { fetchDocuments } from '../api/documents'
import type { Document } from '../types/document'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setDocuments(await fetchDocuments())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { documents, loading, refresh }
}
