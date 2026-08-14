import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md'
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const sizeClasses = size === 'sm'
    ? 'h-8 w-8'
    : 'h-9 w-9'

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`
        relative flex items-center justify-center rounded-pill border border-border
        bg-surface text-fg-secondary shadow-subtle
        transition-all duration-200
        hover:border-primary/40 hover:text-primary hover:bg-surface-highlight
        active:scale-95
        ${sizeClasses}
        ${className}
      `}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
        aria-hidden
      >
        <Moon className={iconSize} />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        aria-hidden
      >
        <Sun className={iconSize} />
      </span>
    </button>
  )
}

export default ThemeToggle
