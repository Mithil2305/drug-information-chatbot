import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, Check, Copy, FileText, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import type { ChatMessage } from '../../types/chat'
import { CitationBadge } from './CitationBadge'
import { FollowUpList } from './FollowUpList'
import { StreamingText } from './StreamingText'

interface ChatMessageProps {
  message: ChatMessage
  isLast: boolean
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-2xl rounded-2xl bg-primary px-4 py-2.5 text-sm text-white">
        {content}
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void
  icon: LucideIcon
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

function AssistantMessage({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const [done, setDone] = useState(!isLast)
  const [copied, setCopied] = useState(false)
  const { sendMessage } = useChat()
  const onComplete = useCallback(() => setDone(true), [])
  const isStreaming = isLast && !done

  const citations = message.citations ?? []
  const followUps = message.followUps ?? []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-highlight text-fg">
        <Bot className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="max-w-3xl">
          {!isStreaming ? (
            <div className="text-sm leading-relaxed text-fg">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
                  ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-sm leading-relaxed text-fg">
              <StreamingText content={message.content} onComplete={onComplete} />
            </div>
          )}

          {!isStreaming && citations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Citations">
              {citations.map((c) => (
                <CitationBadge key={c.citationId} citation={c} />
              ))}
            </div>
          )}

          {!isStreaming && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
              <div className="flex items-center gap-1.5 text-xs text-fg-muted">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>
                  {citations.length} source{citations.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton onClick={handleCopy} icon={copied ? Check : Copy} label={copied ? 'Copied' : 'Copy answer'} />
                <ActionButton onClick={() => alert('Regenerate coming soon')} icon={RefreshCw} label="Regenerate answer" />
                <ActionButton onClick={() => alert('Feedback recorded')} icon={ThumbsUp} label="Thumbs up" />
                <ActionButton onClick={() => alert('Feedback recorded')} icon={ThumbsDown} label="Thumbs down" />
              </div>
            </div>
          )}

          {!isStreaming && followUps.length > 0 && <FollowUpList questions={followUps} onSelect={sendMessage} />}
        </div>
      </div>
    </div>
  )
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} />
  }

  return <AssistantMessage message={message} isLast={isLast} />
}
