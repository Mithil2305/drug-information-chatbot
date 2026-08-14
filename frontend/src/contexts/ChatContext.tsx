/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { ChatMessage, AnswerStatus } from '../types/chat'
import { useConversations } from '../hooks/useConversations'
import { useDocuments } from '../hooks/useDocuments'
import { apiFetch } from '../api/client'

interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string) => void
  clearChat: () => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { activeConversationId, setConversations, setActiveConversationId } = useConversations()
  const { documents } = useDocuments()

  const mapBackendMessage = (m: any): ChatMessage => ({
    id: m.message_id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    citations: m.citations ? m.citations.map((c: any) => ({
      citationId: c.citation_id || c.chunk_id,
      documentId: c.document_id,
      documentName: c.document_name || 'Unknown Document',
      page: c.page,
      section: c.section,
      text: '', // backend doesn't store citation text, but it's optional
    })) : [],
    status: 'grounded',
  })

  // Load message history when active conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      return
    }

    const loadHistory = async () => {
      setIsLoading(true)
      try {
        const msgs = await apiFetch<any[]>(`/api/v1/sessions/${activeConversationId}/messages`)
        setMessages(msgs.map(mapBackendMessage))
      } catch (err: any) {
        toast.error(err.message || 'Failed to load chat history')
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [activeConversationId])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Show user message immediately
    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: content.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    let sessId = activeConversationId

    // 1. Create a new session if none is active
    if (!sessId) {
      try {
        const newSess = await apiFetch<any>('/api/v1/sessions', { method: 'POST' })
        sessId = newSess.session_id
        
        // Add to recent conversations list
        const newSummary = {
          id: sessId!,
          title: content.trim().slice(0, 30) + (content.trim().length > 30 ? '...' : ''),
          updatedAt: newSess.started_at || new Date().toISOString(),
        }
        setConversations((prev) => [newSummary, ...prev])
        setActiveConversationId(sessId!)
      } catch (err: any) {
        toast.error(err.message || 'Failed to initialize chat session')
        setIsLoading(false)
        return
      }
    }

    // 2. Submit question to backend RAG
    try {
      const readyDocIds = documents.filter((d) => d.status === 'ready').map((d) => d.id)
      
      const payload = {
        message: content.trim(),
        session_id: sessId,
        document_ids: readyDocIds,
      }

      const res = await apiFetch<any>('/api/v1/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const status: AnswerStatus = res.grounded ? 'grounded' : 'insufficient_evidence'
      const assistantMessage: ChatMessage = {
        id: res.message_id,
        role: 'assistant',
        content: res.answer,
        citations: res.citations ? res.citations.map((c: any) => ({
          citationId: c.chunk_id,
          documentId: c.document_id,
          documentName: c.document_name || 'Unknown Document',
          page: c.page,
          section: c.section,
          text: '',
        })) : [],
        status,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch answer')
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setIsLoading(false)
    setActiveConversationId(null)
  }

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  )
}
