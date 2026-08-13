import { Activity, ChevronDown, FileText, History, MessageSquare, Plus, Scale, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useTheme } from '../../hooks/useTheme'

interface SidebarProps {
  onClose?: () => void
}

const recent = [
  { id: '1', title: 'What is the recommended dosage?' },
  { id: '2', title: 'Drug interactions with Rinvoq' },
  { id: '3', title: 'Warnings and precautions' },
]

export function Sidebar({ onClose }: SidebarProps) {
  const { clearChat } = useChat()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold text-fg">LabelProof</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => { clearChat(); onClose?.() }}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface-highlight px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Chat
      </button>

      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-fg-muted">Recent</div>
      <nav className="mb-6 flex flex-col gap-1" aria-label="Recent conversations">
        {recent.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => alert('Conversation history coming soon')}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-highlight"
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </nav>

      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-fg-muted">Workspace</div>
      <nav className="flex flex-col gap-1" aria-label="Workspace navigation">
        <NavButton icon={FileText} label="Documents" onClick={() => alert('Documents coming soon')} />
        <NavButton icon={History} label="History" onClick={() => alert('History coming soon')} />
        <NavButton icon={Scale} label="Compare" onClick={() => alert('Compare coming soon')} />
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-highlight"
        >
          <span>Theme</span>
          <span className="text-xs text-fg-muted capitalize">{theme}</span>
        </button>
        <button
          type="button"
          onClick={() => alert('Settings coming soon')}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-highlight"
        >
          <span>Settings</span>
          <ChevronDown className="ml-auto h-4 w-4 text-fg-muted" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}

function NavButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-highlight"
    >
      <Icon className="h-4 w-4 text-fg-muted" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
