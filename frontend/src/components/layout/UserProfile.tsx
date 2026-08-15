import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface UserProfileProps {
  collapsed: boolean
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const { user, logout } = useAuth()

  const displayName = user?.email 
    ? user.email.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Mohanapriyan M'
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'MM'

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-3 border-t border-border bg-sidebar">
        <div 
          className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-tint text-accent font-mono text-[10px] font-bold border border-accent/25 shadow-sm"
          title={user?.email || 'User profile'}
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-danger cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-t border-border bg-sidebar px-3 py-2.5">
      {/* System Status Line */}
      <div className="flex items-center gap-2 px-1 pb-2 mb-1 border-b border-border/50 text-[10px] font-mono text-text-tertiary">
        <span className="h-1.5 w-1.5 rounded-full bg-[#3FCB78] animate-pulse" />
        <span>System · Operational</span>
      </div>

      {/* Account Info & Logout */}
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22D3E8]/15 text-[#22D3E8] font-mono text-[10px] font-bold border border-[#22D3E8]/30">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-text-primary font-sans">
              {displayName}
            </div>
            <div className="truncate text-[10px] text-text-tertiary">
              {user?.email || 'user@labelproof.ai'}
            </div>
          </div>
        </div>


        <button
          type="button"
          onClick={logout}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-surface-raised hover:text-danger cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}







