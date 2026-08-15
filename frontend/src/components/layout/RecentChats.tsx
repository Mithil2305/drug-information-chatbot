import { useState } from 'react'
import { Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { Tooltip } from '../common/Tooltip'
import type { ConversationSummary } from '../../types/chat'

interface RecentChatsProps {
  collapsed: boolean
}

export function RecentChats({ collapsed }: RecentChatsProps) {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    renameConversation,
    deleteConversation,
  } = useConversations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const startEdit = (c: ConversationSummary) => {
    setMenuOpenId(null)
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

  const handleDelete = (id: string) => {
    setMenuOpenId(null)
    deleteConversation(id)
  }

  /* ── Collapsed view ─────────────────────────────────────── */
  if (collapsed) {
    return (
      <nav className="flex flex-col items-center gap-0.5 px-2 py-1" aria-label="Recent chats">
        {sorted.slice(0, 8).map((c) => (
          <Tooltip key={c.id} content={c.title} side="right">
            <button
              type="button"
              onClick={() => selectConversation(c.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                activeConversationId === c.id
                  ? 'bg-primary-soft text-primary'
                  : 'text-fg-muted hover:bg-surface-highlight hover:text-fg'
              }`}
              aria-label={c.title}
            >
              {c.title.charAt(0).toUpperCase()}
            </button>
          </Tooltip>
        ))}
      </nav>
    )
  }

  /* ── Expanded view ─────────────────────────────────────── */
  return (
    <nav className="flex flex-col" aria-label="Recent chats">
      {/* Section Label */}
      <div className="px-4 pb-1 pt-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-fg-subtle">
          Chats
        </span>
      </div>

      {sorted.map((c) => {
        const isActive = activeConversationId === c.id
        const isEditing = editingId === c.id
        const isMenuOpen = menuOpenId === c.id

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
                  <span
                    className={`truncate text-sm ${
                      isActive ? 'font-medium text-fg' : 'text-fg-muted'
                    }`}
                  >
                    {c.title}
                  </span>
                </button>

                {/* Three-dot menu */}
                <div className="relative shrink-0 pr-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId((prev) => (prev === c.id ? null : c.id))
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
        <p className="px-4 py-3 text-xs text-fg-subtle">
          No conversations yet. Start by asking a question.
        </p>
      )}
    </nav>
  )
}
