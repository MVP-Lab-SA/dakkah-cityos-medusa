import { type ReactNode } from "react"
import { clsx } from "clsx"

interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Label({ htmlFor, required, children, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "text-sm font-medium text-ds-foreground/80",
        className
      )}
    >
      {children}
      {required && <span className="text-ds-destructive ms-0.5">*</span>}
    </label>
  )
}
