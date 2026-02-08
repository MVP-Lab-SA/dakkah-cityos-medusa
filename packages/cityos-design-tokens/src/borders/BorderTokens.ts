export const BorderTokens = {
  radius: {
    none: "0px",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  width: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
    "8": "8px",
  },
} as const

export type BorderRadius = keyof typeof BorderTokens.radius
export type BorderWidth = keyof typeof BorderTokens.width
