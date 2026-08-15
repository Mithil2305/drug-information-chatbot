import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, BookOpen, Layers, ArrowLeft } from 'lucide-react'
import { ChatLayout } from '../components/layout/ChatLayout'
import { ChatWindow } from '../components/chat/ChatWindow'
import { PromptBar } from '../components/chat/PromptBar'
import { EvidencePanel } from '../components/evidence/EvidencePanel'
import { useChat } from '../hooks/useChat'
import { useDocuments } from '../hooks/useDocuments'

export default function ChatPage() {
  const { activeCitations } = useChat()
  const { documents } = useDocuments()
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false)

  const readyDocs = documents.filter((d) => d.status === 'ready')

  return (
    <ChatLayout>
      <div className="flex h-full w-full overflow-hidden">
        {/* CENTER COLUMN: Chat Header, Conversation, Input */}
        <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
          {/* Top Bar for Chat Page */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-primary transition-colors"
                title="Return to Home"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                  <ShieldCheck className="h-4 w-4 text-surface-warm" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-primary">LabelProof Assistant</h2>
                  <p className="text-[10px] text-fg-muted">
                    {readyDocs.length} approved label{readyDocs.length === 1 ? '' : 's'} active
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/drugs"
                className="hidden sm:inline-flex items-center gap-1 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-semibold text-fg hover:border-primary hover:text-primary transition-colors"
              >
                <BookOpen className="h-3 w-3 text-accent" />
                <span>Drug Library</span>
              </Link>

              {/* Mobile / Tablet Toggle for Evidence Drawer */}
              <button
                type="button"
                onClick={() => setEvidenceDrawerOpen(!evidenceDrawerOpen)}
                className="inline-flex xl:hidden items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary hover:bg-surface-highlight transition-colors"
              >
                <Layers className="h-3.5 w-3.5 text-accent" />
                <span>Sources ({activeCitations.length})</span>
              </button>
            </div>
          </header>

          {/* Conversation Stream */}
          <ChatWindow />

          {/* Sticky Bottom Prompt Input */}
          <div className="border-t border-border bg-background/95 p-4 backdrop-blur-xs">
            <div className="mx-auto max-w-3xl">
              <PromptBar />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence / Source Verification Panel (Desktop >= 1280px) */}
        <div className="hidden xl:block w-80 2xl:w-96 shrink-0 h-full">
          <EvidencePanel />
        </div>

        {/* Mobile / Tablet Evidence Drawer Modal */}
        {evidenceDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs xl:hidden">
            <div className="h-full w-full max-w-md bg-surface shadow-2xl">
              <EvidencePanel isMobileDrawer onClose={() => setEvidenceDrawerOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </ChatLayout>
  )
}
