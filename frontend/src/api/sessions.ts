import { apiFetch } from './client'
import type { Conversation, ConversationSummary } from '../types/chat'

export interface SessionResponse {
  session_id: string
  started_at: string
  summary: string | null
  messages: any[]
}

export const listSessions = () =>
  apiFetch<SessionResponse[]>('/api/v1/sessions')

export const createSession = (summary?: string, signal?: AbortSignal) =>
  apiFetch<SessionResponse>('/api/v1/sessions', {
    method: 'POST',
    body: summary ? JSON.stringify({ summary }) : undefined,
    signal,
  })

export const getSession = (sessionId: string, signal?: AbortSignal) =>
  apiFetch<SessionResponse>(`/api/v1/sessions/${sessionId}`, { signal })

export const updateSession = (sessionId: string, summary: string) =>
  apiFetch<SessionResponse>(`/api/v1/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ summary }),
  })

export const deleteSession = (sessionId: string) =>
  apiFetch<void>(`/api/v1/sessions/${sessionId}`, { method: 'DELETE' })

export function toConversationSummary(s: SessionResponse): ConversationSummary {
  return {
    id: String(s.session_id),
    title: s.summary || 'New Chat',
    updatedAt: s.started_at ?? new Date().toISOString(),
  }
}

export function toConversation(s: SessionResponse): Conversation {
  return {
    id: String(s.session_id),
    title: s.summary || 'New Chat',
    updatedAt: s.started_at ?? new Date().toISOString(),
    messages:
      s.messages?.map((m) => ({
        id: String(m.message_id),
        role: m.role,
        content: m.content,
        citations: m.citations || [],
      })) || [],
  }
}
