import { useState } from 'react'
import { ChatLayout } from '../components/layout/ChatLayout'
import { ChatWindow } from '../components/chat/ChatWindow'
import { PromptBar } from '../components/chat/PromptBar'
import { EvidencePanel } from '../components/evidence/EvidencePanel'

export default function ChatPage() {
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false)

  return (
    <ChatLayout>
      <div className="flex h-full w-full overflow-hidden">
        {/* CENTER COLUMN: Chat Header, Conversation, Input */}
        <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">

          {/* Conversation Stream */}
          <ChatWindow />

          {/* Sticky Bottom Prompt Input */}
          <div className="bg-transparent p-4 backdrop-blur-xs">
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

