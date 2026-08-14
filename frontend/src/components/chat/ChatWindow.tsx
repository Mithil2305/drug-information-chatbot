import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { LoadingState } from './LoadingState'

export function ChatWindow() {
  const { messages, isLoading } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-highlight text-ai">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-fg">LabelProof</h1>
          <p className="max-w-md text-sm text-fg-muted">
            Evidence-first drug information. Ask a question about an approved drug label and get a grounded, cited answer.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <SuggestionChip text="What is the recommended dosage?" />
            <SuggestionChip text="What are the major warnings?" />
            <SuggestionChip text="What are the contraindications?" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} isLast={index === messages.length - 1} />
          ))}
          {isLoading && <LoadingState />}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

function SuggestionChip({ text }: { text: string }) {
  const { sendMessage } = useChat()
  return (
    <button
      type="button"
      onClick={() => sendMessage(text)}
      className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:border-primary hover:text-primary"
    >
      {text}
    </button>
  )
}
