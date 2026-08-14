import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthInput } from '../components/auth/AuthInput'
import { PasswordInput } from '../components/auth/PasswordInput'
import { AuthDivider } from '../components/auth/AuthDivider'
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Email is required'
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
      navigate('/chat')
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
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-primary">Welcome back</h1>
        <p className="mt-1 mb-8 text-xs sm:text-sm text-fg-secondary">
          Sign in to access the LabelProof clinical AI assistant.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            id="signin-email"
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
            id="signin-password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={errors.password}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-pill bg-primary py-3 text-sm font-bold text-white shadow-card transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in to LabelProof'}
          </button>
        </form>

        <div className="my-6">
          <AuthDivider />
        </div>

        <p className="mt-6 text-center text-xs text-fg-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-bold text-primary transition-colors hover:text-accent underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
