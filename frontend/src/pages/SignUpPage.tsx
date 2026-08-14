import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
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
      <div className="mx-auto w-full max-w-sm ">
        <h1 className="mb-2 text-2xl font-semibold text-fg">Create your account</h1>
        <p className="mb-8 text-sm text-fg-muted">Join LabelProof to start verifying drug information.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            id="signup-name"
            label="Full name"
            type="text"
            placeholder="Mohanapriyan M"
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
            id="signup-password"
            label="Password"
            placeholder="Create a password"
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
            label="Confirm password"
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
            className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="my-6">
          <AuthDivider />
        </div>

        <p className="mt-8 text-center text-sm text-fg-muted">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary transition-colors hover:text-ai">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
