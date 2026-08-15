import { GitCompareArrows } from 'lucide-react'

export function ComparisonEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GitCompareArrows className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-fg">Compare two drug labels</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-fg-muted">
        Select two approved drug documents above to compare their clinical information side-by-side.
      </p>
    </div>
  )
}

export default ComparisonEmptyState
