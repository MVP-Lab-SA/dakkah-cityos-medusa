export const BreakpointTokens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export type Breakpoint = keyof typeof BreakpointTokens

export const ContainerTokens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  padding: {
    base: "1rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "2rem",
    xl: "2rem",
  },
} as const

export const ResponsiveSpacing = {
  section: {
    base: "2rem",
    sm: "3rem",
    md: "4rem",
    lg: "5rem",
  },
  container: {
    base: "1rem",
    sm: "1.5rem",
    md: "2rem",
  },
  stack: {
    base: "1rem",
    sm: "1.5rem",
    md: "2rem",
  },
  grid: {
    base: "1rem",
    sm: "1.25rem",
    md: "1.5rem",
    lg: "2rem",
  },
} as const
