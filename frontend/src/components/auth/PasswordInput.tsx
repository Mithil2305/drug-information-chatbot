import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-text-secondary font-sans" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <Lock
          className="pointer-events-none absolute left-3 h-4 w-4 text-[#8B93A8]"
          aria-hidden="true"
        />
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className={`h-10 w-full rounded-[6px] bg-surface py-2 pl-10 pr-10 text-xs text-text-primary placeholder:text-text-tertiary outline-none transition-colors font-sans border ${
            error 
              ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger' 
              : 'border-border focus:border-[#22D3E8] focus:ring-1 focus:ring-[#22D3E8]'
          }`}
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2.5 rounded-[4px] p-1 text-text-tertiary transition-colors hover:text-text-primary cursor-pointer"
          aria-label={show ? 'Hide password' : 'Show password'}
          title={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      </div>
      {error && <p className="mt-1 text-[11px] font-sans text-danger">{error}</p>}
    </div>
  )
}








