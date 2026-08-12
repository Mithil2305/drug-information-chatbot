import { useState, useCallback } from 'react'

export function usePdfViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)

  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1))
  }, [])

  return { currentPage, totalPages, scale, setTotalPages, setScale, nextPage, prevPage }
}
