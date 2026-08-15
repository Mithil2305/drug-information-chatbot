import { Menu } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { MobileSidebar } from './MobileSidebar'
import { Sidebar } from './Sidebar'

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const { isMobile, sidebarCollapsed, toggleSidebar } = useUI()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-fg">
      {/* Desktop Sidebar — smooth width transition */}
      <div
        className={`hidden h-full transition-all duration-[280ms] ease-in-out lg:block ${
          sidebarCollapsed ? 'w-[68px]' : 'w-[268px]'
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        {isMobile && (
          <header className="flex shrink-0 items-center justify-between border-b border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-white leading-none">L</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-fg">
                LabelProof
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
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
