/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { ChatMessage, Citation } from '../types/chat'
import { useConversations } from '../hooks/useConversations'
import { getMockResponse } from '../utils/mockChatData'

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

  // Clear messages when no active conversation
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      setSelectedCitation(null)
      setSelectedMessageId(null)
    }
  }, [activeConversationId])

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return

    // Show user message immediately
    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: content.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Add to recent conversations if this is the first message
    if (!activeConversationId) {
      const newId = makeId()
      const newSummary = {
        id: newId,
        title: content.trim().slice(0, 30) + (content.trim().length > 30 ? '…' : ''),
        updatedAt: new Date().toISOString(),
      }
      setConversations((prev) => [newSummary, ...prev])
      setActiveConversationId(newId)
    }

    // Simulate AI response after delay
    setTimeout(() => {
      const mock = getMockResponse(content)

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: mock.content,
        citations: mock.citations,
        followUps: mock.followUps,
        status: 'grounded',
      }

      setMessages((prev) => [...prev, assistantMessage])
      setSelectedMessageId(assistantMessage.id)
      if (mock.citations.length > 0) {
        setSelectedCitation(mock.citations[0])
      }
      setIsLoading(false)
    }, 1600)
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
