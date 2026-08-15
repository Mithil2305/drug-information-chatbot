import { MobileSidebar } from './MobileSidebar'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

interface ChatLayoutProps {
  children: React.ReactNode
  title?: string
}

export function ChatLayout({ children, title }: ChatLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text-primary">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden h-full lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileSidebar />

      {/* Main Clinical Viewport */}
      <main className="flex min-w-0 flex-1 flex-col bg-background">
        <TopHeader title={title} />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </main>
    </div>
  )
}
