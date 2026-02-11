import { type ReactNode } from "react"
import { clsx } from "clsx"

type BadgeColor = "gray" | "violet" | "green" | "red" | "orange" | "blue"

const colorStyles: Record<BadgeColor, string> = {
  gray: "bg-gray-100 text-gray-700",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
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
