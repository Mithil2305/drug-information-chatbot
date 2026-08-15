import { Activity } from 'lucide-react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthLayoutProps {
  children: React.ReactNode
  panel?: boolean
}

export function AuthLayout({ children, panel = true }: AuthLayoutProps) {
  return (
    <div className="app-shell flex min-h-screen w-full lg:h-screen lg:overflow-hidden">
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-24">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shadow-card">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="leading-none">
            <div className="text-lg font-semibold text-fg">LabelProof</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Clinical AI</div>
          </div>
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
