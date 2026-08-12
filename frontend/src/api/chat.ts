import { apiFetch } from './client'
import type { ChatMessage, ChatResponse } from '../types/chat'

export const sendMessage = (message: ChatMessage) =>
  apiFetch<ChatResponse>('/api/chat', { method: 'POST', body: JSON.stringify(message) })
