
import { useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth'

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

  const displayName = useMemo(() => {
    const candidates = [user?.name, user?.full_name, user?.username, user?.display_name]
    const resolved = candidates.find((value): value is string => Boolean(value && value.trim()))
    if (resolved) return resolved.trim()
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }, [user])

  const subtitle = user?.role ? user.role.replace(/_/g, ' ') : 'LabelProof User'
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-subtle">
          <span className="text-xs font-bold">{initials}</span>
        </div>
        {/* <button
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
    <div className="flex items-center justify-between rounded-2xl px-2 py-2 transition-colors hover:bg-surface-highlight">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-subtle">
          <span className="text-xs font-bold">{initials}</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-fg">{displayName}</div>
          <div className="truncate text-xs text-fg-muted">{subtitle}</div>
        </div>
        <div className="truncate text-xs text-fg-muted leading-tight">{role}</div>
      </div>
    </button>
  )
}
