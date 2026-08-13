
interface UserProfileProps {
  collapsed: boolean
}

export function UserProfile({ collapsed }: UserProfileProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <span className="text-xs font-bold">MM</span>
        </div>
        {/* <button
          type="button"
          onClick={() => alert('Settings coming soon')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
          aria-label="Settings"
          title="Settings"
        >
          <Cog className="h-4 w-4" aria-hidden="true" />
        </button> */}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface-highlight">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <span className="text-xs font-bold">MM</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-fg">Mohanapriyan M</div>
          <div className="truncate text-xs text-fg-muted">LabelProof User</div>
        </div>
      </div>
      {/* <button
        type="button"
        onClick={() => alert('Settings coming soon')}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg"
        aria-label="Settings"
        title="Settings"
      >
        <Cog className="h-4 w-4" aria-hidden="true" />
      </button> */}
    </div>
  )
}
