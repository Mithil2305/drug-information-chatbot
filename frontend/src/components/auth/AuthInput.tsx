import type { LucideIcon } from 'lucide-react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  error?: string
}

export function AuthInput({ label, icon: Icon, error, className, ...props }: AuthInputProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-fg" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
          aria-hidden="true"
        />
        <input
          {...props}
          className={`w-full rounded-lg border bg-surface py-2.5 pl-10 pr-3 text-sm text-fg placeholder-fg-muted outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary ${
            error ? 'border-danger' : 'border-line'
          }`}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
}
