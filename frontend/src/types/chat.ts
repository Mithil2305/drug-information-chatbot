export type AnswerStatus = 'grounded' | 'insufficient_evidence'

export interface Citation {
  citationId: string
  documentId: string
  documentName: string
  page: number
  section?: string
  text: string
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
  conversationId: string
  answer: string
  status: AnswerStatus
  citations: Citation[]
  followUps?: string[]
}

export interface Conversation {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}
