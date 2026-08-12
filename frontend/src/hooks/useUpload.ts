import { useState, useCallback } from 'react'
import { uploadDocument } from '../api/documents'

export function useUpload() {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    setProgress(0)
    try {
      setProgress(50)
      const doc = await uploadDocument(file)
      setProgress(100)
      return doc
    } finally {
      setUploading(false)
    }
  }, [])

  return { progress, uploading, upload }
}
