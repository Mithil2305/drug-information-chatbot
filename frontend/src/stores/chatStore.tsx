/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ChatMessage } from '../types/chat'

interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  addMessage: (msg: ChatMessage) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setLoading] = useState(false)

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }

  const clear = () => setMessages([])

  return (
    <ChatContext.Provider value={{ messages, isLoading, addMessage, setLoading, clear }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatStore() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatStore must be used within ChatProvider')
  return ctx
}
