import { Menu } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { MobileSidebar } from './MobileSidebar'
import { Sidebar } from './Sidebar'

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const { isMobile, toggleSidebar } = useUI()

  return (
    <div className="app-shell flex h-screen w-full overflow-hidden text-fg">
      <div className="hidden shrink-0 lg:block lg:sticky lg:top-0 lg:h-screen">
        <Sidebar />
      </div>

      <MobileSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        {isMobile && (
          <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 shadow-subtle">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-white">
                <span className="text-sm font-bold">L</span>
              </div>
              <span className="text-base font-semibold text-fg">LabelProof</span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-2xl text-fg transition-colors hover:bg-surface-highlight"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
        )}
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </main>
    </div>
  )
}
