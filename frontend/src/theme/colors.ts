export const BaseColors = {
  primary: '#0F766E',
  primaryHover: '#115E59',
  ai: '#06B6D4',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  white: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  surfaceLight: '#FFFFFF',
  backgroundDark: '#0B1120',
  surfaceDark: '#111827',
  surfaceHighlightDark: '#1F2937',
  textPrimaryLight: '#0F172A',
  textSecondaryLight: '#475569',
  textPrimaryDark: '#F1F5F9',
  textSecondaryDark: '#CBD5E1',
  borderLight: '#E2E8F0',
  borderDark: '#263449',
} as const

export type BaseColorKey = keyof typeof BaseColors
