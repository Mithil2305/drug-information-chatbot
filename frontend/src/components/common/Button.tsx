import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-pill gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-pill gap-2',
    lg: 'px-7 py-3.5 text-base rounded-pill gap-2.5',
  }[size]

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-subtle hover:shadow-card active:scale-[0.98]',
    secondary: 'bg-teal text-white hover:bg-teal-light shadow-subtle active:scale-[0.98]',
    outline: 'border border-border bg-surface text-fg hover:border-primary hover:text-primary shadow-subtle',
    ghost: 'text-fg-secondary hover:bg-surface-highlight hover:text-fg',
    danger: 'bg-danger text-white hover:opacity-90 shadow-subtle',
  }[variant]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  )
}

export default Button
