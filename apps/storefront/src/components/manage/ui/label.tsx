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
        "text-sm font-medium text-gray-700",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ms-0.5">*</span>}
    </label>
  )
}
