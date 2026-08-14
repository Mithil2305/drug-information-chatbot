import { useRef, useState } from 'react'
import { Plus, Send } from 'lucide-react'
import { useChat } from '../../hooks/useChat'

export function PromptBar() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, isLoading } = useChat()

  const handleSubmit = () => {
    if (isLoading || !value.trim()) return
    sendMessage(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    setValue(target.value)
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="w-full border border-line bg-surface p-3 shadow-sm rounded-2xl"
    >
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => alert('Document upload coming soon')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Attach document"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this document…"
          className="max-h-40 w-full resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder-fg-muted outline-none"
          aria-label="Message"
        />

        {/* <div className="hidden shrink-0 items-center gap-1 rounded-lg border border-line bg-surface-highlight px-3 py-2 text-sm font-medium text-fg sm:flex">
          <span>RAG-1</span>
          <ChevronDown className="h-4 w-4 text-fg-muted" aria-hidden="true" />
        </div> */}

        {/* <button
          type="button"
          onClick={() => alert('Voice input coming soon')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Use microphone"
        >
          <Mic className="h-5 w-5" aria-hidden="true" />
        </button> */}

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
