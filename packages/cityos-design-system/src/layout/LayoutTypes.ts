import type React from "react"
import type { BaseComponentProps, WithChildren, Alignment } from "../components/ComponentTypes"

export interface ContainerProps extends BaseComponentProps, WithChildren {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: boolean
  centered?: boolean
}

export interface GridProps extends BaseComponentProps, WithChildren {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number }
  gap?: string
  rowGap?: string
  columnGap?: string
  alignItems?: Alignment
  justifyItems?: Alignment
}

export interface StackProps extends BaseComponentProps, WithChildren {
  direction?: "row" | "column"
  gap?: string
  align?: Alignment
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  divider?: boolean
}

export interface FlexProps extends BaseComponentProps, WithChildren {
  direction?: "row" | "row-reverse" | "column" | "column-reverse"
  align?: Alignment
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: "wrap" | "nowrap" | "wrap-reverse"
  gap?: string
  inline?: boolean
}

export interface CardProps extends BaseComponentProps, WithChildren {
  variant?: "elevated" | "outlined" | "filled"
  padding?: string
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
}

export interface CardHeaderProps extends BaseComponentProps, WithChildren {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export interface CardBodyProps extends BaseComponentProps, WithChildren {
  padding?: string
}

export interface CardFooterProps extends BaseComponentProps, WithChildren {
  align?: "start" | "center" | "end" | "between"
}

export interface DividerProps extends BaseComponentProps {
  orientation?: "horizontal" | "vertical"
  variant?: "solid" | "dashed" | "dotted"
  label?: string
}

export interface SpacerProps {
  size?: string
  axis?: "horizontal" | "vertical"
}

export interface SectionProps extends BaseComponentProps, WithChildren {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  padding?: string
}

export interface AspectRatioProps extends BaseComponentProps, WithChildren {
  ratio?: number
}
