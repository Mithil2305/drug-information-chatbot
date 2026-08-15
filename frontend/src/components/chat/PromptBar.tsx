import { useRef, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { useChat } from '../../hooks/useChat'

export function PromptBar() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, isLoading } = useChat()

  const canSend = !isLoading && value.trim().length > 0

  const handleSubmit = () => {
    if (!canSend) return
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
    target.style.height = `${Math.min(target.scrollHeight, 180)}px`
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="relative w-full rounded-2xl border border-line bg-surface shadow-sm transition-shadow focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
    >
      <div className="flex items-end gap-2 px-4 py-3">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this document…"
          disabled={isLoading}
          className="max-h-[180px] min-h-[28px] w-full resize-none bg-transparent py-0.5 text-[15px] leading-relaxed text-fg placeholder-fg-subtle outline-none disabled:opacity-60"
          aria-label="Message input"
          aria-multiline="true"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!canSend}
          aria-label={isLoading ? 'Sending…' : 'Send message'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Hint */}
      <div className="px-4 pb-2.5 text-[11px] text-fg-subtle">
        <kbd className="rounded border border-line px-1 py-0.5 font-mono text-[10px]">
          Enter
        </kbd>{' '}
        to send ·{' '}
        <kbd className="rounded border border-line px-1 py-0.5 font-mono text-[10px]">
          Shift
        </kbd>
        +
        <kbd className="rounded border border-line px-1 py-0.5 font-mono text-[10px]">
          Enter
        </kbd>{' '}
        for new line
      </div>
    </form>
  )
}
