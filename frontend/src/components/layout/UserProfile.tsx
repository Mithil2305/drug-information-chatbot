import { useAuth } from '../../hooks/useAuth'
import { Tooltip } from '../common/Tooltip'

interface UserProfileProps {
  collapsed: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const { user } = useAuth()

  const displayName = user?.email
    ? user.email.split('@')[0].replace(/[._-]/g, ' ')
    : 'Mohanapriyan M'
  const initials = getInitials(displayName)
  const role = 'LabelProof User'

  if (collapsed) {
    return (
      <Tooltip content={displayName} side="right">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-80"
          aria-label={`User: ${displayName}`}
        >
          <span className="text-xs font-semibold leading-none">{initials}</span>
        </button>
      </Tooltip>
    )
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-highlight"
      aria-label="User profile"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
        <span className="text-xs font-semibold text-white leading-none">
          {initials}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-fg leading-tight">
          {displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </div>
        <div className="truncate text-xs text-fg-muted leading-tight">{role}</div>
      </div>
    </button>
  )
}
