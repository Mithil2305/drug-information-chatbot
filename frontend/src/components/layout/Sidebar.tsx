import { FileText, MessageSquare, Plus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useChat } from '../../hooks/useChat'
import { useConversations } from '../../hooks/useConversations'
import { useUI } from '../../hooks/useUI'
import { SidebarHeader } from './SidebarHeader'
import { RecentChats } from './RecentChats'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { clearChat } = useChat()
  const { newConversation } = useConversations()
  const { sidebarCollapsed } = useUI()
  const location = useLocation()
  const navigate = useNavigate()

  const handleNewChat = () => {
    clearChat()
    newConversation()
    navigate('/')
    onClose?.()
  }

  const isDocumentsPage = location.pathname.startsWith('/documents')
  const isChatPage = !isDocumentsPage

  return (
    <aside 
      className={`flex h-full flex-col justify-between border-r border-border bg-sidebar transition-all duration-200 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-[220px]'
      }`}
      aria-label="Application Navigation"
    >
      {/* Top Section: Header + Action + Navigation */}
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
        {/* Header */}
        <SidebarHeader onClose={onClose} collapsed={sidebarCollapsed} />

        {/* Primary Action: New Chat */}
        <div className="p-3 border-b border-border">
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-8 w-8 mx-auto items-center justify-center rounded-[6px] bg-[#22D3E8] text-[#0D1220] font-bold hover:bg-[#38EDFF] transition-all cursor-pointer shadow-sm"
              title="New Chat"
              aria-label="New Chat"
            >
              <Plus className="h-4 w-4 stroke-[3]" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#22D3E8] text-[#0D1220] hover:bg-[#38EDFF] transition-all cursor-pointer font-sans text-xs font-bold shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Workspace Navigation Section: Exactly 2 Destinations */}
        <div className="px-2 pt-2.5 pb-2 border-b border-border">
          <nav className="flex flex-col gap-1" aria-label="Workspace Links">
            <button
              type="button"
              onClick={handleNewChat}
              className={`flex items-center transition-all cursor-pointer ${
                sidebarCollapsed ? 'justify-center p-2 rounded-[6px]' : 'gap-2.5 px-3 py-1.5 rounded-[6px]'
              } ${
                isChatPage
                  ? 'bg-[#D5F4FA] dark:bg-[#22D3E8]/15 border border-[#20C7DC]/50 text-[#0891B2] dark:text-[#22D3E8] font-bold shadow-sm'
                  : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text border border-transparent'
              }`}
              title="Intelligence"
            >
              <MessageSquare className={`h-3.5 w-3.5 ${isChatPage ? 'text-[#0891B2] dark:text-[#22D3E8]' : 'text-sidebar-muted'}`} aria-hidden="true" />
              {!sidebarCollapsed && <span className="text-xs font-sans">Intelligence</span>}
            </button>

            <Link
              to="/documents"
              onClick={onClose}
              className={`flex items-center transition-all cursor-pointer ${
                sidebarCollapsed ? 'justify-center p-2 rounded-[6px]' : 'gap-2.5 px-3 py-1.5 rounded-[6px]'
              } ${
                isDocumentsPage
                  ? 'bg-[#D5F4FA] dark:bg-[#22D3E8]/15 border border-[#20C7DC]/50 text-[#0891B2] dark:text-[#22D3E8] font-bold shadow-sm'
                  : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text border border-transparent'
              }`}
              title="Manage Documents"
            >
              <FileText className={`h-3.5 w-3.5 ${isDocumentsPage ? 'text-[#0891B2] dark:text-[#22D3E8]' : 'text-sidebar-muted'}`} aria-hidden="true" />
              {!sidebarCollapsed && <span className="text-xs font-sans">Manage Documents</span>}
            </Link>
          </nav>
        </div>





        {/* Recent Conversations Section */}
        <div className="flex-1 overflow-y-auto py-2">
          <RecentChats collapsed={sidebarCollapsed} onClose={onClose} />
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <UserProfile collapsed={sidebarCollapsed} />
    </aside>
  )
}
