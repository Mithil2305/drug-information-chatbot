import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { DocumentStatus as Status } from '../../types/document'

interface DocumentStatusProps {
  status: Status
}

export function DocumentStatus({ status }: DocumentStatusProps) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Ready
      </span>
    )
  }

  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ai/10 px-2.5 py-1 text-xs font-medium text-ai">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Processing
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Failed
    </span>
  )
}
