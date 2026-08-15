import { Bot } from 'lucide-react'

export function LoadingState() {
  return (
    <div
      className="flex items-start gap-3 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label="Searching for an answer"
    >
      {/* Avatar matching AssistantMessage */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft mt-0.5">
        <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1.5 pt-0.5">
        {/* Dot pulse loader */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-primary dot-bounce" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary dot-bounce" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary dot-bounce" />
        </div>
        <span className="text-xs text-fg-subtle">
          Searching the document…
        </span>
      </div>
    </div>
  )
}
