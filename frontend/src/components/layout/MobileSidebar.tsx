import { useEffect } from 'react'
import { useUI } from '../../hooks/useUI'
import { Sidebar } from './Sidebar'

export function MobileSidebar() {
  const { sidebarOpen, closeSidebar, isMobile } = useUI()

  useEffect(() => {
    if (!sidebarOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [sidebarOpen, closeSidebar])

  if (!isMobile) return null

  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={closeSidebar}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-50' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out bg-sidebar ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={closeSidebar} />
      </div>


    </div>
  )
}
