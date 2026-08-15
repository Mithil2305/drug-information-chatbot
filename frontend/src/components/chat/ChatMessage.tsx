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

/* ── User Bubble ─────────────────────────────────────────────── */
function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-white sm:max-w-[65%]">
        {content}
      </div>
    </div>
  )
}

/* ── Action Icon Button ──────────────────────────────────────── */
function ActionButton({
  onClick,
  icon: Icon,
  label,
  active,
}: {
  onClick: () => void
  icon: LucideIcon
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-surface-highlight ${
        active ? 'text-primary' : 'text-fg-subtle hover:text-fg-muted'
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  )
}

/* ── Assistant Bubble ────────────────────────────────────────── */
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
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft mt-0.5">
        <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        {/* Answer Content */}
        <div className="text-[15px] leading-[1.65] text-fg prose-chat">
          {!isStreaming ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-fg">{children}</strong>
                ),
                ul: ({ children }) => <ul className="list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                code: ({ children }) => <code>{children}</code>,
                pre: ({ children }) => <pre>{children}</pre>,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                h1: ({ children }) => <h1 className="text-lg">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <StreamingText content={message.content} onComplete={onComplete} />
          )}
        </div>

        {/* Citations */}
        {!isStreaming && citations.length > 0 && (
          <div
            className="mt-3 flex flex-wrap gap-1.5"
            role="list"
            aria-label="Source citations"
          >
            {citations.map((c) => (
              <CitationBadge key={c.citationId} citation={c} />
            ))}
          </div>
        )}

        {/* Actions Row */}
        {!isStreaming && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5">
            {/* Source count */}
            <div className="flex items-center gap-1.5 text-xs text-fg-subtle">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {citations.length === 0
                  ? 'No sources'
                  : citations.length === 1
                  ? '1 source'
                  : `${citations.length} sources`}
              </span>
            </div>

            {/* Icon Actions */}
            <div className="flex items-center gap-0.5">
              <ActionButton
                onClick={handleCopy}
                icon={copied ? Check : Copy}
                label={copied ? 'Copied!' : 'Copy answer'}
                active={copied}
              />
              <ActionButton
                onClick={() => alert('Regenerate coming soon')}
                icon={RefreshCw}
                label="Regenerate answer"
              />
              <div className="mx-1 h-3.5 w-px bg-line" aria-hidden="true" />
              <ActionButton
                onClick={() => alert('Feedback recorded')}
                icon={ThumbsUp}
                label="Helpful"
              />
              <ActionButton
                onClick={() => alert('Feedback recorded')}
                icon={ThumbsDown}
                label="Not helpful"
              />
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {!isStreaming && followUps.length > 0 && (
          <FollowUpList questions={followUps} onSelect={sendMessage} />
        )}
      </div>
    </div>
  )
}

/* ── Exported Component ──────────────────────────────────────── */
export function ChatMessage({ message, isLast }: ChatMessageProps) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} />
  }
  return <AssistantMessage message={message} isLast={isLast} />
}
