import type { LucideIcon } from 'lucide-react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  error?: string
}

export function AuthInput({ label, icon: Icon, error, className, ...props }: AuthInputProps) {
  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-sm font-medium text-fg"
        htmlFor={props.id}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
          aria-hidden="true"
        />
        <input
          {...props}
          className={`h-10 w-full rounded-lg border bg-surface py-0 pl-10 pr-3 text-sm text-fg placeholder-fg-subtle outline-none transition-all focus:ring-2 ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-line focus:border-primary focus:ring-primary/20'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
