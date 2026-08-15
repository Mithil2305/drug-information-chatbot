import { Moon, Sun } from 'lucide-react'
import { AuthBrandPanel } from './AuthBrandPanel'
import { useTheme } from '../../hooks/useTheme'

interface AuthLayoutProps {
  children: React.ReactNode
  panel?: boolean
}

export function AuthLayout({ children, panel = true }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative flex min-h-screen w-full bg-canvas lg:h-screen lg:overflow-hidden">
      {/* Top-Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-surface text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary border border-border cursor-pointer shadow-sm"
          aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-accent" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
          )}
        </button>
      </div>

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



