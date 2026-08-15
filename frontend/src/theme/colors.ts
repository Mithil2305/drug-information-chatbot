export const BaseColors = {
  // v9 Deep Navy Canvas & Surfaces
  bgCanvas: '#0D1220',
  bgSurface: '#141A2A',
  bgSurfaceRaised: '#1A2136',
  bgSurfaceCard: '#141A2A',
  bgSurfaceAlt: '#1A2136',
  bgSurfaceHover: '#1E273E',
  borderHairline: 'rgba(255, 255, 255, 0.06)',
  borderSubtle: 'rgba(255, 255, 255, 0.04)',
  borderSelected: '#22D3E8',

  // Sidebar Rail & Navigation
  sidebarBg: '#141A2A',
  sidebarSurface: '#141A2A',
  sidebarHover: '#1E273E',
  sidebarBorder: 'rgba(255, 255, 255, 0.06)',
  sidebarTextPrimary: '#F1F3F8',
  sidebarTextSecondary: '#8B93A8',
  sidebarTextTertiary: '#565F74',

  // Primary Accent: Cyan (#22D3E8)
  accentPrimary: '#22D3E8',
  accentPrimaryDeep: '#0D3344',
  accentBright: '#38EDFF',
  accentDark: '#0891B2',
  accentPrimaryTint: 'rgba(34, 211, 232, 0.12)',
  accentVerify: '#22D3E8',
  accentVerifyTint: 'rgba(34, 211, 232, 0.12)',
  accentVerifySoft: 'rgba(34, 211, 232, 0.08)',
  accentLink: '#22D3E8',

  // Secondary Accent
  accentSecondary: '#22D3E8',
  accentSecondaryTint: 'rgba(34, 211, 232, 0.12)',

  // Typography
  textPrimary: '#F1F3F8',
  textSecondary: '#8B93A8',
  textTertiary: '#565F74',
  textDisabled: '#3D4659',

  // Semantic Precision States
  success: '#22C55E',
  warning: '#E0A83C',
  danger: '#E0554F',

  // Backwards compatibility mappings
  primary: '#22D3E8',
  primaryHover: '#38EDFF',
  primaryMuted: 'rgba(34, 211, 232, 0.12)',
  ai: '#22D3E8',
  background: '#0D1220',
  backgroundSecondary: '#141A2A',
  surface: '#141A2A',
  surfaceElevated: '#1A2136',
  surfaceHover: '#1E273E',
  border: 'rgba(255, 255, 255, 0.06)',
  textMuted: '#565F74',
} as const




export type BaseColorKey = keyof typeof BaseColors









