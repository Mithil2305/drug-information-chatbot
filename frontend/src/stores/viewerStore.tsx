/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

interface ViewerContextValue {
  currentPage: number
  totalPages: number
  scale: number
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setScale: (scale: number) => void
}

const ViewerContext = createContext<ViewerContextValue | null>(null)

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)

  return (
    <ViewerContext.Provider value={{ currentPage, totalPages, scale, setCurrentPage, setTotalPages, setScale }}>
      {children}
    </ViewerContext.Provider>
  )
}

export function useViewerStore() {
  const ctx = useContext(ViewerContext)
  if (!ctx) throw new Error('useViewerStore must be used within ViewerProvider')
  return ctx
}
