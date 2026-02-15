import { type ReactNode } from "react"
import { clsx } from "clsx"

type TextSize = "xs" | "sm" | "base" | "lg"
type TextColor = "primary" | "secondary" | "muted" | "inherit"

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-sm",
  lg: "text-base",
}

const colorStyles: Record<TextColor, string> = {
  primary: "text-ds-foreground",
  secondary: "text-ds-muted-foreground",
  muted: "text-ds-muted-foreground/70",
  inherit: "text-inherit",
}

interface TextProps {
  size?: TextSize
  color?: TextColor
  weight?: "normal" | "medium" | "semibold"
  as?: "p" | "span" | "div"
  leading?: "tight" | "normal" | "relaxed"
  children: ReactNode
  className?: string
}

export function Text({
  size = "base",
  color = "primary",
  weight = "normal",
  as: Tag = "p",
  leading = "normal",
  children,
  className,
}: TextProps) {
  return (
    <Tag
      className={clsx(
        sizeStyles[size],
        colorStyles[color],
        weight === "medium" && "font-medium",
        weight === "semibold" && "font-semibold",
        leading === "tight" && "leading-tight",
        leading === "relaxed" && "leading-relaxed",
        className
      )}
    >
      {children}
    </Tag>
  )
}
