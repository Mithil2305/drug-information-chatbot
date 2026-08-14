import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'warm' | 'outline' | 'dark'
  hover?: boolean
  className?: string
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  const variantStyles: Record<string, string> = {
    default: 'bg-surface border border-border text-fg',
    warm: 'bg-surface-warm border border-border/80 text-fg',
    outline: 'bg-transparent border border-border text-fg',
    dark: 'bg-primary/90 border border-primary-light text-white',
  }

  const base = variantStyles[variant] ?? variantStyles.default

  const hoverStyles = hover
    ? 'cursor-pointer transition-all duration-250 shadow-subtle hover:shadow-hover hover:-translate-y-0.5 hover:border-accent/30'
    : 'shadow-subtle'

  return (
    <div
      className={`rounded-xl p-6 ${base} ${hoverStyles} theme-transition ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
