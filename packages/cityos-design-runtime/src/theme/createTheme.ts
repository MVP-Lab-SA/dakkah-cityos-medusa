import { ColorTokens } from "../../cityos-design-tokens/src/colors/ColorTokens"
import { TypographyTokens } from "../../cityos-design-tokens/src/typography/TypographyTokens"
import { SpacingTokens } from "../../cityos-design-tokens/src/spacing/SpacingTokens"
import { ShadowTokens } from "../../cityos-design-tokens/src/shadows/ShadowTokens"
import { BorderTokens } from "../../cityos-design-tokens/src/borders/BorderTokens"
import type { Theme, CreateThemeOptions, DeepPartial } from "./ThemeTypes"

export const lightTheme: Theme = {
  name: "light",
  mode: "light",
  colors: { ...ColorTokens.light },
  spacing: { ...SpacingTokens },
  typography: {
    fontFamily: { ...TypographyTokens.fontFamily },
    fontSize: { ...TypographyTokens.fontSize },
    fontWeight: { ...TypographyTokens.fontWeight },
    lineHeight: { ...TypographyTokens.lineHeight },
  },
  shadows: { ...ShadowTokens },
  borders: {
    radius: { ...BorderTokens.radius },
    width: { ...BorderTokens.width },
  },
}

export const darkTheme: Theme = {
  name: "dark",
  mode: "dark",
  colors: { ...ColorTokens.dark },
  spacing: { ...SpacingTokens },
  typography: {
    fontFamily: { ...TypographyTokens.fontFamily },
    fontSize: { ...TypographyTokens.fontSize },
    fontWeight: { ...TypographyTokens.fontWeight },
    lineHeight: { ...TypographyTokens.lineHeight },
  },
  shadows: { ...ShadowTokens },
  borders: {
    radius: { ...BorderTokens.radius },
    width: { ...BorderTokens.width },
  },
}

function deepMerge(base: any, override: any): any {
  const result = { ...base }
  for (const key in override) {
    if (Object.prototype.hasOwnProperty.call(override, key)) {
      const baseVal = base[key]
      const overrideVal = override[key]
      if (
        baseVal &&
        overrideVal &&
        typeof baseVal === "object" &&
        typeof overrideVal === "object" &&
        !Array.isArray(baseVal)
      ) {
        result[key] = deepMerge(baseVal, overrideVal)
      } else if (overrideVal !== undefined) {
        result[key] = overrideVal
      }
    }
  }
  return result
}

export function createTheme(options: CreateThemeOptions): Theme {
  const baseTheme = options.mode === "dark" ? darkTheme : lightTheme

  return {
    ...baseTheme,
    name: options.name,
    mode: options.mode,
    colors: options.colors ? { ...baseTheme.colors, ...options.colors } : baseTheme.colors,
    spacing: options.spacing ? { ...baseTheme.spacing, ...options.spacing } : baseTheme.spacing,
    typography: options.typography
      ? deepMerge(baseTheme.typography, options.typography as DeepPartial<typeof baseTheme.typography>)
      : baseTheme.typography,
    shadows: options.shadows ? { ...baseTheme.shadows, ...options.shadows } : baseTheme.shadows,
    borders: options.borders
      ? deepMerge(baseTheme.borders, options.borders as DeepPartial<typeof baseTheme.borders>)
      : baseTheme.borders,
  }
}

export function mergeThemes(base: Theme, override: DeepPartial<Theme>): Theme {
  return deepMerge(base, override)
}

export function extendTheme(base: Theme, extensions: DeepPartial<Omit<Theme, "name" | "mode">>): Theme {
  return deepMerge(base, extensions)
}
