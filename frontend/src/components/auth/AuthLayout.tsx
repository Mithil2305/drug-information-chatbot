import { Activity } from 'lucide-react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthLayoutProps {
  children: React.ReactNode
  panel?: boolean
}

export function AuthLayout({ children, panel = true }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background lg:h-screen lg:overflow-hidden">
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold text-fg">LabelProof</span>
        </div>
        {children}
      </div>
      {panel && <AuthBrandPanel />}
    </div>
  )
}
