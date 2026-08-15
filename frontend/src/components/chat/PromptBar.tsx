import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Plus, Send, Mic, FileText, X, Loader2, FolderOpen } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useDocuments } from '../../hooks/useDocuments'
import { useSearchParams } from 'react-router-dom'
import { DocumentSelectorModal } from './DocumentSelectorModal'

export function PromptBar() {
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [listening, setListening] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isLoading } = useChat()
  const { documents } = useDocuments()
  const [searchParams] = useSearchParams()

  const readyDocs = documents.filter((d) => d.status === 'ready')
  const selectedDocs = readyDocs.filter((d) => selectedDocIds.includes(d.id))
  const allSelected = selectedDocIds.length === readyDocs.length && readyDocs.length > 0

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !value) {
      setValue(q)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useLayoutEffect(() => {
    const input = textareaRef.current
    const measure = measureRef.current
    if (!input) return

    const minHeight = 28
    const maxHeight = 120
    input.style.height = '0px'
    const contentHeight = input.scrollHeight
    input.style.height = `${Math.min(Math.max(contentHeight, minHeight), maxHeight)}px`
    input.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'

    if (measure) {
      const needsExpand = value.includes('\n') || measure.offsetWidth + 8 > input.clientWidth
      if (needsExpand !== expanded) setExpanded(needsExpand)
    }
  }, [value, expanded])

  const canSubmit = !isLoading && !!value.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    sendMessage(value.trim())
    setValue('')
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    setAttachments((prev) => [...prev, ...names])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleListening = () => {
    setListening((prev) => !prev)
    if (!listening) {
      setTimeout(() => {
        setListening(false)
        textareaRef.current?.focus()
      }, 2500)
    }
  }

  return (
    <div className="w-full">
      {/* selected document chips — shown above the composer */}
      {selectedDocIds.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5 px-0.5">
          {allSelected ? (
            <span className="flex h-7 items-center gap-1.5 rounded-lg bg-primary/10 py-1 pr-1 pl-2 text-[11.5px] font-medium text-primary animate-fade-in">
              <FileText className="h-3 w-3 shrink-0" />
              <span>All documents</span>
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => setSelectedDocIds([])}
                className="flex h-4 w-4 items-center justify-center rounded text-primary/60 transition-colors hover:bg-primary/20 hover:text-primary"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ) : (
            selectedDocs.map((doc) => (
              <span
                key={doc.id}
                className="flex h-7 items-center gap-1.5 rounded-lg bg-surface-highlight py-1 pr-1 pl-2 text-[11.5px] text-fg-muted animate-fade-in"
              >
                <FileText className="h-3 w-3 shrink-0 text-accent" />
                <span className="max-w-36 truncate">{doc.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${doc.name}`}
                  onClick={() =>
                    setSelectedDocIds((prev) => prev.filter((id) => id !== doc.id))
                  }
                  className="flex h-4 w-4 items-center justify-center rounded text-fg-muted transition-colors hover:bg-border hover:text-fg"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))
          )}
        </div>
      )}

      <div
        className={`relative isolate flex flex-col gap-1.5 overflow-hidden border border-border bg-surface p-2 shadow-card transition-all duration-150 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 ${
          attachments.length > 0 || expanded ? 'rounded-2xl' : 'rounded-full'
        }`}
      >
        {/* hidden measure span for auto-expand */}
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none absolute invisible whitespace-pre text-[13px] leading-[18px]"
        >
          {value}
        </span>

        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.docx,.doc"
        />

        {/* attachment chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 px-0.5">
            {attachments.map((file, i) => (
              <span
                key={`${file}-${i}`}
                className="flex h-7 items-center gap-1.5 rounded-lg bg-surface-highlight py-1 pr-1 pl-2 text-[11.5px] text-fg-muted animate-fade-in"
              >
                <FileText className="h-3 w-3 shrink-0 text-accent" />
                <span className="max-w-36 truncate">{file}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file}`}
                  onClick={() => removeAttachment(i)}
                  className="flex h-4 w-4 items-center justify-center rounded text-fg-muted transition-colors hover:bg-border hover:text-fg"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* controls row */}
        <div
          ref={controlsRef}
          className={`grid items-end gap-x-1 gap-y-1.5 ${
            expanded
              ? 'grid-cols-[28px_28px_28px_28px]'
              : 'grid-cols-[28px_minmax(0,1fr)_28px_28px_28px]'
          }`}
        >
          {/* plus / file upload button */}
          <button
            type="button"
            aria-label="Upload files"
            onClick={() => fileInputRef.current?.click()}
            className={`flex h-7 w-7 shrink-0 items-center justify-center justify-self-start rounded-lg text-fg-muted transition-all duration-150 hover:bg-surface-highlight hover:text-fg active:scale-95 ${
              attachments.length > 0 ? 'text-primary' : ''
            } ${expanded ? 'col-start-1 row-start-2' : 'col-start-1 row-start-1'}`}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>

          {/* textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={listening ? 'Listening…' : 'Ask about dosage, warnings, contraindications…'}
            aria-label="Ask about medication"
            disabled={isLoading}
            className={`min-h-7 min-w-0 w-full resize-none bg-transparent px-1 py-[5px] text-[13px] leading-[18px] text-fg outline-none [overflow-wrap:anywhere] placeholder:text-fg-muted ${
              expanded ? 'col-span-full col-start-1 row-start-1' : 'col-start-2 row-start-1'
            }`}
          />

          {/* document selector button */}
          <button
            type="button"
            aria-label="Select saved documents"
            onClick={() => setDocModalOpen(true)}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${
              selectedDocIds.length > 0
                ? 'bg-primary/10 text-primary'
                : 'text-fg-muted hover:bg-surface-highlight hover:text-fg'
            } ${expanded ? 'col-start-2 row-start-2' : 'col-start-3 row-start-1'}`}
          >
            <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          {/* mic / dictation button */}
          <button
            type="button"
            aria-label={listening ? 'Stop dictation' : 'Start dictation'}
            aria-pressed={listening}
            onClick={toggleListening}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${
              listening
                ? 'bg-primary/10 text-primary'
                : 'text-fg-muted hover:bg-surface-highlight hover:text-fg'
            } ${expanded ? 'col-start-3 row-start-2' : 'col-start-4 row-start-1'}`}
          >
            {listening ? (
              <span className="flex h-3.5 items-center gap-[2.5px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[2.5px] rounded-full bg-current"
                    style={{
                      height: '100%',
                      animation: `eq-bounce 900ms ease-in-out ${i * 150}ms infinite`,
                    }}
                  />
                ))}
              </span>
            ) : (
              <Mic className="h-3.5 w-3.5" strokeWidth={2} />
            )}
          </button>

          {/* send button */}
          <button
            type="button"
            aria-label="Send clinical inquiry"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 enabled:active:scale-95 ${
              expanded ? 'col-start-4 row-start-2' : 'col-start-5 row-start-1'
            }`}
            style={{
              background: canSubmit ? 'var(--color-primary)' : 'var(--color-border)',
              color: canSubmit ? 'var(--color-surface)' : 'var(--color-foreground-muted)',
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" strokeWidth={2.4} />
            )}
          </button>
        </div>
      </div>

      <DocumentSelectorModal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        documents={documents}
        selectedIds={selectedDocIds}
        onConfirm={setSelectedDocIds}
      />
    </div>
  )
}

export default PromptBar
