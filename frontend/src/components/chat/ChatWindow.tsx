import { useEffect, useRef } from 'react'
import { FileText, Sparkles } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { LoadingState } from './LoadingState'

const SUGGESTION_CHIPS = [
  'What is the recommended dosage?',
  'What are the major warnings?',
  'What are the contraindications?',
  'Are there any known drug interactions?',
]

function SuggestionChip({ text }: { text: string }) {
  const { sendMessage } = useChat()
  return (
    <button
      type="button"
      onClick={() => sendMessage(text)}
      className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-fg-muted transition-all hover:border-primary/40 hover:bg-surface-highlight hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {text}
    </button>
  )
}

export function ChatWindow() {
  const { messages, isLoading } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        /* ── Empty / Home State ── */
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-fg">
            LabelProof
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
            Evidence-first drug information.{' '}
            <br className="hidden sm:block" />
            Ask questions about approved drug-label documents and receive
            grounded answers with page-level citations.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-lg">
            {SUGGESTION_CHIPS.map((text) => (
              <SuggestionChip key={text} text={text} />
            ))}
          </div>

          <div className="mt-10 flex items-center gap-1.5 text-xs text-fg-subtle">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Answers grounded in uploaded drug-label documents</span>
          </div>
        </div>
      ) : (
        /* ── Message Thread ── */
        <div className="mx-auto w-full max-w-[720px] space-y-6 px-4 py-6 sm:px-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          {isLoading && <LoadingState />}
          <div ref={bottomRef} aria-hidden="true" className="h-1" />
        </div>
      )}
    </div>
  )
}
