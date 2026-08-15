import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Tooltip } from '../common/Tooltip'

interface ThemeToggleProps {
  collapsed?: boolean
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </Tooltip>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </span>
      <span>Appearance</span>
      <span className="ml-auto text-xs text-fg-subtle">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
