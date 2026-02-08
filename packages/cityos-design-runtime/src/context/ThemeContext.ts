import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react"
import type { ReactNode } from "react"
import type { Theme, ThemeMode, DeepPartial } from "../theme/ThemeTypes"
import { lightTheme, darkTheme, mergeThemes } from "../theme/createTheme"
import { injectThemeCSS } from "../css/CSSVariables"

export interface TenantBranding {
  colors?: DeepPartial<Theme["colors"]>
  typography?: DeepPartial<Theme["typography"]>
  spacing?: DeepPartial<Theme["spacing"]>
}

export interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(mode: ThemeMode, tenantBranding?: TenantBranding): Theme {
  const resolvedMode = mode === "system" ? getSystemMode() : mode
  const baseTheme = resolvedMode === "dark" ? darkTheme : lightTheme

  if (!tenantBranding) return baseTheme

  return mergeThemes(baseTheme, {
    colors: tenantBranding.colors,
    typography: tenantBranding.typography,
    spacing: tenantBranding.spacing,
  } as DeepPartial<Theme>)
}

export interface ThemeProviderProps {
  initialTheme?: Theme
  tenantBranding?: TenantBranding
  children: ReactNode
}

export function ThemeProvider({ initialTheme, tenantBranding, children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>("light")
  const [theme, setTheme] = useState<Theme>(() => initialTheme ?? resolveTheme("light", tenantBranding))

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode)
      const resolved = initialTheme
        ? { ...initialTheme, mode: newMode }
        : resolveTheme(newMode, tenantBranding)
      setTheme(resolved)
    },
    [initialTheme, tenantBranding]
  )

  useEffect(() => {
    injectThemeCSS(theme)
  }, [theme])

  useEffect(() => {
    if (mode !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const resolved = initialTheme ?? resolveTheme("system", tenantBranding)
      setTheme(resolved)
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [mode, initialTheme, tenantBranding])

  const value: ThemeContextValue = { theme, mode, setMode }

  return createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
