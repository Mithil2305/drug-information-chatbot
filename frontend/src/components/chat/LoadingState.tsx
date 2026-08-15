import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="my-4 flex items-start gap-3 pl-4 border-l-2 border-accent py-2" role="status" aria-live="polite">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-accent-tint text-accent border border-accent/25">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5 rounded-[6px] bg-surface px-3.5 py-2 max-w-md border border-border shadow-sm">
        <span className="text-xs font-semibold text-text-primary font-sans">
          Searching the document...
        </span>
        <span className="text-[11px] text-text-muted font-sans leading-relaxed">
          Finding relevant evidence and preparing an answer.
        </span>
      </div>
    </div>
  )
}

