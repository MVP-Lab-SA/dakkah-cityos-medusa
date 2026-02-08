export type ThemeMode = "light" | "dark" | "system"

export interface ThemeColors {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  card: string
  cardForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  destructiveForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  info: string
  infoForeground: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  "2xl": string
  "3xl": string
  "4xl": string
}

export interface ThemeTypography {
  fontFamily: { sans: string; display: string; serif: string; mono: string }
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
}

export interface ThemeShadows {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  "2xl": string
  inner: string
}

export interface ThemeBorders {
  radius: Record<string, string>
  width: Record<string, string>
}

export interface Theme {
  name: string
  mode: ThemeMode
  colors: ThemeColors
  spacing: ThemeSpacing
  typography: ThemeTypography
  shadows: ThemeShadows
  borders: ThemeBorders
}

export interface CreateThemeOptions {
  name: string
  mode: ThemeMode
  colors?: Partial<ThemeColors>
  spacing?: Partial<ThemeSpacing>
  typography?: Partial<ThemeTypography>
  shadows?: Partial<ThemeShadows>
  borders?: Partial<ThemeBorders>
}

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }
