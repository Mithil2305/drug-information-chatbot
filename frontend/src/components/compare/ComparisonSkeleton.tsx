const SKELETON_ROWS = 8

export function ComparisonSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 border-b border-border px-4 py-4">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-32 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-28 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>

      {/* Row skeletons */}
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 border-b border-border/60 px-4 py-4"
        >
          <div className="skeleton h-4 w-24 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ComparisonSkeleton
