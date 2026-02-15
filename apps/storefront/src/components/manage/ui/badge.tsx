import { type ReactNode } from "react"
import { clsx } from "clsx"

type BadgeColor = "gray" | "violet" | "green" | "red" | "orange" | "blue"

const colorStyles: Record<BadgeColor, string> = {
  gray: "bg-ds-muted text-ds-foreground/80",
  violet: "bg-ds-primary/15 text-ds-primary",
  green: "bg-ds-success/15 text-ds-success",
  red: "bg-ds-destructive/15 text-ds-destructive",
  orange: "bg-ds-warning/15 text-ds-warning",
  blue: "bg-ds-info/15 text-ds-info",
}

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
  className?: string
}

export function Badge({ color = "gray", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  )
}
