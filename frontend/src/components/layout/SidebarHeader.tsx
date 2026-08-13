import { PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react'
import { useUI } from '../../hooks/useUI'

interface SidebarHeaderProps {
  onClose?: () => void
  collapsed: boolean
}

export function SidebarHeader({ onClose, collapsed }: SidebarHeaderProps) {
  const { toggleCollapse, toggleSearch } = useUI()

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <span className="text-sm font-bold">L</span>
        </div>
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-3 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <span className="text-sm font-bold">L</span>
        </div>
        <span className="text-base font-semibold text-fg">LabelProof</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleSearch}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Search"
          title="Search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg lg:flex"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg lg:hidden"
            aria-label="Close sidebar"
            title="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
