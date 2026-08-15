/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        background:          'var(--color-background)',
        surface:             'var(--color-surface)',
        'surface-highlight': 'var(--color-surface-highlight)',
        'surface-raised':    'var(--color-surface-raised)',
        fg:                  'var(--color-foreground)',
        'fg-muted':          'var(--color-foreground-muted)',
        'fg-subtle':         'var(--color-foreground-subtle)',
        line:                'var(--color-border)',
        'line-strong':       'var(--color-border-strong)',
        primary:             'var(--color-primary)',
        'primary-hover':     'var(--color-primary-hover)',
        'primary-soft':      'var(--color-primary-soft)',
        accent:              'var(--color-accent)',
        ai:                  'var(--color-ai)',
        success:             'var(--color-success)',
        warning:             'var(--color-warning)',
        danger:              'var(--color-danger)',
      },
      transitionDuration: {
        sidebar: '280ms',
      },
      transitionTimingFunction: {
        sidebar: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        chat: '720px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease forwards',
        'slide-in': 'slide-in 200ms ease forwards',
      },
    },
  },
  plugins: [],
}
