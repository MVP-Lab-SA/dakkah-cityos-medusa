import { type ReactNode } from "react"
import { clsx } from "clsx"

type HeadingLevel = "h1" | "h2" | "h3"

const levelStyles: Record<HeadingLevel, string> = {
  h1: "text-xl font-semibold text-ds-foreground",
  h2: "text-base font-semibold text-ds-foreground",
  h3: "text-sm font-semibold text-ds-foreground",
}

interface HeadingProps {
  level?: HeadingLevel
  children: ReactNode
  className?: string
}

export function Heading({ level = "h1", children, className }: HeadingProps) {
  const Tag = level
  return (
    <Tag className={clsx(levelStyles[level], className)}>
      {children}
    </Tag>
  )
}
