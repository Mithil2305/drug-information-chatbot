import { PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { Tooltip } from '../common/Tooltip'

interface SidebarHeaderProps {
  onClose?: () => void
  collapsed: boolean
}

export function SidebarHeader({ onClose, collapsed }: SidebarHeaderProps) {
  const { toggleCollapse, toggleSearch } = useUI()

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 px-2 py-3">
        {/* Logo Mark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-white leading-none">L</span>
        </div>

        <Tooltip content="Expand sidebar" side="right">
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-3 py-3">
      {/* Logo + Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-white leading-none">L</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-fg">
          LabelProof
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggleSearch}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Search conversations"
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
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
