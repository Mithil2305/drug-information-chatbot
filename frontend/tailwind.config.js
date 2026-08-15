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
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['"Source Serif 4"', 'Spectral', 'Georgia', 'serif'],
      },
      colors: {
        // Deep Navy Canvas & Surfaces
        canvas: 'var(--bg-canvas)',
        background: 'var(--bg-canvas)',
        'background-secondary': 'var(--bg-surface-alt)',
        
        surface: 'var(--bg-surface)',
        'surface-alt': 'var(--bg-surface-alt)',
        'surface-card': 'var(--bg-surface-card)',
        'surface-raised': 'var(--bg-surface-raised)',
        'surface-elevated': 'var(--bg-surface-raised)',
        'surface-hover': 'var(--bg-surface-hover)',
        
        hairline: 'var(--border-hairline)',
        border: 'var(--border-hairline)',
        'border-subtle': 'var(--border-hairline)',

        // Sidebar Navigation Tokens
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
          surface: 'var(--sidebar-surface)',
          hover: 'var(--sidebar-hover)',
          border: 'var(--sidebar-border)',
          text: 'var(--sidebar-text-primary)',
          muted: 'var(--sidebar-text-secondary)',
          tertiary: 'var(--sidebar-text-tertiary)',
        },

        // Primary Accent: Precision Teal / Cyan (#19C7D8)
        accent: 'var(--accent-primary)',
        'accent-deep': 'var(--accent-primary-deep)',
        'accent-bright': '#2DD4E8',
        'accent-dark': '#0E6674',
        'accent-tint': 'var(--accent-primary-tint)',
        verify: 'var(--accent-verify)',
        'verify-soft': 'var(--accent-verify-soft)',
        'verify-tint': 'var(--accent-verify-tint)',
        link: 'var(--accent-link)',
        'accent-link': 'var(--accent-link)',

        // Secondary Accent: Evidence Cyan (#2DD4E8)
        cyan: 'var(--accent-secondary)',
        'cyan-tint': 'var(--accent-secondary-tint)',
        ai: 'var(--accent-secondary)',

        primary: 'var(--accent-primary)',
        'primary-hover': '#2DD4E8',
        'primary-muted': 'var(--accent-primary-tint)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-tertiary)',
        'text-disabled': 'var(--text-disabled)',

        success: 'var(--state-success)',
        warning: 'var(--state-warning)',
        danger: 'var(--state-danger)',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '5px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '14px',
        card: '8px',
        panel: '10px',
        btn: '6px',
        modal: '10px',
        badge: '5px',
        pill: '999px',
        full: '999px',
      },
      boxShadow: {
        evidence: 'inset 1px 0 0 0 var(--border-hairline), -4px 0 24px -2px rgba(0, 0, 0, 0.4)',
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        console: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        inputFocus: '0 0 0 2px rgba(25, 199, 216, 0.25)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      },


    },
  },

  plugins: [],
}


