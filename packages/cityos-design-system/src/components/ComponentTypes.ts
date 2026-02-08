import type React from "react"

export type Size = "xs" | "sm" | "md" | "lg" | "xl"

export type Variant = "primary" | "secondary" | "ghost" | "outline" | "link" | "destructive"

export type ColorScheme = "default" | "primary" | "success" | "warning" | "danger" | "info"

export type Orientation = "horizontal" | "vertical"

export type Alignment = "start" | "center" | "end" | "stretch"

export interface BaseComponentProps {
  className?: string
  id?: string
  testId?: string
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface WithChildren {
  children?: React.ReactNode
}

export interface WithLabel {
  label?: string
  hideLabel?: boolean
}

export interface WithIcon {
  icon?: React.ReactNode
  iconPosition?: "start" | "end"
}

export interface WithTooltip {
  tooltip?: string
  tooltipPosition?: "top" | "bottom" | "left" | "right"
}

export interface WithStatus {
  status?: "idle" | "loading" | "success" | "error"
  statusMessage?: string
}

export interface WithValidation {
  error?: string
  required?: boolean
  helperText?: string
}
