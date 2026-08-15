import { Menu } from 'lucide-react'
import { MobileSidebar } from './MobileSidebar'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'
import { useUI } from '../../hooks/useUI'

interface ChatLayoutProps {
  children: React.ReactNode
  title?: string
}

export function ChatLayout({ children, title }: ChatLayoutProps) {
  const { isMobile, toggleSidebar } = useUI()
  return (
    <div className="app-shell flex h-screen w-full overflow-hidden text-fg">
      <div className="hidden shrink-0 lg:block lg:sticky lg:top-0 lg:h-screen">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        {isMobile && (
          <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 shadow-subtle">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-white">
                <span className="text-sm font-bold">L</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-fg">
                LabelProof
              </span>
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

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
