import { BaseColors } from './colors'
import type { ThemeColors } from './types'

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: BaseColors.backgroundLight,
  surface: BaseColors.surfaceLight,
  surfaceHighlight: BaseColors.backgroundLight,
  foreground: BaseColors.textPrimaryLight,
  foregroundMuted: BaseColors.textSecondaryLight,
  border: BaseColors.borderLight,
  primary: BaseColors.primary,
  primaryHover: BaseColors.primaryHover,
  ai: BaseColors.ai,
  success: BaseColors.success,
  warning: BaseColors.warning,
  danger: BaseColors.danger,
}
