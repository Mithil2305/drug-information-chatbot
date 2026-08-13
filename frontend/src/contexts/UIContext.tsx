/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'

interface UIContextValue {
  sidebarOpen: boolean
  isMobile: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

export const UIContext = createContext<UIContextValue | null>(null)

const MOBILE_BREAKPOINT = 1024

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <UIContext.Provider value={{ sidebarOpen, isMobile, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  )
}
