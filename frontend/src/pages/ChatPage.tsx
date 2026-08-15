import { ChatLayout } from '../components/layout/ChatLayout'
import { ChatWindow } from '../components/chat/ChatWindow'
import { PromptBar } from '../components/chat/PromptBar'

export default function ChatPage() {
  return (
    <ChatLayout>
      {/* Scrollable message area */}
      <ChatWindow />

      {/* Sticky composer */}
      <div className="shrink-0 border-t border-line bg-background px-4 pb-4 pt-3 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <PromptBar />
        </div>
      </div>
    </ChatLayout>
  )
}
