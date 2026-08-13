import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex items-start gap-3 py-4" role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-ai" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-fg">Searching the document</span>
        <span className="text-xs text-fg-muted">Finding relevant evidence and preparing an answer…</span>
      </div>
    </div>
  )
}
