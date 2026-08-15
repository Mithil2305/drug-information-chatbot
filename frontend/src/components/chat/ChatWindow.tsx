import { useEffect, useRef } from 'react'
import { ShieldCheck, Pill, AlertTriangle, Clock, Layers, Sparkles } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useDocuments } from '../../hooks/useDocuments'
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
  const { messages, isLoading, sendMessage } = useChat()
  const { documents } = useDocuments()
  const bottomRef = useRef<HTMLDivElement>(null)

  const readyDocs = documents.filter((d) => d.status === 'ready')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const suggestions = [
    {
      icon: Clock,
      label: 'Dosage & Administration',
      query: 'What is the recommended dosage and administration schedule?',
    },
    {
      icon: AlertTriangle,
      label: 'Boxed Warnings',
      query: 'What are the major boxed warnings and precautions for this drug?',
    },
    {
      icon: Pill,
      label: 'Contraindications',
      query: 'What are the contraindications and high-risk patient groups?',
    },
    {
      icon: Layers,
      label: 'Adverse Reactions',
      query: 'What are the most common adverse reactions reported in clinical trials?',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-5 relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-white shadow-hover">
              <ShieldCheck className="h-8 w-8 text-surface-warm" />
            </div>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success border-2 border-background">
              <span className="block h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            LabelProof AI Assistant
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-secondary">
            Evidence-grounded pharmaceutical information. Ask questions about approved drug labels and receive answers backed by page-level citations.
          </p>

          {/* Status badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-fg shadow-subtle">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>
              {readyDocs.length} Active Prescribing Document{readyDocs.length === 1 ? '' : 's'} Loaded
            </span>
          </div>

          {/* Suggestion chips */}
          <div className="mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-w-lg w-full">
            {suggestions.map((sug) => {
              const Icon = sug.icon
              return (
                <button
                  key={sug.label}
                  type="button"
                  onClick={() => sendMessage(sug.query)}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-subtle transition-all duration-200 hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-surface-highlight text-primary border border-border transition-colors group-hover:bg-primary/8 group-hover:border-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-primary">{sug.label}</span>
                    <span className="mt-0.5 block text-[11px] text-fg-muted line-clamp-1">{sug.query}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-7 px-4 py-8 pb-6 sm:px-6 lg:px-8">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          {isLoading && <LoadingState />}
          <div ref={bottomRef} aria-hidden="true" className="h-2" />
        </div>
      )}
    </div>
  )
}

export default ChatWindow
