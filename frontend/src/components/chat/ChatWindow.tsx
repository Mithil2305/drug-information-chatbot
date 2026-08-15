import { useEffect, useRef } from 'react'
import { AlertTriangle, FlaskConical, ShieldAlert } from 'lucide-react'

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
      {messages.length === 0 ? (
        <div className="mx-auto max-w-3xl py-10 sm:py-16 flex flex-col text-left select-none">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Welcome back, <span className="text-[#22D3E8] font-bold">{userDisplayName}</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Ask questions about approved drug labels and get answers with verified citations.
            </p>
          </div>

          {/* Grid of 3 Precision Rectangular Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => sendMessage(card.query)}
                  className="group flex flex-col rounded-[8px] bg-surface p-4 transition-all hover:border-[#22D3E8]/50 hover:bg-surface-raised border border-border shadow-sm text-left cursor-pointer"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#22D3E8]/15 text-[#22D3E8] border border-[#22D3E8]/30 shadow-sm">
                    <Icon className="h-4 w-4 stroke-[2.2] text-[#22D3E8]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xs font-semibold text-text-primary font-sans group-hover:text-[#22D3E8] transition-colors">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-text-muted leading-relaxed font-sans">
                    {card.subtitle}
                  </p>
                </button>
              )
            })}
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
