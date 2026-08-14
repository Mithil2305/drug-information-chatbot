/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { ChatMessage, Citation, AnswerStatus } from '../types/chat'
import { useConversations } from '../hooks/useConversations'
import { useDocuments } from '../hooks/useDocuments'
import { apiFetch } from '../api/client'

interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string) => void
  clearChat: () => void
  selectedCitation: Citation | null
  setSelectedCitation: (c: Citation | null) => void
  selectedMessageId: string | null
  setSelectedMessageId: (id: string | null) => void
  activeCitations: Citation[]
}

export const ChatContext = createContext<ChatContextValue | null>(null)

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  
  const { activeConversationId, setConversations, setActiveConversationId } = useConversations()
  const { documents } = useDocuments()

  const mapBackendMessage = (m: any): ChatMessage => ({
    id: String(m.message_id),
    role: m.role as 'user' | 'assistant',
    content: m.content,
    citations: m.citations ? m.citations.map((c: any) => ({
      citationId: String(c.citation_id || c.chunk_id || makeId()),
      documentId: c.document_id || '',
      documentName: c.document_name || 'Approved Drug Label',
      page: Number(c.page ?? c.page_no ?? 1),
      section: c.section || 'General Section',
      text: c.text || '',
    })) : [],
    status: 'grounded',
  })

  // Load message history when active conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      setSelectedCitation(null)
      setSelectedMessageId(null)
      return
    }

    const loadHistory = async () => {
      setIsLoading(true)
      try {
        const msgs = await apiFetch<any[]>(`/api/v1/sessions/${activeConversationId}/messages`)
        const formatted = msgs.map(mapBackendMessage)
        setMessages(formatted)
        // Select latest assistant message citations if present
        const lastAssistant = [...formatted].reverse().find((m) => m.role === 'assistant')
        if (lastAssistant) {
          setSelectedMessageId(lastAssistant.id)
          if (lastAssistant.citations && lastAssistant.citations.length > 0) {
            setSelectedCitation(lastAssistant.citations[0])
          }
        }
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
          id: String(sessId!),
          title: content.trim().slice(0, 30) + (content.trim().length > 30 ? '...' : ''),
          updatedAt: newSess.started_at || new Date().toISOString(),
        }
        setConversations((prev) => [newSummary, ...prev])
        setActiveConversationId(String(sessId!))
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
      const parsedCitations: Citation[] = res.citations ? res.citations.map((c: any) => ({
        citationId: String(c.chunk_id || c.citation_id || makeId()),
        documentId: c.document_id || '',
        documentName: c.document_name || 'Approved Prescribing Info',
        page: Number(c.page ?? c.page_no ?? 1),
        section: c.section || 'General Section',
        text: c.text || '',
      })) : []

      const assistantMessage: ChatMessage = {
        id: String(res.message_id || makeId()),
        role: 'assistant',
        content: res.answer,
        citations: parsedCitations,
        status,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setSelectedMessageId(assistantMessage.id)
      if (parsedCitations.length > 0) {
        setSelectedCitation(parsedCitations[0])
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch answer')
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setIsLoading(false)
    setSelectedCitation(null)
    setSelectedMessageId(null)
    setActiveConversationId(null)
  }

  // Active citations computed from selected message or latest assistant message
  const activeMessage = selectedMessageId
    ? messages.find((m) => m.id === selectedMessageId)
    : [...messages].reverse().find((m) => m.role === 'assistant')

  const activeCitations = activeMessage?.citations || []

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearChat,
        selectedCitation,
        setSelectedCitation,
        selectedMessageId,
        setSelectedMessageId,
        activeCitations,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
