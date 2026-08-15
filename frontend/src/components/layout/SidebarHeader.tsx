import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useUI } from '../../hooks/useUI'

interface SidebarHeaderProps {
  onClose?: () => void
  collapsed: boolean
}

export function SidebarHeader({ onClose, collapsed }: SidebarHeaderProps) {
  const { toggleCollapse } = useUI()

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2.5 py-3 border-b border-border bg-sidebar">
        <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#22D3E8] text-[#0D1220] font-black shadow-sm">
          <span className="text-xs">L</span>
        </div>
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex h-6 w-6 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary cursor-pointer"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-3.5 py-3 border-b border-border bg-sidebar">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#22D3E8] text-[#0D1220] font-black shadow-sm">
          <span className="text-xs">L</span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-xs sm:text-[13px] font-bold text-text-primary leading-tight">
            LabelProof
          </span>
          <span className="text-[9.5px] text-text-tertiary font-medium leading-tight">
            Clinical Intelligence
          </span>
        </div>
      </div>




      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden h-6 w-6 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary lg:flex cursor-pointer"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary lg:hidden cursor-pointer"
            aria-label="Close sidebar"
            title="Close"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )

}






