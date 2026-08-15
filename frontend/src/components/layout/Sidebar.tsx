import { FileText, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import { useConversations } from '../../hooks/useConversations'
import { useUI } from '../../hooks/useUI'
import { Tooltip } from '../common/Tooltip'
import { RecentChats } from './RecentChats'
import { SidebarHeader } from './SidebarHeader'
import { ThemeToggle } from './ThemeToggle'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { sidebarCollapsed } = useUI()
  const { clearChat } = useChat()
  const { newConversation } = useConversations()
  const location = useLocation()
  const collapsed = sidebarCollapsed

  const handleNewChat = () => {
    clearChat()
    newConversation()
    onClose?.()
  }

  const isDocuments = location.pathname === '/documents'

  if (collapsed) {
    return (
      <aside className="flex h-full w-[68px] shrink-0 flex-col items-center border-r border-line bg-surface py-2">
        <SidebarHeader onClose={onClose} collapsed />

        <div className="mt-3 flex flex-col items-center gap-1 px-2">
          <Tooltip content="New Chat" side="right">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label="New chat"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>

          <Tooltip content="Manage Documents" side="right">
            <Link
              to="/documents"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-surface-highlight hover:text-fg ${
                isDocuments ? 'bg-surface-highlight text-fg' : 'text-fg-muted'
              }`}
              aria-label="Manage documents"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Tooltip>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto w-full">
          <RecentChats collapsed />
        </div>

        <div className="flex flex-col items-center gap-1 border-t border-line pt-2 pb-1 w-full px-2">
          <ThemeToggle collapsed />
          <UserProfile collapsed />
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex h-full w-[268px] shrink-0 flex-col border-r border-line bg-surface">
      <SidebarHeader onClose={onClose} collapsed={false} />

      {/* Primary Actions */}
      <div className="flex flex-col gap-0.5 px-2 pt-1 pb-2">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>New Chat</span>
        </button>

        <Link
          to="/documents"
          onClick={onClose}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-highlight hover:text-fg ${
            isDocuments
              ? 'bg-surface-highlight text-fg'
              : 'text-fg-muted'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Manage Documents</span>
        </Link>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto border-t border-line pt-2">
        <RecentChats collapsed={false} />
      </div>

      {/* Bottom Section */}
      <div className="border-t border-line p-2 space-y-0.5">
        <ThemeToggle collapsed={false} />
        <UserProfile collapsed={false} />
      </div>
    </aside>
  )
}
