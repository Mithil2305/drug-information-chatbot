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
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0E3A3A',
          light: '#115150',
          dark: '#082525',
          hover: '#115150',
        },
        teal: {
          DEFAULT: '#1C5959',
          light: '#246D6D',
        },
        accent: {
          DEFAULT: '#0F7772',
          hover: '#0C635F',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          warm: 'var(--color-surface-warm)',
          dark: '#0E3A3A',
          highlight: 'var(--color-surface-highlight)',
        },
        fg: {
          DEFAULT: 'var(--color-foreground)',
          primary: 'var(--color-foreground)',
          secondary: 'var(--color-foreground-secondary)',
          muted: 'var(--color-foreground-muted)',
          dark: '#FFFFFF',
        },
        'text-primary': 'var(--color-foreground)',
        'text-secondary': 'var(--color-foreground-secondary)',
        'text-muted': 'var(--color-foreground-muted)',
        border: {
          DEFAULT: 'var(--color-border)',
          dark: 'rgba(255, 255, 255, 0.14)',
        },
        line: 'var(--color-border)',
        success: '#2F7D65',
        warning: '#B87925',
        danger: '#B64A4A',
        info: '#347A82',
        ai: '#0F7772',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(2, 29, 29, 0.06)',
        hover: '0 14px 40px rgba(2, 29, 29, 0.10)',
        subtle: '0 2px 8px rgba(2, 29, 29, 0.04)',
      },
    },
  },
  plugins: [],
}
