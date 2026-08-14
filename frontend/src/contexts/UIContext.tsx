/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'

interface UIContextValue {
  sidebarOpen: boolean
  isMobile: boolean
  sidebarCollapsed: boolean
  searchOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  toggleCollapse: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  toggleSearch: () => void
  closeSearch: () => void
}

export const UIContext = createContext<UIContextValue | null>(null)

const MOBILE_BREAKPOINT = 1024

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev)
  const collapseSidebar = () => setSidebarCollapsed(true)
  const expandSidebar = () => setSidebarCollapsed(false)
  const toggleSearch = () => setSearchOpen((prev) => !prev)
  const closeSearch = () => setSearchOpen(false)

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        isMobile,
        sidebarCollapsed,
        searchOpen,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        toggleCollapse,
        collapseSidebar,
        expandSidebar,
        toggleSearch,
        closeSearch,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
