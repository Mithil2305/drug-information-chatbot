import { FileText, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import { useConversations } from '../../hooks/useConversations'
import { useUI } from '../../hooks/useUI'
import { RecentChats } from './RecentChats'
import { SidebarHeader } from './SidebarHeader'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { sidebarCollapsed } = useUI()
  const { clearChat } = useChat()
  const { newConversation } = useConversations()
  const collapsed = sidebarCollapsed

  const handleNewChat = () => {
    clearChat()
    newConversation()
    onClose?.()
  }

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center border-r border-line bg-surface py-2">
        <SidebarHeader onClose={onClose} collapsed />
        <div className="mt-2 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
            aria-label="New chat"
            title="New Chat"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            to="/documents"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
            aria-label="Manage documents"
            title="Manage Documents"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          <RecentChats collapsed />
        </div>
        <UserProfile collapsed />
      </aside>
    )
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface">
      <SidebarHeader onClose={onClose} collapsed={false} />

      <div className="flex flex-col gap-1 px-2 pt-2">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-highlight"
        >
          <Plus className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
          <span>New Chat</span>
        </button>
        <Link
          to="/documents"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-highlight"
        >
          <FileText className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
          <span>Manage Documents</span>
        </Link>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        <RecentChats collapsed={false} />
      </div>

      <div className="border-t border-line p-2">
        <UserProfile collapsed={false} />
      </div>
    </aside>
  )
}
