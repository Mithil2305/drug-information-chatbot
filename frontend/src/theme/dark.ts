import { BaseColors } from './colors'
import type { ThemeColors } from './types'

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: BaseColors.background,
  backgroundSecondary: BaseColors.backgroundSecondary,
  surface: BaseColors.surface,
  surfaceElevated: BaseColors.surfaceElevated,
  surfaceHover: BaseColors.surfaceHover,
  surfaceHighlight: BaseColors.surfaceHover,
  foreground: BaseColors.textPrimary,
  foregroundMuted: BaseColors.textSecondary,
  border: BaseColors.border,
  borderSubtle: BaseColors.borderSubtle,
  primary: BaseColors.primary,
  primaryHover: BaseColors.primaryHover,
  primaryMuted: BaseColors.primaryMuted,
  ai: BaseColors.ai,
  success: BaseColors.success,
  warning: BaseColors.warning,
  danger: BaseColors.danger,
}
