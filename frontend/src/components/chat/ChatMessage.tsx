import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AlertCircle, Check, Copy, FileText, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import type { ChatMessage as ChatMessageType, Citation } from '../../types/chat'
import { CitationBadge } from './CitationBadge'
import { FollowUpList } from './FollowUpList'
import { StreamingText } from './StreamingText'
import { EvidencePanel } from '../evidence/EvidencePanel'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex flex-col items-end my-4">
      <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-text-muted mb-1 mr-1 font-bold">
        YOU
      </span>
      <div className="max-w-[85%] sm:max-w-xl rounded-[8px] bg-[var(--bg-user-bubble)] border border-[var(--border-user-bubble)] px-4 py-2.5 text-[13.5px] leading-relaxed text-text-primary shadow-sm font-sans">
        {content}
      </div>
    </div>
  )
}

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
      className={`flex h-6 px-2 items-center gap-1.5 rounded-[5px] text-xs font-sans transition-colors cursor-pointer ${
        active 
          ? 'bg-[#22D3E8]/15 text-[#22D3E8] font-bold' 
          : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span className="hidden sm:inline text-[11px]">{label}</span>
    </button>
  )
}

function AssistantMessage({ message, isLast }: { message: ChatMessageType; isLast: boolean }) {
  const [done, setDone] = useState(!isLast)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null)
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
    <>
      {/* Clinical Evidence Report Layout */}
      <div className="my-5 relative pl-4 border-l-2 border-[#20C7DC] dark:border-[#22D3E8] py-1">
        <div className="min-w-0 flex-1">
          {/* AI Response Identity Header */}
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                <Sparkles className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
              </div>

              <span className="font-sans text-xs font-bold tracking-wider uppercase text-text-primary">
                LABELPROOF AI
              </span>
              <span className="text-[11px] text-text-tertiary font-mono">·</span>
              <span className="text-[11px] text-[#0891B2] dark:text-[#22D3E8] font-semibold">
                Evidence-backed response
              </span>
            </div>

            <div className="flex items-center gap-2">
              {message.status === 'grounded' || !message.status ? (
                <span className="inline-flex items-center gap-1 rounded-[5px] bg-[var(--bg-badge-evidence)] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0891B2] dark:text-[#22D3E8] border border-[var(--border-badge-evidence)]">
                  <ShieldCheck className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" />
                  Evidence-backed
                </span>
              ) : message.status === 'insufficient_evidence' ? (
                <span className="inline-flex items-center gap-1 rounded-[5px] bg-warning/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-warning border border-warning/20">
                  <AlertCircle className="h-3 w-3" />
                  Unverified
                </span>
              ) : null}
            </div>
          </div>



          {/* Clinical Reading Content */}
          {!isStreaming ? (
            <div className="text-[15px] leading-[1.7] text-text-primary space-y-3 font-sans">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2.5 leading-[1.7] text-text-primary last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-text-primary bg-accent-tint px-1 py-0.5 rounded-[4px] text-accent">{children}</strong>,
                  h1: ({ children }) => <h1 className="font-sans text-base sm:text-lg font-semibold text-text-primary mt-4 mb-2 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="font-sans text-sm sm:text-base font-semibold text-text-primary mt-3.5 mb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mt-3 mb-1">{children}</h3>,
                  ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1 text-text-secondary">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1 text-text-secondary">{children}</ol>,
                  li: ({ children }) => <li className="leading-[1.7] text-text-secondary">{children}</li>,
                  hr: () => <hr className="my-3.5 border-border" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-[15px] leading-[1.7] text-text-primary font-sans">
              <StreamingText content={message.content} onComplete={onComplete} />
            </div>
          )}

          {/* Prominent Evidence / Citation Sources */}
          {!isStreaming && citations.length > 0 && (
            <div className="mt-5 border-t border-border pt-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-text-muted font-semibold">
                  SOURCE
                </span>
              </div>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Citations">
                {citations.map((c) => (
                  <CitationBadge 
                    key={c.citationId} 
                    citation={c} 
                    onClick={() => setActiveCitation(c)}
                  />
                ))}
              </div>
            </div>
          )}


          {/* Assistant Action Bar Footer */}
          {!isStreaming && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-[11px] text-text-muted font-sans">
              <div className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>
                  {citations.length} Evidence Source{citations.length === 1 ? '' : 's'} verified
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton onClick={handleCopy} icon={copied ? Check : Copy} label={copied ? 'Copied' : 'Copy'} />
                <ActionButton 
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')} 
                  icon={ThumbsUp} 
                  label="Helpful" 
                  active={feedback === 'up'}
                />
                <ActionButton 
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')} 
                  icon={ThumbsDown} 
                  label="Not helpful" 
                  active={feedback === 'down'}
                />
              </div>
            </div>
          )}

          {/* Follow-up suggestions */}
          {!isStreaming && followUps.length > 0 && (
            <div className="mt-3">
              <FollowUpList questions={followUps} onSelect={sendMessage} />
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Evidence Panel on right */}
      <EvidencePanel citation={activeCitation} onClose={() => setActiveCitation(null)} />
    </>
  )
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} />
  }

  return <AssistantMessage message={message} isLast={isLast} />
}


