export const BaseColors = {
  // Brand
  primary:      '#0F8F83',
  primaryHover: '#0B776D',
  primarySoft:  '#DDF5F1',
  accent:       '#16A394',

  // Semantic
  ai:      '#2DD4BF',
  success: '#16A34A',
  warning: '#D97706',
  danger:  '#DC2626',
  white:   '#FFFFFF',

  // Light theme
  backgroundLight:        '#F8FAFC',
  surfaceLight:           '#FFFFFF',
  surfaceHighlightLight:  '#F1F5F9',
  textPrimaryLight:       '#172033',
  textSecondaryLight:     '#64748B',
  borderLight:            '#E2E8F0',

  // Dark theme
  backgroundDark:         '#0B1220',
  surfaceDark:            '#101827',
  surfaceHighlightDark:   '#1A2535',
  textPrimaryDark:        '#E5E7EB',
  textSecondaryDark:      '#9CA3AF',
  borderDark:             '#263448',
} as const

export type BaseColorKey = keyof typeof BaseColors
