import { useRef, useState } from 'react'
import { ArrowUp, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { useChat } from '../../hooks/useChat'
import { useDocuments } from '../../hooks/useDocuments'

export function PromptBar() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isLoading } = useChat()
  const { uploadDocument } = useDocuments()

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
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF drug label documents are supported')
      return
    }
    uploadDocument(file)
    e.target.value = ''
  }

  return (
    <div className="w-full flex flex-col items-center gap-2 pb-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="w-full rounded-[14px] sm:rounded-full bg-surface px-4 py-2 transition-all border border-border shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-raised hover:text-text-primary cursor-pointer"
            aria-label="Upload document PDF"
            title="Upload document PDF"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the clinical documentation..."
            className="max-h-36 w-full resize-none bg-transparent py-1 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary outline-none leading-relaxed font-sans border-none"
            aria-label="Clinical Query"
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* Filled Circular Cyan Send button */}
            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22D3E8] text-[#0D1220] font-bold transition-all hover:bg-[#38EDFF] disabled:cursor-not-allowed disabled:opacity-30 shadow-sm cursor-pointer"
              aria-label="Send query"
            >
              <ArrowUp className="h-4 w-4 stroke-[3]" aria-hidden="true" />
            </button>
          </div>

        </div>
      </form>

      {/* Clinical verification disclaimer */}
      <p className="text-center font-sans text-[10.5px] text-text-tertiary">
        Clinical responses are grounded in approved drug labels with section citations.
      </p>
    </div>

  )
}









