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
            className={`group relative mx-2 flex items-center rounded-lg transition-colors ${
              isActive
                ? 'bg-surface-highlight'
                : 'hover:bg-surface-highlight'
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
                  className="w-full rounded-md bg-background px-2 py-1 text-sm text-fg outline-none ring-1 ring-primary"
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
                  className="flex min-w-0 flex-1 items-center px-3 py-2 text-left"
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
                    className={`flex h-6 w-6 items-center justify-center rounded text-fg-subtle transition-all hover:bg-surface hover:text-fg-muted ${
                      isMenuOpen
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label="Conversation options"
                    aria-expanded={isMenuOpen}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpenId(null)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 top-7 z-20 w-36 rounded-lg border border-line bg-surface-raised py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-fg transition-colors hover:bg-surface-highlight"
                        >
                          <Pencil className="h-3.5 w-3.5 text-fg-muted" aria-hidden="true" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-danger transition-colors hover:bg-surface-highlight"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
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
