export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium uppercase text-fg-muted">OR</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}
