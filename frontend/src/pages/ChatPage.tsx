import { ChatLayout } from '../components/layout/ChatLayout'
import { ChatWindow } from '../components/chat/ChatWindow'
import { PromptBar } from '../components/chat/PromptBar'

export default function ChatPage() {
  return (
    <ChatLayout>
      <ChatWindow />
      <div className="border-t border-line bg-surface p-4">
        <div className="mx-auto max-w-3xl">
          <PromptBar />
        </div>
      </div>
    </ChatLayout>
  )
}
