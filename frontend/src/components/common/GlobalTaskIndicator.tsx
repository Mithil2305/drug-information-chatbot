import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useTask } from '../../hooks/useTask'

const taskLabels: Record<string, string> = {
  chat: 'AI chat is thinking…',
  compare: 'Comparing documents…',
  document: 'Processing document…',
}

const taskRoutes: Record<string, string> = {
  chat: '/chat',
  compare: '/compare',
  document: '/documents',
}

export function GlobalTaskIndicator() {
  const { currentTask } = useTask()

  if (currentTask.status !== 'running' || !currentTask.type) {
    return null
  }

  const label = taskLabels[currentTask.type] || 'Working…'
  const route = taskRoutes[currentTask.type] || '/'

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-card animate-fade-in">
      <Loader2 className="h-4 w-4 animate-spin text-accent" />
      <span className="text-xs font-semibold text-primary">{label}</span>
      <Link
        to={route}
        className="text-xs font-bold text-accent hover:text-primary hover:underline"
      >
        View
      </Link>
    </div>
  )
}
