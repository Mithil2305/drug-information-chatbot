import { BaseColors } from './colors'
import type { ThemeColors } from './types'

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: BaseColors.backgroundDark,
  surface: BaseColors.surfaceDark,
  surfaceHighlight: BaseColors.surfaceHighlightDark,
  foreground: BaseColors.textPrimaryDark,
  foregroundMuted: BaseColors.textSecondaryDark,
  border: BaseColors.borderDark,
  primary: BaseColors.primary,
  primaryHover: BaseColors.primaryHover,
  ai: BaseColors.ai,
  success: BaseColors.success,
  warning: BaseColors.warning,
  danger: BaseColors.danger,
}
