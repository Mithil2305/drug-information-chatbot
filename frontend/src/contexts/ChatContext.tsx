/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { ChatMessage, Citation } from '../types/chat'
import { useConversations } from '../hooks/useConversations'
import { sendMessage as sendChatMessage } from '../api/chat'
import { createSession, getSession, toConversationSummary } from '../api/sessions'

interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string, documentIds?: string[]) => void
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

function mapCitations(raw: any[] | undefined): Citation[] {
  if (!raw) return []
  return raw.map((c, idx) => ({
    citationId: c.chunk_id || c.citation_id || `c-${idx}`,
    documentId: c.document_id || '',
    documentName: c.document_name || 'Unknown Document',
    page: c.page ?? c.page_no ?? 0,
    section: c.section_title || c.section,
    text: c.text,
    score: c.score,
  }))
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const sendingRef = useRef(false)

  const { activeConversationId, setConversations, setActiveConversationId } = useConversations()

  // Clear messages when no active conversation
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      setSelectedCitation(null)
      setSelectedMessageId(null)
    }
  }, [activeConversationId])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (!activeConversationId) return
    if (isLoading || sendingRef.current) return
    const load = async () => {
      try {
        const session = await getSession(activeConversationId)
        const loaded: ChatMessage[] = session.messages.map((msg: any) => ({
          id: String(msg.message_id),
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          citations: mapCitations(msg.citations),
          status: msg.role === 'assistant' ? 'grounded' : undefined,
        }))
        setMessages(loaded)
      } catch (err: any) {
        toast.error(err.message || 'Failed to load chat')
      }
    }
    load()
  }, [activeConversationId])

  const sendMessage = async (content: string, documentIds?: string[]) => {
    if (!content.trim() || isLoading) return
    sendingRef.current = true

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: content.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    let sessionId = activeConversationId

    if (!sessionId) {
      try {
        const title = content.trim().slice(0, 30) + (content.trim().length > 30 ? '…' : '')
        const session = await createSession(title)
        sessionId = String(session.session_id)
        setConversations((prev) => [toConversationSummary(session), ...prev])
        setActiveConversationId(sessionId)
        // window.history.replaceState(null, '', `/chat/${sessionId}`)
      } catch (err: any) {
        toast.error(err.message || 'Failed to start chat session')
        setIsLoading(false)
        return
      }
    }

    try {
      const response = await sendChatMessage({
        message: content.trim(),
        session_id: sessionId,
        document_ids: documentIds,
      })

      const assistantMessage: ChatMessage = {
        id: String(response.message_id),
        role: 'assistant',
        content: response.answer,
        citations: mapCitations(response.citations),
        status: response.grounded ? 'grounded' : 'insufficient_evidence',
      }

      setMessages((prev) => [...prev, assistantMessage])
      setSelectedMessageId(assistantMessage.id)
      if (assistantMessage.citations && assistantMessage.citations.length > 0) {
        setSelectedCitation(assistantMessage.citations[0])
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message')
    } finally {
      setIsLoading(false)
      sendingRef.current = false
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
