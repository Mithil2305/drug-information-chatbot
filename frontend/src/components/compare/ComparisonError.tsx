import { AlertCircle, RotateCcw } from 'lucide-react'

interface ComparisonErrorProps {
  message?: string
  onRetry: () => void
}

export function ComparisonError({ message, onRetry }: ComparisonErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-10 text-center animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-fg">Unable to compare these documents.</h3>
      <p className="mt-1 text-sm text-fg-muted">
        {message || 'Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-subtle"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Try again</span>
      </button>
    </div>
  )
}

export default ComparisonError
