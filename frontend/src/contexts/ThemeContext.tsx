/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'
import { darkTheme, lightTheme, type ThemeColors } from '../theme'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
  colors: ThemeColors
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark')

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const colors = theme === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}
