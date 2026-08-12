export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  answer: string
  citationIds: string[]
}
