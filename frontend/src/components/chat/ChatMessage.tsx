import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, Check, Copy, FileText, Sparkles, AlertCircle, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import type { ChatMessage as ChatMessageType } from '../../types/chat'
import { CitationBadge } from './CitationBadge'
import { FollowUpList } from './FollowUpList'
import { StreamingText } from './StreamingText'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
}

/* ── User Bubble ─────────────────────────────────────────────── */
function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '0ms' }}>
      <div className="flex items-end gap-2.5 max-w-[85%] md:max-w-2xl">
        <div className="rounded-3xl rounded-br-sm bg-primary px-5 py-3.5 text-sm text-white shadow-card">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Action Icon Button ──────────────────────────────────────── */
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
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-all duration-150 hover:bg-surface-highlight hover:text-fg"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  )
}

function AssistantMessage({ message, isLast }: { message: ChatMessageType; isLast: boolean }) {
  const [done, setDone] = useState(!isLast)
  const [copied, setCopied] = useState(false)
  const { sendMessage, selectedMessageId, setSelectedMessageId } = useChat()
  const onComplete = useCallback(() => setDone(true), [])
  const isStreaming = isLast && !done

  const citations = message.citations ?? []
  const followUps = message.followUps ?? []
  const isSelected = selectedMessageId === message.id

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const isAbstaining =
    message.status === 'insufficient_evidence' ||
    message.content.toLowerCase().includes("couldn't find sufficient information")

  return (
    <div
      onClick={() => setSelectedMessageId(message.id)}
      className="flex items-start gap-3 animate-fade-in-up"
      style={{ animationDelay: '30ms' }}
    >

      <div className="min-w-0 flex-1">
        <div
          className={`max-w-3xl transition-all duration-200 `}
        >
          {/* Status Header */}
            <div className="mb-3.5 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-primary">LabelProof Assistant</span>
              {isAbstaining ? (
                <span className="inline-flex items-center gap-1 rounded-pill bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
                  <AlertCircle className="h-2.5 w-2.5" />
                  <span>Clinical Abstention</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-pill bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Grounded Answer</span>
                </span>
              )}
            </div>
            {citations.length > 0 && (
              <span className="text-[10px] text-fg-muted font-mono tabular-nums">
                {citations.length} source{citations.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {/* Answer Text */}
          {!isStreaming ? (
            <div className="prose-chat text-sm leading-relaxed text-fg">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                  ul: ({ children }) => <ul className="mb-2.5 list-disc pl-5 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2.5 list-decimal pl-5 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <StreamingText content={message.content} onComplete={onComplete} />
          )}
        </div>

          {/* Citation Badges */}
          {!isStreaming && citations.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted mb-2.5">
                Supporting Citations
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Citations">
                {citations.map((c) => (
                  <CitationBadge key={c.citationId} citation={c} />
                ))}
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          {!isStreaming && (
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                <FileText className="h-3 w-3 text-accent shrink-0" />
                <span>
                  {citations.length > 0
                    ? 'Click a citation to inspect the source'
                    : 'No external sources cited'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton
                  onClick={handleCopy}
                  icon={copied ? Check : Copy}
                  label={copied ? 'Copied!' : 'Copy answer'}
                />
              </div>
            </div>
          )}

          {/* Follow-up Suggestions */}
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

export default ChatMessage
