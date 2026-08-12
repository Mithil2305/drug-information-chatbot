import { useState, useCallback } from 'react'
import { sendMessage } from '../api/chat'
import type { ChatMessage } from '../types/chat'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (content: string) => {
    setLoading(true)
    try {
      const userMsg: ChatMessage = { role: 'user', content }
      setMessages((prev) => [...prev, userMsg])
      const res = await sendMessage(userMsg)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.answer }])
    } finally {
      setLoading(false)
    }
  }, [])

  return { messages, loading, send }
}
