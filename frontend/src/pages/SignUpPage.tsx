import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthInput } from '../components/auth/AuthInput'
import { PasswordInput } from '../components/auth/PasswordInput'
import { AuthDivider } from '../components/auth/AuthDivider'
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
    if (!name.trim()) next.name = 'Name is required'
    else if (name.trim().length < 2) next.name = 'Name must be at least 2 characters'
    if (!email.trim()) next.email = 'Email is required'
    else if (!isValidEmail(email)) next.email = 'Please enter a valid email'
    if (!password) next.password = 'Password is required'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters'
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
      toast.success('Account created successfully! Please sign in.')
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
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-primary">Create an account</h1>
        <p className="mt-1 mb-8 text-xs sm:text-sm text-fg-secondary">
          Join LabelProof to query official prescribing labels.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            id="signup-name"
            label="Full Name"
            type="text"
            placeholder="Dr. Jane Doe"
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
            placeholder="physician@hospital.org"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="signup-password"
            label="Password"
            placeholder="Create a strong password (min 8 chars)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={errors.password}
            autoComplete="new-password"
          />

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

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-pill bg-primary py-3 text-sm font-bold text-white shadow-card transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create LabelProof Account'}
          </button>
        </form>

        <div className="my-6">
          <AuthDivider />
        </div>

        <p className="mt-6 text-center text-xs text-fg-secondary">
          Already have an account?{' '}
          <Link to="/signin" className="font-bold text-primary transition-colors hover:text-accent underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
