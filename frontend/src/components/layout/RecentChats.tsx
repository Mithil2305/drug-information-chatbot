import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MessageSquare, Pencil, Trash2, X } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import type { ConversationSummary } from '../../types/chat'

interface RecentChatsProps {
  collapsed: boolean
  onClose?: () => void
}

export function RecentChats({ collapsed, onClose }: RecentChatsProps) {
  const { conversations, activeConversationId, selectConversation, renameConversation, deleteConversation } =
    useConversations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const navigate = useNavigate()

  const handleSelect = (id: string) => {
    selectConversation(id)
    navigate('/')
    onClose?.()
  }

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  if (collapsed) {
    return (
      <nav className="flex flex-col items-center gap-1.5 px-1 py-2" aria-label="Recent conversations">
        {sorted.slice(0, 8).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleSelect(c.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors cursor-pointer ${
              activeConversationId === c.id
                ? 'bg-accent-tint text-accent border border-accent/30'
                : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
            }`}
            title={c.title}
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ))}
      </nav>
    )
  }

  const startEdit = (c: ConversationSummary) => {
    setEditingId(c.id)
    setEditValue(c.title)
  }

  const commitEdit = () => {
    if (editingId) renameConversation(editingId, editValue)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <nav className="flex flex-col gap-1 px-2" aria-label="Recent conversations">
      <div className="px-2 py-1.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text-muted font-semibold">
        RECENT
      </div>

      <div className="flex flex-col gap-0.5">
        {sorted.map((c) => {
          const isActive = activeConversationId === c.id
          const isEditing = editingId === c.id
          return (
            <div
              key={c.id}
              className={`group relative flex items-center transition-all ${
                isActive
                  ? 'bg-accent-tint text-accent font-semibold rounded-[6px]'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-[6px]'
              }`}
            >


              {isEditing ? (
                <div className="flex w-full items-center gap-1 px-2 py-1.5">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                    className="w-full rounded-[6px] bg-surface px-2 py-0.5 text-xs text-text-primary outline-none border border-accent font-sans"
                  />


                  <button
                    type="button"
                    onClick={commitEdit}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-success hover:bg-surface-raised cursor-pointer"
                    aria-label="Save name"
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-raised cursor-pointer"
                    aria-label="Cancel rename"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left text-xs leading-relaxed cursor-pointer font-sans"
                  >
                    <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`} aria-hidden="true" />
                    <span className="truncate">{c.title}</span>
                  </button>
                  <div className="absolute right-1.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 bg-surface rounded-[6px] px-1 py-0.5 border border-border shadow-sm">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(c)
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-text-primary cursor-pointer"
                      aria-label="Rename conversation"
                      title="Rename"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(c.id)
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-danger cursor-pointer"
                      aria-label="Delete conversation"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {conversations.length === 0 && (
        <div className="px-3 py-4 text-center rounded-[8px] bg-surface-raised/40 border border-border">
          <p className="text-xs font-medium text-text-secondary">No conversations yet</p>
          <p className="text-[11px] text-text-muted mt-0.5">Start a query to build your research log.</p>
        </div>
      )}
    </nav>
  )
}






