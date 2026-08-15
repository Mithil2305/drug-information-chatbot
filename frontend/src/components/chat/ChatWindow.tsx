import { useEffect, useRef } from 'react'
import { AlertTriangle, FileText, FlaskConical, Search, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { useChat } from '../../hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { LoadingState } from './LoadingState'

export function ChatWindow() {
  const { messages, isLoading, sendMessage } = useChat()
  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const userDisplayName = user?.email 
    ? user.email.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
    : 'Mohanapriyan M'

  const featureCards = [
    {
      icon: FlaskConical,
      title: 'Dosage Analysis',
      subtitle: 'Review dosing schedules & administration',
      query: 'What is the recommended dosage and administration schedule for this drug?',
    },
    {
      icon: AlertTriangle,
      title: 'Warnings & Precautions',
      subtitle: 'Identify critical alerts & safety warnings',
      query: 'What are the critical warnings, precautions, and boxed warnings for this drug?',
    },
    {
      icon: ShieldAlert,
      title: 'Contraindications',
      subtitle: 'Check absolute contraindications',
      query: 'When should this medication NOT be administered or prescribed?',
    },
  ]

  return (
    <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 bg-canvas bg-dot-pattern">
      {/* Ambient Scientific Linework Overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25 dark:opacity-10 select-none" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chat-trace-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3E8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38EDFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d="M -80 160 C 220 140, 380 320, 800 240" fill="none" stroke="url(#chat-trace-grad-1)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 120 540 C 440 480, 640 620, 1000 520" fill="none" stroke="#22D3E8" strokeWidth="0.75" strokeOpacity="0.3" />
          <circle cx="380" cy="320" r="2.5" fill="#22D3E8" fillOpacity="0.5" />
          <circle cx="800" cy="240" r="3" fill="#22D3E8" fillOpacity="0.6" />
          <circle cx="440" cy="480" r="2.5" fill="#22D3E8" fillOpacity="0.4" />
        </svg>
      </div>

      {messages.length === 0 ? (
        <div className="mx-auto max-w-3xl py-8 sm:py-12 flex flex-col text-left select-none relative z-10">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Welcome back, <span className="text-[#22D3E8] font-bold">{userDisplayName}</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Ask questions about approved drug labels and get answers with verified citations.
            </p>
          </div>

          {/* Grid of 3 Precision Rectangular Query Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => sendMessage(card.query)}
                  className="group flex flex-col rounded-[8px] bg-surface p-4 transition-all hover:border-[#20C7DC] hover:bg-surface-raised border border-border shadow-sm text-left cursor-pointer"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                    <Icon className="h-4 w-4 stroke-[2.2] text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xs font-semibold text-text-primary font-sans group-hover:text-[#0891B2] dark:group-hover:text-[#22D3E8] transition-colors">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-text-muted leading-relaxed font-sans">
                    {card.subtitle}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Subtle Clinical Evidence Pipeline Visual */}
          <div className="mt-6 rounded-[8px] border border-[var(--border-workflow)] bg-[var(--bg-workflow)] p-3.5 sm:p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#20C7DC] dark:bg-[#22D3E8]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0891B2] dark:text-accent font-bold">
                  EVIDENCE-FIRST WORKFLOW
                </span>
              </div>
              <span className="font-mono text-[9.5px] text-[#0891B2] dark:text-accent font-semibold bg-[var(--bg-badge-evidence)] px-2 py-0.5 rounded-[4px] border border-[var(--border-badge-evidence)]">
                FDA LABEL GROUNDED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 items-center">
              {/* Step 1: Documents */}
              <div className="flex items-center gap-2.5 rounded-[6px] bg-surface p-2.5 border border-border shadow-sm transition-all hover:border-accent">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                  <FileText className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-text-primary font-sans truncate">1. Drug Labels</div>
                  <div className="text-[9.5px] text-text-tertiary truncate">Approved inserts</div>
                </div>
              </div>

              {/* Step 2: Retrieve Evidence */}
              <div className="flex items-center gap-2.5 rounded-[6px] bg-surface p-2.5 border border-border shadow-sm transition-all hover:border-accent">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                  <Search className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-text-primary font-sans truncate">2. Retrieve Evidence</div>
                  <div className="text-[9.5px] text-text-tertiary truncate">Section-level search</div>
                </div>
              </div>

              {/* Step 3: Grounded Answer */}
              <div className="flex items-center gap-2.5 rounded-[6px] bg-surface p-2.5 border border-border shadow-sm transition-all hover:border-accent">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                  <Sparkles className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-text-primary font-sans truncate">3. Grounded Answer</div>
                  <div className="text-[9.5px] text-text-tertiary truncate">Clinical intelligence</div>
                </div>
              </div>

              {/* Step 4: Page Citations */}
              <div className="flex items-center gap-2.5 rounded-[6px] bg-surface p-2.5 border border-border shadow-sm transition-all hover:border-accent">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
                  <ShieldCheck className="h-3 w-3 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-text-primary font-sans truncate">4. Exact Citations</div>
                  <div className="text-[9.5px] text-text-tertiary truncate">Page & section proofs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      ) : (






        <div className="mx-auto max-w-3xl space-y-4 pb-4">
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
