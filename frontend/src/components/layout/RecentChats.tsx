import { useState } from 'react'
import { Check, MessageSquare, Pencil, Trash2, X } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import type { ConversationSummary } from '../../types/chat'

interface RecentChatsProps {
  collapsed: boolean
}

export function RecentChats({ collapsed }: RecentChatsProps) {
  const { conversations, activeConversationId, selectConversation, renameConversation, deleteConversation } =
    useConversations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  if (collapsed) {
    return (
      <nav className="flex flex-col items-center gap-1 px-1" aria-label="Recent chats">
        {sorted.slice(0, 8).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectConversation(c.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              activeConversationId === c.id
                ? 'bg-surface-highlight text-fg'
                : 'text-fg-muted hover:bg-surface-highlight hover:text-fg'
            }`}
            title={c.title}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
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
    <nav className="flex flex-col gap-0.5 px-3" aria-label="Recent chats">
      <div className="px-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">Chats</div>
      {sorted.map((c) => {
        const isActive = activeConversationId === c.id
        const isEditing = editingId === c.id
        return (
          <div
            key={c.id}
            className={`group relative flex items-center rounded-2xl transition-colors ${
              isActive ? 'bg-surface-highlight' : 'hover:bg-surface-highlight'
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
                  className="clinical-input w-full px-2 py-1.5 text-sm text-fg"
                />
                <button
                  type="button"
                  onClick={commitEdit}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-success hover:bg-surface"
                  aria-label="Save name"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-fg-muted hover:bg-surface"
                  aria-label="Cancel rename"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => selectConversation(c.id)}
                  className="flex min-w-0 flex-1 items-center px-2 py-2 text-left text-sm text-fg"
                >
                  <span className="truncate">{c.title}</span>
                </button>
                <div className="absolute right-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEdit(c)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-fg-muted hover:bg-surface hover:text-fg"
                    aria-label="Rename conversation"
                    title="Rename"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(c.id)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-fg-muted hover:bg-surface hover:text-danger"
                    aria-label="Delete conversation"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}
      {conversations.length === 0 && (
        <p className="px-1 py-2 text-xs text-fg-muted">No conversations yet.</p>
      )}
    </nav>
  )
}
