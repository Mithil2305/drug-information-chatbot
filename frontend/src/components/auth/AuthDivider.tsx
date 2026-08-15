export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-line" />
      <span className="text-[11px] font-medium uppercase tracking-widest text-fg-subtle">
        or
      </span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}
