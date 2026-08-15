import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'


import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthInput } from '../components/auth/AuthInput'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useAuth } from '../hooks/useAuth'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Full name is required'
    else if (name.trim().length < 2) next.name = 'Name must be at least 2 characters'
    if (!email.trim()) next.email = 'Email address is required'
    else if (!isValidEmail(email)) next.email = 'Please enter a valid email address'
    if (!password) next.password = 'Password is required'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters'
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password'
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await register(email, password)
      toast.success('Account created successfully. Please sign in.')
      navigate('/signin')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Try again.'
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
            NEW RESEARCHER ACCOUNT
          </div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-text-primary leading-tight">
            Create your account
          </h1>
          <p className="mt-1.5 text-xs text-text-secondary font-sans">
            Access evidence-grounded drug label intelligence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <AuthInput
            id="signup-name"
            label="Full Name"
            type="text"
            placeholder="Dr. Eleanor Vance"
            icon={User}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={errors.name}
            autoComplete="name"
          />

          <AuthInput
            id="signup-email"
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
            <PasswordInput
              id="signup-password"
              label="Password"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              error={errors.password}
              autoComplete="new-password"
            />
          </div>

          <div>
            <PasswordInput
              id="signup-confirm"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#22D3E8] hover:bg-[#38EDFF] font-sans text-xs font-bold text-[#0D1220] transition-all disabled:opacity-40 shadow-sm cursor-pointer"
          >
            <span>{submitting ? 'Creating account…' : 'Create Account →'}</span>
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-[#22D3E8] hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>



    </AuthLayout>
  )
}




