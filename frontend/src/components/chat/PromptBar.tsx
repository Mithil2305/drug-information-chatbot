import { useRef, useState, useEffect } from 'react'
import { Send, FileText, Loader2, Paperclip } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useDocuments } from '../../hooks/useDocuments'
import { useSearchParams } from 'react-router-dom'

export function PromptBar() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, isLoading } = useChat()
  const { documents } = useDocuments()
  const [searchParams] = useSearchParams()

  const readyDocs = documents.filter((d) => d.status === 'ready')

  // Pick up query param from URL if present
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !value) {
      setValue(q)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSubmit = () => {
    if (!canSubmit) return
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

  const canSubmit = !isLoading && !!value.trim()

  return (
    <div className="w-full space-y-2">

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="relative flex items-end gap-3 rounded-3xl border border-border bg-surface p-3.5 shadow-card transition-all duration-200 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
      >
        {/* Left icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-surface-highlight text-accent">
          <Paperclip className="h-4 w-4 attach-documents" />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about dosage, warnings, contraindications, adverse reactions…"
          className="max-h-36 w-full resize-none bg-transparent px-1 py-1 text-sm leading-relaxed text-fg placeholder:text-fg-muted focus:outline-none"
          aria-label="Ask about medication"
          disabled={isLoading}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-subtle transition-all duration-150 hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Send clinical inquiry"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  )
}

export default PromptBar
