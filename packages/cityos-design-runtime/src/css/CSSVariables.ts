import type { Theme } from "../theme/ThemeTypes"

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase()
}

function flattenObject(obj: Record<string, unknown>, prefix: string): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    const cssKey = `${prefix}-${camelToKebab(key)}`

    if (typeof value === "string") {
      result[cssKey] = value
    } else if (typeof value === "number") {
      result[cssKey] = String(value)
    } else if (typeof value === "object" && value !== null) {
      const nested = flattenObject(value as Record<string, unknown>, cssKey)
      Object.assign(result, nested)
    }
  }

  return result
}

export function themeToCSSVariables(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {}

  Object.assign(variables, flattenObject(theme.colors as unknown as Record<string, unknown>, "--color"))
  Object.assign(variables, flattenObject(theme.spacing as unknown as Record<string, unknown>, "--spacing"))
  Object.assign(variables, flattenObject(theme.typography as unknown as Record<string, unknown>, "--typography"))
  Object.assign(variables, flattenObject(theme.shadows as unknown as Record<string, unknown>, "--shadow"))
  Object.assign(variables, flattenObject(theme.borders as unknown as Record<string, unknown>, "--border"))

  return variables
}

export function themeToCSS(theme: Theme): string {
  const variables = themeToCSSVariables(theme)
  const declarations = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")

  return `:root {\n${declarations}\n}`
}

const STYLE_ELEMENT_ID = "cityos-theme-css"

export function injectThemeCSS(theme: Theme): void {
  if (typeof document === "undefined") return

  let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null

  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.id = STYLE_ELEMENT_ID
    document.head.appendChild(styleEl)
  }

  styleEl.textContent = themeToCSS(theme)
}
