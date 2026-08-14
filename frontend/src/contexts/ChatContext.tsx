/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react'
import type { ChatMessage, Citation, AnswerStatus } from '../types/chat'

interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string) => void
  clearChat: () => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)

const demoCitations: Citation[] = [
  {
    citationId: 'c1',
    documentId: 'doc-001',
    documentName: 'Rinvoq Prescribing Information',
    page: 12,
    section: 'Dosage and Administration',
    text: 'The recommended dosage is 15 mg once daily.',
  },
]

const demoAnswer = `The recommended dosage of **Rinvoq** for most adults is **15 mg once daily** for conditions such as moderate-to-severe rheumatoid arthritis. Dosing may be adjusted based on renal impairment or concomitant medications.`

const demoFollowUps = [
  'What are the major warnings for Rinvoq?',
  'Can Rinvoq be used in elderly patients?',
]

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const status: AnswerStatus = 'grounded'
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: demoAnswer,
        citations: demoCitations,
        followUps: demoFollowUps,
        status,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const clearChat = () => {
    setMessages([])
    setIsLoading(false)
  }

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  )
}
