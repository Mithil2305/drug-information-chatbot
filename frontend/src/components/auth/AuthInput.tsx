import type { LucideIcon } from 'lucide-react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  error?: string
}

export function AuthInput({ label, icon: Icon, error, className, ...props }: AuthInputProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-text-secondary font-sans" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon
          className="pointer-events-none absolute left-3 h-4 w-4 text-[#8B93A8]"
          aria-hidden="true"
        />
        <input
          {...props}
          className={`h-10 w-full rounded-[6px] bg-surface py-2 pl-10 pr-3 text-xs text-text-primary placeholder:text-text-tertiary outline-none transition-colors font-sans border ${
            error 
              ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger' 
              : 'border-border focus:border-[#22D3E8] focus:ring-1 focus:ring-[#22D3E8]'
          }`}
        />
      </div>

      {error && <p className="mt-1 text-[11px] font-sans text-danger">{error}</p>}
    </div>
  )
}
