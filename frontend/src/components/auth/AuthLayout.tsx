import { AuthBrandPanel } from './AuthBrandPanel'


interface AuthLayoutProps {
  children: React.ReactNode
  panel?: boolean
}

export function AuthLayout({ children, panel = true }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-canvas lg:h-screen lg:overflow-hidden">
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24 bg-canvas">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent-tint border border-accent/30 text-accent font-bold text-sm shadow-sm">
            <span>L</span>
          </div>
          <span className="font-sans text-xs font-bold tracking-[0.16em] uppercase text-text-primary">LABELPROOF</span>
        </div>



        {children}
      </div>
      {panel && <AuthBrandPanel />}
    </div>
  )
}



