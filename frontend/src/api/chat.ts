import { apiFetch } from './client'
import type { ChatRequest, ChatResponse } from '../types/chat'

export const sendMessage = (request: ChatRequest) =>
  apiFetch<ChatResponse>('/api/v1/chat', { method: 'POST', body: JSON.stringify(request) })
