import { FileText } from 'lucide-react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthLayoutProps {
  children: React.ReactNode
  panel?: boolean
}

export function AuthLayout({ children, panel = true }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background lg:h-screen lg:overflow-hidden">
      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-[580px] lg:shrink-0 lg:px-14 xl:px-20">
        {/* Mobile Logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-fg">
            LabelProof
          </span>
        </div>

        <div className="w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none">
          {children}
        </div>
      </div>

      {/* Brand Panel */}
      {panel && <AuthBrandPanel />}
    </div>
  )
}
