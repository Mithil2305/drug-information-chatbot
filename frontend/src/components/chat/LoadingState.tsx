export function LoadingState() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">

      <div className="rounded-3xl ">
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full bg-accent"
              style={{ animation: 'pulse-dot 1.2s ease-in-out infinite', animationDelay: '0ms' }}
            />
            <span
              className="h-2 w-2 rounded-full bg-accent"
              style={{ animation: 'pulse-dot 1.2s ease-in-out infinite', animationDelay: '200ms' }}
            />
            <span
              className="h-2 w-2 rounded-full bg-accent"
              style={{ animation: 'pulse-dot 1.2s ease-in-out infinite', animationDelay: '400ms' }}
            />
          </div>
          <span className="text-xs font-semibold text-primary">
            Searching trusted documentation…
          </span>
        </div>
        <p className="mt-2 text-[11px] text-fg-muted">
          Matching your query against approved prescribing labels.
        </p>
      </div>
    </div>
  )
}

export default LoadingState
