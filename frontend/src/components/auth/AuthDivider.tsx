export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">Or continue with</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
