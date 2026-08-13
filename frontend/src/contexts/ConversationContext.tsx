/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react'
import type { ConversationSummary } from '../types/chat'

interface ConversationContextValue {
  conversations: ConversationSummary[]
  activeConversationId: string | null
  selectConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  newConversation: () => void
}

export const ConversationContext = createContext<ConversationContextValue | null>(null)

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

const seedConversations: ConversationSummary[] = [
  { id: 'c1', title: 'Drug dosage question', updatedAt: daysAgo(0) },
  { id: 'c2', title: 'Drug interactions', updatedAt: daysAgo(0) },
  { id: 'c3', title: 'Contraindications', updatedAt: daysAgo(1) },
  { id: 'c4', title: 'Safety information', updatedAt: daysAgo(1) },
  { id: 'c5', title: 'Drug comparison', updatedAt: daysAgo(3) },
  { id: 'c6', title: 'Rinvoq warnings', updatedAt: daysAgo(5) },
]

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationSummary[]>(seedConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const selectConversation = (id: string) => setActiveConversationId(id)

  const renameConversation = (id: string, title: string) => {
    if (!title.trim()) return
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)),
    )
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    setActiveConversationId((prev) => (prev === id ? null : prev))
  }

  const newConversation = () => {
    setActiveConversationId(null)
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversationId,
        selectConversation,
        renameConversation,
        deleteConversation,
        newConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}
