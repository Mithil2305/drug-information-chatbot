import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
          <span className="text-sm text-fg-muted">Loading…</span>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}
