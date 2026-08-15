import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'



import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthInput } from '../components/auth/AuthInput'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useAuth } from '../hooks/useAuth'

interface FormErrors {
  email?: string
  password?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Email address is required'
    else if (!isValidEmail(email)) next.email = 'Please enter a valid email'
    if (!password) next.password = 'Password is required'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Signed in successfully')
      navigate('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-sm">
        {/* Brand Header */}
        <div className="hidden lg:flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#22D3E8] text-[#0D1220] font-black shadow-sm">
            <span className="text-sm">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-bold tracking-[0.18em] uppercase text-text-primary">LABELPROOF</span>
            <span className="text-[10px] text-text-tertiary font-medium">EVIDENCE AI</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-tertiary font-semibold mb-1">
            CLINICAL INTELLIGENCE
          </div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-text-primary leading-tight">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-xs text-text-secondary font-sans">
            Access evidence-grounded drug label intelligence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            id="signin-email"
            label="Email Address"
            type="email"
            placeholder="researcher@institution.org"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            error={errors.email}
            autoComplete="email"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-text-secondary font-sans" htmlFor="signin-password">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info('Password reset is enabled for registered clinical users.')}
                className="text-xs font-sans text-[#22D3E8] hover:underline transition-colors font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="signin-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          {/* Remember this device Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="remember-device"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded bg-surface text-[#22D3E8] border border-border focus:ring-1 focus:ring-[#22D3E8] cursor-pointer"
            />
            <label htmlFor="remember-device" className="text-xs text-text-secondary cursor-pointer select-none font-sans">
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#22D3E8] hover:bg-[#38EDFF] font-sans text-xs font-bold text-[#0D1220] transition-all disabled:opacity-40 shadow-sm cursor-pointer"
          >
            <span>{submitting ? 'Signing in…' : 'Sign in →'}</span>
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#22D3E8] hover:underline transition-colors">
            Request access
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
