/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-highlight': 'var(--color-surface-highlight)',
        fg: 'var(--color-foreground)',
        'fg-muted': 'var(--color-foreground-muted)',
        line: 'var(--color-border)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        ai: 'var(--color-ai)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
    },
  },
  plugins: [],
}
