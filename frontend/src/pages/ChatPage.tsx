import { ChatLayout } from '../components/layout/ChatLayout'
import { ChatWindow } from '../components/chat/ChatWindow'
import { PromptBar } from '../components/chat/PromptBar'

export default function ChatPage() {
  return (
    <ChatLayout title="Clinical Intelligence">
      <ChatWindow />
      <div className="border-t border-hairline bg-canvas px-4 py-2 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <PromptBar />
        </div>
      </div>
    </ChatLayout>
  )
}

