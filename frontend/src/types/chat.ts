export type AnswerStatus = 'grounded' | 'insufficient_evidence'

export interface Citation {
  citationId: string
  documentId: string
  documentName: string
  page: number
  section?: string
  text?: string
  score?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  followUps?: string[]
  status?: AnswerStatus
}

export interface ChatResponse {
  conversationId?: string
  message_id: string
  session_id: string
  answer: string
  grounded: boolean
  evidence_count?: number
  citations: Citation[]
  followUps?: string[]
}

export interface Conversation {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface ConversationSummary {
  id: string
  title: string
  updatedAt: string
}
