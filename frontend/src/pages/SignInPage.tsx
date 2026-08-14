import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
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
      <div className="mx-auto w-full max-w-sm ">
        <h1 className="mb-2 text-2xl font-semibold text-fg">Welcome back</h1>
        <p className="mb-8 text-sm text-fg-muted">Sign in to continue using LabelProof.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            id="signin-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
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


          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast.info('Password reset coming soon')}
              className="text-xs font-medium text-fg-muted transition-colors hover:text-fg"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-6">
          <AuthDivider />
        </div>

        <p className="mt-8 text-center text-sm text-fg-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-primary transition-colors hover:text-ai">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
