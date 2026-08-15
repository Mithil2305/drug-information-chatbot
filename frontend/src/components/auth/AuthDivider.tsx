export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border-subtle" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">OR</span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  )
}
